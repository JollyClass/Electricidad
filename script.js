// --- Referencias a Elementos HTML ---
const frecuenciaInput = document.getElementById('frecuencia');
const amplitudInput = document.getElementById('amplitud');
const medioSelect = document.getElementById('medio');
const frecuenciaValor = document.getElementById('frecuencia-valor');
const amplitudValor = document.getElementById('amplitud-valor');
const iniciarBoton = document.getElementById('iniciar-simulacion');
const canvas = document.getElementById('wave-canvas');

// --- Variables de Simulación ---
let ctx;
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
    if (!canvas) return;
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
    
    time = 0; 

    if (!isSimulating) {
         drawWave(); 
    }
}

// --- Lógica de Dibujo de la Onda (Función Principal) ---
function drawWave() {
    if (!ctx) return;
    
    // 1. Obtener parámetros
    const A = parseFloat(amplitudInput.value);          
    const f = parseFloat(frecuenciaInput.value); 
    const n = parseFloat(medioSelect.value);            
    
    // Parámetros de la Onda
    const waveNumber_k = f * n * 0.05; 
    const angularFrequency_omega = f * 0.05 / n; 
    
    // Dimensiones del Canvas
    const W = canvas.width;
    const H = canvas.height;
    const centerY = H / 2;
    const scaleY = H / (2 * 2.5);

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
    
    for (let x = 0; x < W; x++) {
        const normalizedX = x * 0.1; 

        // Ecuación de onda: Y = A * sin( k*x - ω*t )
        const y = A * Math.sin((waveNumber_k * normalizedX) - (angularFrequency_omega * time));
        
        const pixelY = centerY - (y * scaleY);
        
        if (x === 0) {
            ctx.moveTo(x, pixelY);
        } else {
            ctx.lineTo(x, pixelY);
        }
    }
    ctx.stroke();
    
    // Muestra la configuración actual
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Frec: ${f} Hz | Amplitud: ${A} | Medio (n): ${n}`, 10, 20);
}

// --- Bucle de Animación ---
function animate() {
    if (!isSimulating) {
        return;
    }
    
    time += 0.1; 
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
    // Inicializar el contexto de dibujo
    if (canvas) {
        ctx = canvas.getContext('2d');
    }

    if (!canvas || !ctx) {
        console.error("Error: No se pudo obtener el elemento canvas o su contexto.");
        return; 
    }
    
    // 1. Asignar los listeners de eventos de simulación
    frecuenciaInput.addEventListener('input', updateValues);
    amplitudInput.addEventListener('input', updateValues);
    medioSelect.addEventListener('change', updateValues);
    iniciarBoton.addEventListener('click', toggleSimulation);

    // 2. MANEJO DE LA INFORMACIÓN CONTEXTUAL
    const infoButtons = document.querySelectorAll('.info-btn');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const targetId = `info-${button.dataset.info}`;
            const infoElement = document.getElementById(targetId);
            
            if (infoElement) {
                // Alternar la visibilidad
                infoElement.style.display = (infoElement.style.display === 'none') ? 'block' : 'none';
            }
        });
    });

    // 3. Inicializar el tamaño del canvas y los valores iniciales
    resizeCanvas();
    updateValues(); 
});

window.addEventListener('resize', resizeCanvas);
