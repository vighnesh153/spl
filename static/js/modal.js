export const body = document.querySelector('body');
export const modalButton = document.querySelector('.examples');
export const modalBg = document.querySelector('.modal-bg');
export const modal = document.querySelector('.modal');

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
