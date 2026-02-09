const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(w, h) {
  canvas.width = w;
  canvas.height = h;
}

// ====== Cargar filtro (PNG) ======
const mustacheImg = new Image();
mustacheImg.src = "./assets/mustache.png"; // IMPORTANTE: ruta relativa para GitHub Pages
let mustacheReady = false;

mustacheImg.onload = () => { mustacheReady = true; };
mustacheImg.onerror = () => {
  console.error("No se pudo cargar mustache.png. Revisa la ruta: content/facemesh/assets/mustache.png");
};

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

function drawMustache(landmarks) {
  if (!mustacheReady) return;

  // Puntos útiles (muy usados en FaceMesh web):
  const leftMouth = landmarks[61];   // comisura izquierda
  const rightMouth = landmarks[291]; // comisura derecha
  const upperLip = landmarks[13];    // centro labio superior

  if (!leftMouth || !rightMouth || !upperLip) return;

  // Convertir a pixeles
  const x1 = leftMouth.x * canvas.width;
  const y1 = leftMouth.y * canvas.height;
  const x2 = rightMouth.x * canvas.width;
  const y2 = rightMouth.y * canvas.height;

  const cx = upperLip.x * canvas.width;
  const cy = upperLip.y * canvas.height;

  // Tamaño del bigote basado en la distancia de comisura a comisura
  const mouthWidth = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Ajustes (tú puedes afinarlos)
  const scale = 1.15;                 // bigote un poco más ancho que la boca
  const w = mouthWidth * scale;
  const aspect = mustacheImg.height / mustacheImg.width;
  const h = w * aspect;

  // Subir un poquito el bigote (depende del PNG)
  const yOffset = h * 0.35;

  // Dibujar con rotación
  ctx.save();
  ctx.translate(cx, cy - yOffset);
  ctx.rotate(angle);
  ctx.drawImage(mustacheImg, -w / 2, -h / 2, w, h);
  ctx.restore();
}

faceMesh.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // Si quieres ver puntos + bigote, deja esto:
      for (const p of landmarks) {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = "cyan";
        ctx.fill();
      }

      // Filtro bigote:
      drawMustache(landmarks);
    }
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
