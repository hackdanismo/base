/*
 * Accordion Header selection.
 * Selects all elements with the class "accordion-header".
 * Stores them in a NodeList called accordionHeaders.
 */
const accordionHeaders = document.querySelectorAll(".js-accordion-header");

// Loops through each accordion header found on the page.
accordionHeaders.forEach((header) => {

  /*
   * Adds a click event listener to the current accordion header.
   * The function runs whenever the user clicks this header.
   */
  header.addEventListener("click", () => {
    /*
     * Finds the closest parent element with the class "accordion-item".
     * Stores this element in the currentItem variable.
     */
    const currentItem = header.closest(".js-accordion-item");

    /*
     * Checks whether the current accordion item has the "active" class.
     * Returns true if the item is open, or false if it is closed.
     */
    const isActive = currentItem.classList.contains("active");

    /*
     * Close all accordion items.
     * Selects all accordion items and loops through each one.
     */
    document.querySelectorAll(".js-accordion-item").forEach((item) => {

      /*
       * Removes the "active" class from the current item in the loop.
       * This causes the accordion item to collapse using the CSS styles.
       */
      item.classList.remove("active");

      /*
       * Finds the header button inside the current accordion item.
       * Stores the button element in the button variable.
       */
      const button = item.querySelector(".js-accordion-header");

      /*
       * Finds the content panel inside the current accordion item.
       * Stores the content element in the content variable.
       */
      const content = item.querySelector(".js-accordion-content");

      /*
       * Sets the button's aria-expanded attribute to "false".
       * Tells assistive technologies that this accordion item is closed.
       */
      button.setAttribute("aria-expanded", "false");

      /*
       * Makes the collapsed content inert.
       * Prevents users from focusing or interacting with elements inside it.
       */
      content.inert = true;

    }); // Ends the loop that closes all accordion items.

    /*
     * Open the selected accordion items.
     * Checks whether the clicked accordion item was previously closed.
     * The item only opens if isActive is false.
     */
    if (!isActive) {
      /*
       * Adds the "active" class to the clicked accordion item.
       * This triggers the CSS styles that expand the content panel.
       */
      currentItem.classList.add("active");
      /*
       * Sets the clicked header's aria-expanded attribute to "true".
       * Tells assistive technologies that this accordion item is open.
       */
      header.setAttribute("aria-expanded", "true");

      /*
       * Finds the content panel belonging to the clicked accordion item.
       * Stores the content element in the content variable.
       */
      const content = currentItem.querySelector(
        // Specifies the CSS class of the content panel to find.
        ".js-accordion-content"
      ); // Ends the querySelector method call.

      /*
       * Removes the inert state from the expanded content.
       * Allows users to focus and interact with elements inside it.
       */
      content.inert = false;
    } // Ends the condition that opens the selected accordion item.

  }); // Ends the click event listener for the current header.

}); // Ends the loop through all accordion headers.