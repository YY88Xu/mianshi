class Vue {
    constructor(options){
        //挂载
        this.$el = options.el;
        this.$data = options.data;

        //如果有要编译的模板就开始编译
        if(this.$el){
            //用数据和元素进行编译
            new Observer(this.$data);
            new Compile(this.$el, this);
        }
    }
}