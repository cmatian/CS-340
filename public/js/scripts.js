$(document).ready(function() {
    // Add Event Listeners to Buttons
    document.querySelectorAll('button.edit, button.save').forEach((el) => {
        el.addEventListener('click', toggleState.bind(this, el));
    })
});

let toggleState = (el) => {
    const parent = el.closest('tr');
    parent.querySelectorAll('.view-layer, .edit-layer').forEach((el) => {
        el.classList.toggle('hidden');
    })
};