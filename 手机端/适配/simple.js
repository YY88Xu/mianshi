(function () {
    'use strict';
    setRemUnit();
    window.addEventListener('resize', setRemUnit);
    function setRemUnit() {
        var domEI = document.documentElement;
        var ratio = 18.75;
        var viewWidth = domEI.getBoundingClientRect().width || window.innerWidth;
        domEI.style.fontSize = viewWidth / ratio + 'px';
    }
})();