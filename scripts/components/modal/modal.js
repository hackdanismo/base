
const modal = document.getElementById('myModal');

const openButton = document.getElementById('openModal');
const closeButton = document.getElementById('closeModal');

// Open as a modal
openButton.addEventListener('click', () => {
  modal.showModal();
});

// Close button
closeButton.addEventListener('click', () => {
  modal.close();
});

// Optional: close when clicking the backdrop
modal.addEventListener('click', (event) => {
  if (event.target !== modal) return;

  const rect = modal.getBoundingClientRect();

  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    modal.close();
  }
});
