less 怎么配置
webpack 优化plugin
文件上传
跨越带cookie
SSR
typescript
node.js
组件npm
for aync await
proxy和Object.defineProperty区别
axios源码
//line=readline()
//print(line)
console.log('Hello World!');
function flatter(arr){
    let result = [];
    arr.forEach(item=>{
        if(item.__proto__.constuctor==Array){
            result = result.concat(flatter(item));
        }else{
            result.push(item);
        }
    })
    return result;
}

let arr=[1,2,[3,[4,5]]];
console.log(flatter(arr));

function test(fn, timer){
    let timeout;
    return function(){
        clearTimeout(timeout);
        let that = this;
        timeout = setTimeout(function(){
            fn.apply(that);
        }, timer)
    }
}
stick 
深拷贝 浅拷贝
rem怎么实现

https://www.cnblogs.com/zhouwenfan-home/p/10469573.html