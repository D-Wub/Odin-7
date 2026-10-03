const modal = document.getElementById("confirmModal");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");
const deleteBtns = document.querySelectorAll(".delete-text");

let selectedForm = null;

function showModal() {
  modal.style.display = 'flex';
}

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectedForm = deleteBtn.closest(".delete-form");
    showModal();
  })
})


cancelBtn.addEventListener('click', () => {
  selectedForm = null;
  modal.style.display = 'none';
});

confirmBtn.addEventListener('click', () => {
  if (selectedForm){
    selectedForm.submit();
  }
  modal.style.display = 'none';
});
