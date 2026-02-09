# Proyecto: Visión por Computadora Web con MediaPipe y OpenCV.js

## Descripción general
Este proyecto implementa diferentes técnicas de **visión por computadora en la web** utilizando **HTML y JavaScript**, haciendo uso de herramientas modernas como **MediaPipe Face Mesh** y **OpenCV.js**.

El proyecto se ejecuta completamente en el navegador, utilizando la **webcam** del usuario y es compatible con **GitHub Pages**, por lo que no requiere instalación de software adicional.

---

## Tecnologías utilizadas
- **HTML5**
- **JavaScript**
- **MediaPipe Face Mesh**
- **OpenCV.js**
- **WebRTC (getUserMedia)**
- **GitHub Pages**

---


## Descripción de archivos

### 📁 `assets/`
Contiene los recursos gráficos en formato PNG con fondo transparente utilizados como filtros faciales:
- **hat.png**: imagen del sombrero.
- **mustache.png**: imagen del bigote.

Estos elementos se superponen sobre el rostro detectado

---

### 📁 `js/`

#### `faceMesh.js`
Archivo principal que:
- Inicializa **MediaPipe Face Mesh**.
- Activa la webcam.
- Detecta **468 puntos faciales**.
- Superpone filtros faciales (sombrero, bigote y lunar).
- Funciona como un filtro visual en tiempo real sin mostrar los landmarks.

---

#### `faceMesh2.js`
Versión alternativa del procesamiento facial que:
- Puede incluir variantes del filtrado.
- Permite experimentar con ajustes diferentes de landmarks o visualización.
- Se utiliza como apoyo para pruebas y comparaciones.

---

#### `Sobel.js`
Contiene la implementación del **operador Sobel** utilizando **OpenCV.js**:
- Convierte la imagen a escala de grises.
- Aplica Sobel en los ejes X y Y.
- Combina los gradientes.
- Aplica un umbral configurable.
- Muestra la detección de bordes en tiempo real.

---

### 📄 `index.html`
Página principal del proyecto que:
- Carga el sistema de **MediaPipe Face Mesh**.
- Solicita acceso a la webcam.
- Muestra el filtro facial completo (sombrero, bigote y lunar).
- Funciona como un filtro tipo redes sociales.

---

### 📄 `filtro.html`
Página alternativa enfocada en:
- Pruebas de filtros faciales.
- Visualización específica del procesamiento con MediaPipe.
- Separación lógica entre funcionalidades.

---

### 📄 `Sobel.html`
Página dedicada al **punto 23** del proyecto:
- Activa la webcam.
- Ejecuta el algoritmo de **Sobel en tiempo real**.
- Muestra los bordes detectados en un `canvas`.
- Incluye controles para ajustar el umbral de detección.

---

## Funcionamiento del operador Sobel
El operador de Sobel es un algoritmo clásico de procesamiento de imágenes que permite detectar bordes mediante el cálculo de gradientes de intensidad.

El flujo del algoritmo es:
1. Captura del frame desde la webcam.
2. Conversión a escala de grises.
3. Aplicación de Sobel horizontal y vertical.
4. Cálculo de la magnitud del gradiente.
5. Aplicación de un umbral.
6. Visualización del resultado.

Este método se basa en **derivadas aproximadas utilizando diferencias finitas**.

---

## Comparación entre Sobel y MediaPipe Face Mesh

| Sobel | MediaPipe Face Mesh |
|------|---------------------|
| Algoritmo clásico | Aprendizaje profundo |
| Usa derivadas | Usa CNN |
| Detecta bordes | Detecta landmarks faciales |
| No reconoce semántica | Reconoce estructura facial |
| Rápido y simple | Más preciso y complejo |

---

## Resultados
El proyecto permite:
- Visualizar filtros faciales en tiempo real usando MediaPipe.
- Detectar bordes mediante Sobel utilizando OpenCV.js.
- Comparar técnicas clásicas y modernas de visión por computadora.
- Ejecutar todo el procesamiento directamente en el navegador.

---

## Conclusión
Este proyecto demuestra cómo es posible aplicar técnicas de visión por computadora directamente en la web, combinando métodos clásicos como **Sobel** con enfoques modernos basados en **redes neuronales** como MediaPipe Face Mesh, logrando aplicaciones interactivas y educativas sin necesidad de instalaciones locales.
