
const accordionHeaders = document.querySelectorAll(
  ".accordion-header"
);

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {

    const currentItem = header.closest(".accordion-item");

    const isActive = currentItem.classList.contains("active");

    // Close all accordion items
    document.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("active");

      const button = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");

      button.setAttribute("aria-expanded", "false");
      content.inert = true;
    });

    // Open the selected item if it was previously closed
    if (!isActive) {
      currentItem.classList.add("active");

      header.setAttribute("aria-expanded", "true");

      const content = currentItem.querySelector(
        ".accordion-content"
      );

      content.inert = false;
    }

  });
});
