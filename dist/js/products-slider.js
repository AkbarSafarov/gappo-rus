let productsSlider = new Swiper('.products-slider__content', {
    slidesPerView: 1,
    spaceBetween: 30,

    breakpoints: {
        1200: {
            slidesPerView: 4,
        },

        768: {
            slidesPerView: 3,
        },

        480: {
            slidesPerView: 2,
        },
    },
    // autoHeight:true,

    navigation: {
        nextEl: '.products-slider__btn-right',
        prevEl: '.products-slider__btn-left',
    },
    watchOverflow: true,
})