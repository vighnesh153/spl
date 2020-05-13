const body = document.querySelector('body');
const modalButton = document.querySelector('.examples');
const modalBg = document.querySelector('.modal-bg');
const modal = document.querySelector('.modal');

modalButton.addEventListener('click', () => {
    modalBg.classList.add('bg-active');
    body.style.overflow = 'hidden';
});

modalBg.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
    body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    e.stopPropagation();
});
