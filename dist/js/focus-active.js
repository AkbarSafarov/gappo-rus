function focusActive(containerSelector, itemSelector, activeClass) {
    const containers = document.querySelectorAll(containerSelector);

    function clearAllActive() {
        const allSelectors = document.querySelectorAll(itemSelector)
        allSelectors.forEach(el => el.classList.remove(activeClass));
    }

    containers.forEach(container => {
        const items = container.querySelectorAll(itemSelector);

        items.forEach(el => {
            el.addEventListener('click', () => {
                clearAllActive();
                el.classList.add(activeClass);
            });
        });
    });
}

focusActive('.detailed-thumbs__list', '.detailed-thumbs__item', 'detailed-thumbs__item--active');
focusActive('.h-title', '.h-title__item', 'h-title__item--active');
focusActive('.palette__list', '.palette__item', 'palette__item--active');
focusActive('.pager', '.pager__item:not(.pager__item--link)', 'pager__item--active');

