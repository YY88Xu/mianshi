//__proto__是否可用
const hasProto = '__proto__' in {};
const arrayKeys = arrayMethods.getOwnPropertyNames();

function protoAugment(target, src, keys) {
  target.__proto__ = src;
}
//工具函数
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
function copyAugment(target, src, keys) {
  for(let i=0;i<keys.length;i++){
    const key = keys[i];
    def(target, key, src[key]);
  }
}

class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);

    if(Array.isArray(value)){
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
    }else{
      this.walk(value);
    }
  }

  //walk会将每一个属性都转换成getter/setter的形式来侦测变化，这个方法只有在数据类型为Object时被调用
  walk(obj){
    for(let key in obj){
      defineReactive(obj, key, obj[key]);
    }
  }
}

/**
 * 尝试为value创建一个Observer实例
 * 如果创建成功，直接返回创建的Observer实例
 * 如果value已经存在一个Observer实例，则直接返回
 */
function observer() {
  if(!isObject(value)){
    return;
  }
  let ob;
  //?????
  if(hasOwn(value, '__ob__') && value.__ob__ instanceof Observer){
    ob = value.__ob__;
  }else{
    ob = new Observer(value);
  }
  return ob;
}

function defineReactive(data, key, val) {
  let childOb = observe(val);
  //递归属性
  if(typeof val==='object'){
    new Observer(val)
  }
  let dep = new Dep();
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get(){
      if(window.target){
        dep.depend();
      }
      if(childOb){
        childOb.dep.depend();
      }
      return val;
    },
    set(newVal){
      if(val===newVal){
        return;
      }
      val = newVal;
      dep.notify();
    }
  })
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub){
    this.subs.push(sub);
  }

  depend(){
    if(window.target){
      this.subs.push(window.target);
    }
  }

  notify(){
    const subs = this.subs.slice();
    for(let sub of subs){
      sub.update();
    }
  }
}

const bailRE = /[^\w.$]/;
function parsePath(path) {
 if(bailRE.test(path)){
   return;
 }
 const segments = path.split('.');
 return function (obj) {
  for(let i=0; i<segments.length;i++){
    if(!obj) return;
    obj = obj[segments[i]]
  }
  return obj;
 }
}

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    //执行this.getter(), 就可以读取data.a.b.c的内容
    this.getter = parsePath(expOrFn);
    this.cb = cb;
    this.value = this.get();
  }
  get(){
    window.target = this;
    let value = this.getter.call(this.vm, this.vm);
    window.target = undefined;
    return value;
  }

  update(){
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue)
  }
}

//拦截器
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  //缓存原始方法
  const original = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      console.log("拦截数组啦");
      const ob = this.__ob__;
      return original.apply(this, args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})