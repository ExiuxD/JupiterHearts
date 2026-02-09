# Punto 23 – Detección de Bordes con Sobel (OpenCV.js)

## Descripción general
En este punto se implementó un programa en **HTML y JavaScript** que utiliza el algoritmo **Sobel** para la detección de bordes en tiempo real a partir de la **webcam**.  
La implementación se realizó usando **OpenCV.js**, lo que permite ejecutar procesamiento de imágenes directamente en el navegador sin necesidad de instalaciones adicionales.

El programa es compatible con **GitHub Pages**, por lo que puede ejecutarse completamente en línea.

---

## Tecnologías utilizadas
- **HTML5**: estructura de la página.
- **JavaScript**: lógica del procesamiento de imágenes.
- **OpenCV.js**: librería de visión por computadora.
- **WebRTC (getUserMedia)**: acceso a la cámara web.
- **GitHub Pages**: despliegue del proyecto.

---

## Funcionamiento del algoritmo Sobel
El operador de Sobel es un método clásico de procesamiento de imágenes que permite detectar bordes mediante el cálculo de gradientes de intensidad.

El algoritmo:
1. Convierte la imagen original a **escala de grises**.
2. Aplica dos kernels Sobel:
   - Uno para detectar cambios horizontales (Sobel X).
   - Otro para detectar cambios verticales (Sobel Y).
3. Combina ambos gradientes para obtener la magnitud del borde.
4. Aplica un **umbral** para resaltar únicamente los bordes más relevantes.

Este método se basa en **derivadas aproximadas mediante diferencias finitas**.

---

## Flujo del programa
1. Se solicita acceso a la webcam del usuario.
2. Cada frame del video se dibuja en un elemento `canvas`.
3. El contenido del canvas se convierte en una matriz de OpenCV.
4. Se aplica el operador Sobel sobre la imagen en escala de grises.
5. El resultado se muestra nuevamente en el canvas en tiempo real.
6. Un control deslizante permite ajustar el **umbral** de detección de bordes.

---

## Archivo `index.html`
Este archivo:
- Define la interfaz gráfica.
- Incluye un `video` oculto para la webcam.
- Usa un `canvas` para mostrar el resultado del Sobel.
- Carga OpenCV.js desde un CDN.
- Enlaza el archivo `sobel.js`.

---

## Archivo `sobel.js`
Este archivo contiene la lógica principal:
- Inicialización de la webcam.
- Espera a que OpenCV.js esté completamente cargado.
- Conversión de imágenes a escala de grises.
- Aplicación de Sobel en los ejes X y Y.
- Combinación de gradientes.
- Aplicación de un umbral ajustable.
- Renderizado del resultado en tiempo real.

---

## Resultados
El programa permite visualizar claramente los **bordes faciales y estructurales** de la imagen capturada por la cámara.  
El ajuste del umbral permite observar cómo varía la sensibilidad del algoritmo ante cambios de intensidad.

---

## Comparación con métodos modernos
A diferencia de técnicas basadas en **redes neuronales convolucionales (CNN)**, como MediaPipe Face Mesh, el operador Sobel:
- No requiere entrenamiento previo.
- No identifica semánticamente una cara.
- Únicamente resalta cambios de intensidad.

Esto permite comparar un enfoque **clásico** de visión por computadora con enfoques modernos basados en aprendizaje profundo.

---

## Conclusión
El operador Sobel es una herramienta fundamental en el procesamiento de imágenes que permite detectar bordes de forma eficiente.  
Su implementación en JavaScript mediante OpenCV.js demuestra que es posible realizar visión por computadora en tiempo real directamente en el navegador, siendo ideal para fines educativos y comparativos.

