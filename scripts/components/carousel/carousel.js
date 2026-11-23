
/* Carousel: Select the main carousel element */
const carousel = document.querySelector(".js-carousel");

/* Carousel Slides: Select the container that holds all slides */
const slidesContainer = carousel?.querySelector(".js-carousel-slides");

/* Carousel Slides: Select all individual slide elements */
const slides = carousel?.querySelectorAll(".js-carousel-slide") ?? [];

/* Carousel Buttons: Select the navigation button container */
const carouselButtons = carousel?.querySelector(".js-carousel-buttons");

/* Next Button: Select the button used to advance slides */
const nextButton = carousel?.querySelector(".js-carousel-next");

/* Previous Button: Select the button used to go back */
const prevButton = carousel?.querySelector(".js-carousel-prev");

/* Carousel Dots: Select the pagination dots container */
const dotsContainer = carousel?.querySelector(".js-carousel-dots");

/* Current Index: Tracks the currently displayed slide */
let currentIndex = 0;

/* Auto Scroll Interval: Stores the automatic scrolling timer */
let autoScrollInterval;

/* Carousel Validation: Check that the carousel contains slides */
if (!slidesContainer || slides.length === 0) {

    // Warning: Notify developers when no carousel slides are found
    console.warn("Carousel slides were not found.");

} else {

    /* Single Slide Check: Hide unnecessary controls when only one slide exists */
    if (slides.length <= 1) {

        // Buttons Check: Verify that the navigation container exists
        if (carouselButtons) {

            // Hide Buttons: Remove navigation controls from the layout
            carouselButtons.style.display = "none";

        } // End buttons check

        // Dots Check: Verify that the pagination container exists
        if (dotsContainer) {

            // Hide Dots: Remove pagination controls from the layout
            dotsContainer.style.display = "none";

        } // End dots check

    } // End single slide check

    /* Pagination Setup: Generate pagination dots dynamically */
    if (dotsContainer) {

        // Slide Loop: Create a corresponding dot for each slide
        slides.forEach((slide, index) => {

            // Create Dot: Generate a button element for pagination
            const dot = document.createElement("button");

            // Button Type: Prevent the dot from submitting a parent form
            dot.type = "button";

            // Style Class: Apply the CSS class to the pagination dot
            dot.classList.add("carousel-dot");

            // JavaScript Class: Add a dedicated class for JavaScript selection
            dot.classList.add("js-carousel-dot");

            // Accessibility Label: Describe the destination slide
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

            // First Dot Check: Identify the initial active slide
            if (index === 0) {

                // Active State: Highlight the first pagination dot
                dot.classList.add("active");

                // Accessibility State: Mark the current slide's pagination button
                dot.setAttribute("aria-current", "true");

            } // End first dot check

            // Dot Click: Navigate to the corresponding slide
            dot.addEventListener("click", () => {

                // Update Index: Set the selected slide as the current slide
                currentIndex = index;

                // Update Carousel: Display the selected slide
                updateCarousel();

                // Reset Timer: Restart automatic scrolling after interaction
                resetAutoScroll();

            }); // End dot click event

            // Append Dot: Insert the generated dot into the pagination container
            dotsContainer.appendChild(dot);

        }); // End slide loop

    } // End pagination setup

    /* Pagination Dots: Select all dynamically generated dots */
    const dots = dotsContainer?.querySelectorAll(".js-carousel-dot") ?? [];

    /* Update Carousel: Move slides and update active pagination indicators */
    function updateCarousel() {

        // Slide Width: Measure the width of the first slide in pixels
        const slideWidth = slides[0].clientWidth;

        // Slide Translation: Move the slide container to the selected slide
        slidesContainer.style.transform =
            `translateX(-${currentIndex * slideWidth}px)`;

        // Dot Loop: Update the active state of every pagination dot
        dots.forEach((dot, index) => {

            // Active Class: Highlight only the dot matching the current slide
            dot.classList.toggle("active", index === currentIndex);

            // Accessibility State: Identify the currently selected pagination dot
            if (index === currentIndex) {

                // Current Attribute: Mark the selected pagination button
                dot.setAttribute("aria-current", "true");

            } else {

                // Remove Attribute: Clear the current state from inactive buttons
                dot.removeAttribute("aria-current");

            } // End accessibility state check

        }); // End dot loop

    } // End updateCarousel function

    /* Start Auto Scroll: Automatically advance the carousel at regular intervals */
    function startAutoScroll() {

        // Single Slide Guard: Disable automatic scrolling when unnecessary
        if (slides.length <= 1) return;

        // Start Interval: Run the slide advancement every five seconds
        autoScrollInterval = setInterval(() => {

            // Next Index: Advance the slide and loop back after the final slide
            currentIndex = (currentIndex + 1) % slides.length;

            // Update Carousel: Display the next slide
            updateCarousel();

        }, 5000); // End automatic scrolling interval

    } // End startAutoScroll function

    /* Reset Auto Scroll: Restart the timer after manual navigation */
    function resetAutoScroll() {

        // Clear Interval: Stop the existing automatic scrolling timer
        clearInterval(autoScrollInterval);

        // Restart Interval: Begin a fresh automatic scrolling timer
        startAutoScroll();

    } // End resetAutoScroll function

    /* Next Button: Handle navigation to the next slide */
    nextButton?.addEventListener("click", () => {

        // Next Index: Advance to the next slide and wrap around if necessary
        currentIndex = (currentIndex + 1) % slides.length;

        // Update Carousel: Display the newly selected slide
        updateCarousel();

        // Reset Timer: Restart automatic scrolling after navigation
        resetAutoScroll();

    }); // End next button event

    /* Previous Button: Handle navigation to the previous slide */
    prevButton?.addEventListener("click", () => {

        // Previous Index: Move backwards and wrap to the final slide if necessary
        currentIndex =
            (currentIndex - 1 + slides.length) % slides.length;

        // Update Carousel: Display the newly selected slide
        updateCarousel();

        // Reset Timer: Restart automatic scrolling after navigation
        resetAutoScroll();

    }); // End previous button event

    /* Window Resize: Recalculate slide positioning when the viewport changes */
    window.addEventListener("resize", updateCarousel);

    /* Initial Update: Position the carousel on its first slide */
    updateCarousel();

    /* Initial Auto Scroll: Begin automatic slide navigation */
    startAutoScroll();

} // End carousel validation
