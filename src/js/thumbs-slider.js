let thumbs = new Swiper('.detailed-thumbs__content',{
    spaceBetween: 30,
    slidesPerView: 4,
    freeMode: true,
    
    breakpoints: {
        1200: {
            slidesPerView: 6,
        },

        992: {
            slidesPerView: 4,
        },

        576: {
            slidesPerView: 6,
        }
    },
})

let detailedSlider = new Swiper('.detailed-slider__content',{
    spaceBetween: 30,
    autoHeight: true,

    thumbs:{
        swiper: thumbs,
    },
})