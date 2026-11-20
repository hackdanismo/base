// Select element that matches the class selector
const modal = document.querySelector(".js-modal");

// Select element that matches the class selector
const openButton = document.querySelector(".js-open-modal");
// Select element that matches the class selector
const closeButtons = document.querySelectorAll(".js-close-modal");

if (modal && openButton) {
    // Open the modal when button is clicked
    openButton.addEventListener("click", () => {
        // Check if modal is open
        if (!modal.open) {
            /*
             * Open run this function is modal is not already open.
             * Run the showModal() function to open the HTML5 dialog element. */
            modal.showModal();
        }
    });

    // Close modal when buttons are clicked
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Close the modal using the native close() dialog method.
            modal.close();
        });
    });

    // Listen for a click anywhere on the modal element or backdrop.
    modal.addEventListener("click", (event) => {

        /*
         * Only continue if the modal itself was clicked,
         * rather than one of its child elements (e.g. text or buttons).
         * If a child element was clicked, stop running this function.
         */
        if (event.target !== modal) return;

        /*
         * Get the modal's position and dimensions on the screen.
         * This returns its top, bottom, left and right boundaries.
         */
        const rect = modal.getBoundingClientRect();

        /*
         * Check whether the mouse click happened outside
         * the visible rectangular boundaries of the modal.
         */
        const clickedOutside =
            // Check if the click was to the LEFT of the modal.
            event.clientX < rect.left ||
            // Check if the click was to the RIGHT of the modal.
            event.clientX > rect.right ||
            // Check if the click was ABOVE the modal.
            event.clientY < rect.top ||
            // Check if the click was BELOW the modal.
            event.clientY > rect.bottom;

        /*
         *  If any of the above conditions are true,
         * the user clicked outside the modal.
         */
        if (clickedOutside) {
            // Close the modal using the native HTML5 dialog method.
            modal.close();
        }
    }); // End of the click event listener.
}