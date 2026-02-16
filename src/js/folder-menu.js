const folderMenuNav = document.querySelector('.folder-menu-nav');

function setFolderMenuHeight() {
    const header = document.querySelector('.header');    

    if (header && folderMenuNav) {
        const headerHeight = header.offsetHeight;
        folderMenuNav.style.height = `calc(100vh - ${headerHeight}px)`;
    }
}


document.addEventListener('DOMContentLoaded', function (){
    setFolderMenuHeight();

    window.addEventListener('resize', setFolderMenuHeight);

    const catBtn = document.querySelector('.category-btn');

    catBtn.addEventListener('click', function(){
        folderMenuNav.classList.toggle('open');
        this.classList.toggle('open');
    });

    const firstLevelItems = document.querySelectorAll('.firstlevel');
    
    firstLevelItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            firstLevelItems.forEach(function(el) {
                el.classList.remove('opened');
            });
            
            const allLavelWraps = document.querySelectorAll('.lavel_wrap');
            allLavelWraps.forEach(function(wrap) {
                wrap.classList.remove('opened');
            });
            
            this.classList.add('opened');
            
            const currentLavelWrap = this.querySelector('.lavel_wrap');
            if (currentLavelWrap) {
                currentLavelWrap.classList.add('opened');
            }
        });
    });

    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', function(e) {
            const parentItem = this.parentElement;
            const hasSubmenu = parentItem.querySelector('.mobile-menu__submenu');

            if (hasSubmenu) {
                e.preventDefault();
                parentItem.classList.toggle('active');
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });


    const tabItems = document.querySelectorAll('.detailed-thumbs__item');

    if(tabItems.length) {
        const contentSections = document.querySelectorAll('.about-product__content');

        tabItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');

                tabItems.forEach(tab => tab.classList.remove('detailed-thumbs__item--active'));
                item.classList.add('detailed-thumbs__item--active');
                contentSections.forEach(content => content.classList.remove('active'));
                
                const activeContent = document.querySelector(`[data-content="${tabName}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }


    const descriptionText = document.querySelector('.product-description__text');
    if (descriptionText) {
        descriptionText.classList.add('collapsed');
    }

    function initProductDescription() {
        const productDescriptions = document.querySelectorAll('.product-description');

        productDescriptions.forEach(description => {
            const img = description.querySelector('.product-description__img img');
            const textBlock = description.querySelector('.product-description__text');
            const moreWrap = description.querySelector('.product-description__more');
            const toggleButton = description.querySelector('.more__link');

            function checkHeightAndTruncate() {
                if (!img || !textBlock || !moreWrap) return;

                const imgHeight = img.offsetHeight;
                const wasExpanded = textBlock.classList.contains('expanded');

                textBlock.classList.remove('collapsed', 'expanded');
                textBlock.style.maxHeight = 'none';

                // Получаем реальную высоту текста
                const textHeight = textBlock.scrollHeight;

                let collapsedHeight;
                if (imgHeight < 300) {
                    collapsedHeight = 80;
                } else if (imgHeight < 400) {
                    collapsedHeight = 120;
                } else {
                    collapsedHeight = 160;
                }

                textBlock.style.setProperty('--collapsed-height', `${collapsedHeight}px`);

                if (textHeight > collapsedHeight) {
                    textBlock.classList.add('collapsed');
                    moreWrap.style.display = 'block';

                    if (wasExpanded) {
                        textBlock.classList.remove('collapsed');
                        textBlock.classList.add('expanded');
                    }
                } else {
                    textBlock.classList.remove('collapsed', 'expanded');
                    moreWrap.style.display = 'none';
                }

                textBlock.style.maxHeight = '';
            }

            if (img.complete) {
                checkHeightAndTruncate();
            } else {
                img.addEventListener('load', checkHeightAndTruncate);
            }

            if (toggleButton) {
                toggleButton.addEventListener('click', function(e) {
                    e.preventDefault();

                    const isCollapsed = textBlock.classList.contains('collapsed');

                    if (isCollapsed) {
                        textBlock.classList.remove('collapsed');
                        textBlock.classList.add('expanded');
                        description.classList.add('opened');
                        this.textContent = 'Свернуть';
                    } else {
                        textBlock.classList.remove('expanded');
                        textBlock.classList.add('collapsed');
                        this.textContent = 'Узнать больше';
                        description.classList.remove('opened');

                        description.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                });
            }

            window.addEventListener('resize', debounce(checkHeightAndTruncate, 250));
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    initProductDescription()

    const orderLabel = document.querySelectorAll('.jsOrderLabelHead');

    if(orderLabel.length) {
        orderLabel.forEach(head => {
            head.addEventListener('click', function () {
                const parent = this.closest('.order__item-label.block');
                const allBlocks = document.querySelectorAll('.order__item-label.block');

                allBlocks.forEach(block => {
                    if (block === parent) {
                        block.classList.toggle('active');
                    } else {
                        block.classList.remove('active');
                    }
                });
            });
        });
    }
});



