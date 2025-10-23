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

// Función auxiliar para obtener el valor de una variable CSS
function var2css(cssVar) {
    try {
        return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    } catch (e) {
        if (cssVar === 'var(--color-wave)') return '#ffc107'; 
        if (cssVar === 'var(--color-secondary)') return '#28a745';
        return '#ccc';
    }
}

// --- Ajuste del Canvas (CRUCIAL) ---
function resizeCanvas() {
    canvas.width = canvas.offsetWidth; 
    canvas.height = canvas.offsetHeight;
    if (!isSimulating) {
        drawWave();
    }
}

// --- Funciones de Actualización de Controles ---
function updateValues() {
    frecuenciaValor.textContent = frecuenciaInput.value;
    amplitudValor.textContent = amplitudInput.value;
    
    // Al cambiar la configuración, reiniciamos el tiempo para que el movimiento sea coherente
    time = 0; 

    if (!isSimulating) {
         drawWave(); 
    }
}

// --- Lógica de Dibujo de la Onda (Función Principal) ---
function drawWave() {
    // 1. Obtener parámetros
    const A = parseFloat(amplitudInput.value);          
    
    // La frecuencia se usa directamente sin escalado * 0.1
    const f = parseFloat(frecuenciaInput.value); 
    
    // Índice de refracción
    const n = parseFloat(medioSelect.value);            
    
    // Parámetros de la Onda
    // waveNumber_k (k) controla cuántas crestas hay. Es proporcional a Frecuencia y Medio (n).
    // Factor de 0.05 para que quepan varias ondas en el ancho del canvas
    const waveNumber_k = f * n * 0.05; 
    
    // angularFrequency_omega (ω) controla la velocidad de la fase. Es inversamente proporcional a n.
    // Usamos f*0.01 como factor de movimiento base.
    const angularFrequency_omega = f * 0.05 / n; 

    // Dimensiones del Canvas
    const W = canvas.width;
    const H = canvas.height;
    const centerY = H / 2;
    const scaleY = H / (2 * 2.5); // Escalado para la amplitud

    // 2. Limpiar el Canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    // 3. Dibujar Ejes (Línea central)
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(W, centerY);
    ctx.stroke();

    // 4. Dibujar la Onda (El campo E)
    ctx.beginPath();
    ctx.strokeStyle = var2css('var(--color-wave)');
    ctx.lineWidth = 3;
    
    // Loop para dibujar la curva punto por punto
    for (let x = 0; x < W; x++) {
        // Mapeo de la coordenada de píxel a una coordenada física simulada.
        const normalizedX = x * 0.1; // Escala la posición x

        // Ecuación de onda: Y = A * sin( k*x - ω*t )
        const y = A * Math.sin((waveNumber_k * normalizedX) - (angularFrequency_omega * time));
        
        // Mapear al espacio de píxeles
        const pixelY = centerY - (y * scaleY);
        
        if (x === 0) {
            ctx.moveTo(x, pixelY);
        } else {
            ctx.lineTo(x, pixelY);
        }
    }
    ctx.stroke();
    
    // Muestra la configuración actual para referencia
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Frec: ${f} Hz | Amplitud: ${A} | Medio (n): ${n}`, 10, 20);
}

// --- Bucle de Animación ---
function animate() {
    if (!isSimulating) {
        return;
    }
    
    time += 0.1; // Incremento del tiempo acelerado
    drawWave();
    
    animationFrameId = requestAnimationFrame(animate);
}

// --- Control de Inicio/Detención ---
function toggleSimulation() {
    isSimulating = !isSimulating;
    if (isSimulating) {
        iniciarBoton.textContent = 'Detener Simulación';
        iniciarBoton.style.backgroundColor = '#dc3545';
        animate();
    } else {
        iniciarBoton.textContent = 'Iniciar Simulación';
        iniciarBoton.style.backgroundColor = var2css('var(--color-secondary)');
        cancelAnimationFrame(animationFrameId);
        drawWave(); 
    }
}

// --- Event Listeners y Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    if (!canvas || !ctx) {
        console.error("Error: No se pudo obtener el elemento canvas o su contexto.");
        return; 
    }
    
    // 1. Asignar los listeners de eventos para interactividad
    frecuenciaInput.addEventListener('input', updateValues);
    amplitudInput.addEventListener('input', updateValues);
    medioSelect.addEventListener('change', updateValues);
    iniciarBoton.addEventListener('click', toggleSimulation);

    // 2. Inicializar el tamaño del canvas y los valores
    resizeCanvas();
    updateValues(); 
});

window.addEventListener('resize', resizeCanvas);
