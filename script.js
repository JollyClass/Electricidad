// --- Referencias a Elementos HTML ---
const frecuenciaInput = document.getElementById('frecuencia');
const amplitudInput = document.getElementById('amplitud');
const medioSelect = document.getElementById('medio');
const frecuenciaValor = document.getElementById('frecuencia-valor');
const amplitudValor = document.getElementById('amplitud-valor');
const iniciarBoton = document.getElementById('iniciar-simulacion');
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');

// --- Variables de Simulación ---
let animationFrameId;
let isSimulating = false;
let time = 0;
const speedOfLight = 300; // Velocidad de la luz simulada (para escala)

// Función auxiliar para obtener el valor de una variable CSS
function var2css(cssVar) {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
}

// --- Ajuste del Canvas (CRUCIAL) ---
function resizeCanvas() {
    // Establecer los atributos width/height del canvas a sus dimensiones reales en píxeles.
    canvas.width = canvas.offsetWidth; 
    canvas.height = canvas.offsetHeight;
    
    // Redibujar inmediatamente si no hay animación
    if (!isSimulating) {
        drawWave();
    }
}

// --- Funciones de Actualización de Controles ---
function updateValues() {
    frecuenciaValor.textContent = frecuenciaInput.value;
    amplitudValor.textContent = amplitudInput.value;
    
    // Si la simulación está detenida, actualiza el dibujo para reflejar los cambios
    if (!isSimulating) {
         drawWave(); 
    }
}

// --- Lógica de Dibujo de la Onda (Función Principal) ---
function drawWave() {
    // 1. Obtener parámetros
    const f = parseFloat(frecuenciaInput.value) * 0.1; // Frecuencia escalada
    const A = parseFloat(amplitudInput.value);          // Amplitud
    const n = parseFloat(medioSelect.value);            // Índice de refracción
    
    // Calcular longitud de onda simulada
    const lambda = speedOfLight / (n * f); 

    // Dimensiones del Canvas
    const W = canvas.width;
    const H = canvas.height;
    const centerY = H / 2;
    const scaleY = H / (2 * 2.5); // Escalado de amplitud

    // 2. Limpiar el Canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    // 3. Dibujar Ejes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(W, centerY);
    ctx.stroke();

    // 4. Dibujar la Onda
    ctx.beginPath();
    ctx.strokeStyle = var2css('var(--color-wave)');
    ctx.lineWidth = 3;
    
    const angularFrequency = 2 * Math.PI * f;
    const waveNumber = (2 * Math.PI) / lambda;

    // Loop para dibujar la curva punto por punto
    for (let x = 0; x < W; x++) {
        // Mapeo de la coordenada de píxel a una coordenada física simulada
        const normalizedX = (x / W) * (15 * lambda); 

        // Ecuación de onda: Y = A * sin( k*x - ω*t )
        const y = A * Math.sin(waveNumber * normalizedX - angularFrequency * time);
        
        // Mapear al espacio de píxeles
        const pixelY = centerY - (y * scaleY);
        
        if (x === 0) {
            ctx.moveTo(x, pixelY);
        } else {
            ctx.lineTo(x, pixelY);
        }
    }
    ctx.stroke();
}

// --- Bucle de Animación ---
function animate() {
    if (!isSimulating) {
        return;
    }
    
    time += 0.05; // Incremento del tiempo para simular la propagación
    drawWave();
    
    animationFrameId = requestAnimationFrame(animate);
}

// --- Control de Inicio/Detención ---
function toggleSimulation() {
    isSimulating = !isSimulating;
    if (isSimulating) {
        // Iniciar
        iniciarBoton.textContent = 'Detener Simulación';
        iniciarBoton.style.backgroundColor = '#dc3545'; // Rojo
        animate();
    } else {
        // Detener
        iniciarBoton.textContent = 'Iniciar Simulación';
        iniciarBoton.style.backgroundColor = var2css('var(--color-secondary)'); // Verde
        cancelAnimationFrame(animationFrameId);
        drawWave(); // Asegurar que el dibujo estático final es correcto
    }
}

// --- Event Listeners y Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar los listeners de eventos para interactividad
    frecuenciaInput.addEventListener('input', updateValues);
    amplitudInput.addEventListener('input', updateValues);
    medioSelect.addEventListener('change', updateValues);
    iniciarBoton.addEventListener('click', toggleSimulation);

    // 2. Inicializar el tamaño del canvas y los valores
    resizeCanvas();
    updateValues();
});

// Listener para redimensionamiento de la ventana
window.addEventListener('resize', resizeCanvas);
