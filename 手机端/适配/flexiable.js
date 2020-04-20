(function () {
    'use strict';
    var domEI = document.documentElement,
        viewportEI = document.querySelector('meta[name="viewport"]'),
        dpr = window.devicePixelRatio || 1,
        maxWidth = 540,
        minWidth = 320;
    dpr = dpr >= 3 ? 3: (dpr >=2 ? 2 : 1);
    //自定义属性
    domEI.setAttribute('data-dpr', dpr);
    domEI.setAttribute('maxWidth', maxWidth);
    domEI.setAttribute('minWidth', minWidth);
    var scale = 1/dpr,
        content = 'width=device-width, initial-scale=' + scale + ', maximum-scale='+
            scale+', minimum-scale='+scale+', user-scalable=no';
    if(viewportEI){
        viewportEI.setAttribute('content', content);
    } else {
        viewportEI = document.createElement('meta');
        viewportEI.setAttribute('name', 'viewport');
        viewportEI.setAttribute('content', content);
        document.appendChild(viewportEI);
    }

    setRemUnit();
    window.addEventListener('resize', setRemUnit);
    function setRemUnit() {
        var ratio = 18.75;
        var viewWidth = domEI.getBoundingClientRect().width || window.innerWidth;

        if(maxWidth&&(viewWidth/dpr)>maxWidth){
            viewWidth = maxWidth*dpr;
        }

        if(minWidth&&(viewWidth/dpr)<minWidth){
            viewWidth = minWidth*dpr;
        }

        domEI.style.fontSize = viewWidth / ratio + 'px';
    }
})();