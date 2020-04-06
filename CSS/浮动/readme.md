## 浮动造成的问题
父级元素存在高度塌陷，内部有了浮动元素，父级元素高度不能被撑起来。

## 解决方案
方法一： 清除浮动
父级元素新增一个clearfix。
.clearfix:after{
    content: '';
    display: block;
    clear: both;
}
clear: both的原理是给伪元素自动增加了上边距（清除区域），确保它落在浮动元素的下面。
清除区域是在元素上外边距之上增加的额外间隔（确保浮动元素不会与该元素重叠），不允许浮动元素进入这个范围。

优势：不破坏文档结构，没有副作用
劣势：父子元素的垂直外边距重叠。见例子 去除浮动.html

方法二： 包含浮动
BFC特性
(1)BFC会阻止垂直外边距（margin-top、margin-bottom）折叠（属于同一个BFC的两个相邻Box的margin会发生重叠 ）
(2)BFC不会重叠浮动元素
(3)BFC可以包含浮动（计算BFC的高度时，浮动元素的高度也参与计算 ，可以利用BFC的这个特性来“清浮动”，应该说包含浮动。
也就是说只要父容器形成BFC就可以）

根元素本身能触发一个BFC。其他触发BFC的条件：
(1)float （left，right）
(2)overflow 除了visible 以外的值（hidden，auto，scroll）
(3)display (table，table-cell，table-caption，inline-block)
(4)position（absolute，fixed）

## Boostrap清除浮动的css如下
.clearfix:before, .clearfix:after {
    content: " ";
    display: table;
}

.clearfix:after {
    clear: both;
}

/**
 * For IE 6/7 only
 */
.clearfix {
    *zoom: 1;
}

参考：
http://www.ziyi2.cn/2017/08/02/%E6%B8%85%E9%99%A4%E5%92%8C%E5%8E%BB%E9%99%A4%E6%B5%AE%E5%8A%A8/
https://segmentfault.com/a/1190000009636727#item-2-6
https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context





