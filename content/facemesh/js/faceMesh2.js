const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(w, h) {
  canvas.width = w;
  canvas.height = h;
}

// ====== Cargar assets ======
function loadAsset(src) {
  const img = new Image();
  img.src = src;
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
  });
}

let mustacheImg, hatImg;

(async () => {
  try {
    mustacheImg = await loadAsset("./assets/mustache.png");
    hatImg = await loadAsset("./assets/hat.png");
  } catch (e) {
    console.error(e);
  }
})();

// ====== FaceMesh ======
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Helpers
function toPx(p) {
  return { x: p.x * canvas.width, y: p.y * canvas.height };
}

function drawOverlayImage(img, cx, cy, w, h, angleRad) {
  if (!img) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

// ====== BIGOTE ======
function drawMustache(landmarks) {
  if (!mustacheImg) return;

  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const upperLip = landmarks[13];
  if (!leftMouth || !rightMouth || !upperLip) return;

  const p1 = toPx(leftMouth);
  const p2 = toPx(rightMouth);
  const pc = toPx(upperLip);

  const mouthWidth = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  const scale = 1.15; // ancho relativo
  const w = mouthWidth * scale;
  const h = w * (mustacheImg.height / mustacheImg.width);

  const yOffset = h * 0.35; // súbelo/bájalo si quieres
  drawOverlayImage(mustacheImg, pc.x, pc.y - yOffset, w, h, angle);
}

// ====== SOMBRERO ======
function drawHat(landmarks) {
  if (!hatImg) return;

  // 234 y 454: laterales de la cara (aprox sienes)
  const leftTemple = landmarks[234];
  const rightTemple = landmarks[454];
  // 10: parte alta de la frente
  const foreheadTop = landmarks[10];
  if (!leftTemple || !rightTemple || !foreheadTop) return;

  const pL = toPx(leftTemple);
  const pR = toPx(rightTemple);
  const pT = toPx(foreheadTop);

  const faceWidth = Math.hypot(pR.x - pL.x, pR.y - pL.y);
  const angle = Math.atan2(pR.y - pL.y, pR.x - pL.x);

 // Tamaño del sombrero (ligeramente más compacto)
const w = faceWidth * 1.85;
const h = w * (hatImg.height / hatImg.width);

// Offset vertical: MÁS BAJO para que se apoye en la cabeza
const yOffset = h * 0.40;

const cx = pT.x;
const cy = pT.y - yOffset;


  drawOverlayImage(hatImg, cx, cy, w, h, angle);
}

// ====== LUNAR ======
function drawMole(landmarks) {
  // Landmark 50: zona mejilla izquierda (puede variar, pero suele servir como “punto de mejilla”)
  const cheek = landmarks[50];
  if (!cheek) return;

  const p = toPx(cheek);

  // Ajuste fino: muévelo un poquito para que quede donde te guste
  const dx = 10;  // derecha/izquierda
  const dy = 8;   // arriba/abajo

  const x = p.x + dx;
  const y = p.y + dy;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(20,20,20,0.95)";
  ctx.fill();
  ctx.restore();
}

faceMesh.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo: el video
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  // Filtros
  const faces = results.multiFaceLandmarks;
  if (faces && faces.length > 0) {
    const landmarks = faces[0];

    // Orden importa (sombrero detrás del bigote normalmente se ve bien)
    drawHat(landmarks);
    drawMustache(landmarks);
    drawMole(landmarks);
  }
});

// Webcam
const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();

video.addEventListener("loadeddata", () => {
  resizeCanvas(video.videoWidth, video.videoHeight);
});
