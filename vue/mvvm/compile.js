class Compile {
    constructor(el, vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        //如果这个元素能获取到，我们才开始编译
        if(this.el){
            // 1. 先把这些真实的DOM移入内存中
            let fragment = this.node2fragment(this.el);
            // 2. 编译 => 提取想要的元素节点 v-model 和 文本节点 {{}}
            this.compile(fragment);
            // 3. 编译好的fragment再塞回页面里去
            this.el.appendChild(fragment);
        }
    }

    //辅助方法
    isElementNode(node){
        return node.nodeType === 1;
    }

    //核心方法
    node2fragment(el){
        //文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild=el.firstChild) {
            fragment.appendChild(firstChild)
        }
        return fragment;
    }

    compile(fragment){
        //遍历节点 可能节点套着又一层节点，所以需要递归
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //元素是节点，继续递归
                this.compileElement(node);
                this.compile(node);
            }else{
                //文本节点
                this.compileText(node);
            }
        })
    }

    //判断是否是指令
    isDirective(name){
        return name.includes('v-');
    }

    // v-model 编译
    compileElement(node){
        //取出当前节点的属性
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr=>{
            let attrName = attr.name;
            //判断属性名是否包含 v-
            if (this.isDirective(attrName)) {
                let expr = attr.value;
                // v-model v-html v-text
                let [, type] = attrName.split('-');
                CompileUtil[type](node, this.vm, expr);
            }

        })
    }

    compileText(node){
        //编译{{}}
        let expr = node.textContent;
        let reg = /\{\{([^}]+)\}\}/g;
        if(reg.test(expr)){
            CompileUtil['text'](node, this.vm, expr);
        }
    }

}

CompileUtil = {
    //获取实例上对应的数据
    getVal(vm, expr){
        expr = expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next]
        }, vm.$data)
    },
    getTextVal(vm, expr){
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    text(node, vm, expr) { // 文本处理 参数 [节点, vm 实例, 指令的属性值]
        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm, expr)
        updateFn && updateFn(node, value)
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], () => {
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })

    },
    setVal(vm, expr, value) {
        expr = expr.split('.');
        // 收敛
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length - 1) {
                return prev[next] = value
            }
            return prev[next]
        }, vm.$data)
    },
    model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // 这里应该加一个监控，数据变化了，应该调用watch 的callback
        new Watcher(vm, expr, (newValue) => {
            // 当值变化后会调用cb 将newValue传递过来（）
            updateFn && updateFn(node, this.getVal(vm, expr))
        });

        node.addEventListener('input', e => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue)
        })
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }

}









