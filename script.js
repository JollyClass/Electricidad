// ... dentro de document.addEventListener('DOMContentLoaded', () => { ...

    // --- Manejo de la Información Contextual ---
    const infoButtons = document.querySelectorAll('.info-btn');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Previene que el botón ejecute cualquier acción por defecto (como enviar un formulario)
            e.preventDefault(); 
            
            // Obtiene el ID del elemento de texto que debe mostrarse/ocultarse
            const targetId = `info-${button.dataset.info}`;
            const infoElement = document.getElementById(targetId);
            
            if (infoElement) {
                // Alternar la visibilidad (si está 'none', lo muestra, si está visible, lo oculta)
                if (infoElement.style.display === 'none') {
                    infoElement.style.display = 'block';
                } else {
                    infoElement.style.display = 'none';
                }
            }
        });
    });

    // ... Resto del código de inicialización (resizeCanvas, updateValues, etc.) ...
});
