const btn = document.querySelector('.btn-flotante');
const footer = document.querySelector('.site-footer');
console.log(footer)

btn.addEventListener('click', mostrarOcultarFooter);

function mostrarOcultarFooter( event ) {
    event.preventDefault();
    if( footer.classList.contains('activo') ) {
        footer.classList.remove('activo');
        this.classList.remove('activo');
        this.textContent = 'Más información';
    } else {
        footer.classList.add('activo');
        this.classList.add('activo');
        this.textContent = 'Cerrar';
    }
}