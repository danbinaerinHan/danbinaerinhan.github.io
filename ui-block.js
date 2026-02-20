document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
  });

  document.addEventListener('contextmenu', (event) => {
    if (event.target && event.target.closest('img')) {
      event.preventDefault();
    }
  });
});
