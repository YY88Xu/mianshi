class Observer {
  constructor(value) {
    this.value = value;

    if(!Array.isArray(value)){
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

function defineReactive(data, key, val) {
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

