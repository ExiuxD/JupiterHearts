const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const statusEl = document.getElementById("status");
const th = document.getElementById("th");
const thVal = document.getElementById("thVal");

th.addEventListener("input", () => {
  thVal.textContent = th.value;
});

function resizeCanvas(w, h) {
  canvas.width = w;
  canvas.height = h;
}

// 1) Iniciar webcam
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false
  });
  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onloadedmetadata = () => resolve();
  });

  resizeCanvas(video.videoWidth, video.videoHeight);
}

// 2) Esperar a que OpenCV esté listo
function waitForOpenCVReady() {
  return new Promise((resolve) => {
    const check = () => {
      if (typeof cv !== "undefined" && cv.Mat) resolve();
      else setTimeout(check, 50);
    };
    check();
  });
}

function sobelLoop() {
  // Crear mats una sola vez
  const w = canvas.width, h = canvas.height;

  const src = new cv.Mat(h, w, cv.CV_8UC4);
  const gray = new cv.Mat(h, w, cv.CV_8UC1);
  const gradX = new cv.Mat(h, w, cv.CV_16S);
  const gradY = new cv.Mat(h, w, cv.CV_16S);
  const absX = new cv.Mat(h, w, cv.CV_8UC1);
  const absY = new cv.Mat(h, w, cv.CV_8UC1);
  const grad = new cv.Mat(h, w, cv.CV_8UC1);
  const edges = new cv.Mat(h, w, cv.CV_8UC1);
  const rgba = new cv.Mat(h, w, cv.CV_8UC4);

  const ksize = 3; // tamaño del kernel Sobel

  const process = () => {
    try {
      // Dibujar frame actual en canvas
      ctx.drawImage(video, 0, 0, w, h);

      // Leer del canvas a OpenCV
      const imgData = ctx.getImageData(0, 0, w, h);
      src.data.set(imgData.data);

      // Convertir a grises
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Sobel X y Y
      cv.Sobel(gray, gradX, cv.CV_16S, 1, 0, ksize, 1, 0, cv.BORDER_DEFAULT);
      cv.Sobel(gray, gradY, cv.CV_16S, 0, 1, ksize, 1, 0, cv.BORDER_DEFAULT);

      // Valor absoluto y combinar
      cv.convertScaleAbs(gradX, absX);
      cv.convertScaleAbs(gradY, absY);
      cv.addWeighted(absX, 0.5, absY, 0.5, 0, grad);

      // Umbral para que se vea más tipo “bordes”
      const t = parseInt(th.value, 10);
      cv.threshold(grad, edges, t, 255, cv.THRESH_BINARY);

      // Mostrar en canvas (convertimos a RGBA)
      cv.cvtColor(edges, rgba, cv.COLOR_GRAY2RGBA);

      const out = new ImageData(new Uint8ClampedArray(rgba.data), w, h);
      ctx.putImageData(out, 0, 0);

      requestAnimationFrame(process);
    } catch (e) {
      console.error(e);
      statusEl.textContent = "Error ejecutando Sobel (revisa consola).";
    }
  };

  statusEl.textContent = "OpenCV listo ✅ Mostrando Sobel.";
  requestAnimationFrame(process);

  // Limpieza cuando cierres pestaña
  window.addEventListener("beforeunload", () => {
    src.delete(); gray.delete(); gradX.delete(); gradY.delete();
    absX.delete(); absY.delete(); grad.delete(); edges.delete(); rgba.delete();
  });
}

// Main
(async () => {
  try {
    statusEl.textContent = "Pidiendo permiso de cámara…";
    await startCamera();

    statusEl.textContent = "Cargando OpenCV.js…";
    await waitForOpenCVReady();

    sobelLoop();
  } catch (e) {
    console.error(e);
    statusEl.textContent = "No se pudo iniciar (¿permiso de cámara bloqueado?).";
  }
})();
