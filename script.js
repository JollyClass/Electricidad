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
// Factor de escala para que la velocidad de fase (V = c/n) sea visible
const c_scale = 10; 

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
    // La amplitud no se escala
    const A = parseFloat(amplitudInput.value);          
    
    // La frecuencia se escala para el cálculo
    const f = parseFloat(frecuenciaInput.value) * 0.1; 
    
    // Índice de refracción (n): 1.0 para vacío, 1.52 para vidrio, etc.
    const n = parseFloat(medioSelect.value);            
    
    // Parámetros de la Onda
    // k (Número de onda) controla cuántas crestas caben en la pantalla.
    // k = 2 * pi / lambda. Como lambda = c / (n * f), entonces k es proporcional a n*f.
    const waveNumber_k = f * n * 0.5; 
    
    // Omega (Frecuencia angular) controla la velocidad de la fase.
    // ω = 2 * pi * f
    const angularFrequency_omega = 2 * Math.PI * f / n; // V_fase = ω/k = c/n (Simulado)

    // Dimensiones del Canvas
    const W = canvas.width;
    const H = canvas.height;
    const centerY = H / 2;
    const scaleY = H / (2 * 2.5); 

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
    
    // Loop para dibujar la curva punto por punto
    for (let x = 0; x < W; x++) {
        // Mapeo de la coordenada de píxel a una coordenada física simulada.
        const normalizedX = x * 0.05; // Escala la posición x
        
        // Ecuación de onda: Y = A * sin( k*x - ω*t )
        // La velocidad de propagación es V = ω/k = (2*pi*f/n) / (f*n*const)
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
    
    // Opcional: Mostrar información del medio en el canvas (solo para depuración)
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Medio: n=${n} | Frec: ${f.toFixed(1)*10} Hz`, 10, 20);
}

// --- Bucle de Animación ---
function animate() {
    if (!isSimulating) {
        return;
    }
    
    // Ajuste de la velocidad de tiempo
    time += 0.05; 
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
