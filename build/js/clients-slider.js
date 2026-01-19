const clientsSlider = new Swiper('.clients-slider__content', {
    slidesPerView: 1,
    spaceBetween: 30,

    breakpoints: {
        992: {
            slidesPerView: 4,
        },

        768: {
            slidesPerView: 3,
        },
        480: {
            slidesPerView: 2,
        }
    },

    navigation: {
        nextEl: '.products-slider__btn-right',
        prevEl: '.products-slider__btn-left',
    },
})
//# sourceMappingURL=clients-slider.js.map
