const slidesContainer = document.querySelector(".carousel__slides");
const slides = document.querySelectorAll(".carousel__slide");
const carouselButtons = document.querySelector(".carousel__buttons");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");
const dotsContainer = document.querySelector(".carousel__dots");

let currentIndex = 0;
let autoScrollInterval;

// Stop if the carousel has no slides.
if (!slidesContainer || slides.length === 0) {
    console.warn("Carousel slides were not found.");
} else {
    // Hide navigation if the carousel has only one slide.
    if (slides.length <= 1) {
        if (carouselButtons) {
            carouselButtons.style.display = "none";
        }

        if (dotsContainer) {
            dotsContainer.style.display = "none";
        }
    }

    // Create the dots dynamically.
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("carousel__dot");

            if (index === 0) {
                dot.classList.add("active");
            }

            dot.addEventListener("click", () => {
                currentIndex = index;
                updateCarousel();
                resetAutoScroll();
            });

            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll(".carousel__dot");

    function updateCarousel() {
        const slideWidth = slides[0].clientWidth;

        slidesContainer.style.transform =
            `translateX(-${currentIndex * slideWidth}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function startAutoScroll() {
        if (slides.length <= 1) return;

        autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    nextButton?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
        resetAutoScroll();
    });

    prevButton?.addEventListener("click", () => {
        currentIndex =
            (currentIndex - 1 + slides.length) % slides.length;

        updateCarousel();
        resetAutoScroll();
    });

    window.addEventListener("resize", updateCarousel);

    updateCarousel();
    startAutoScroll();
}