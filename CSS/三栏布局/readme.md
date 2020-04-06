实现三栏布局的方法：

## float方法
（1）左边向左浮动，右边像右浮动。并设置他们的宽度；
（2）中间元素margin-left,margin-right。
缺点：三栏布局高度不能保持一致

## flexbox布局
（1）父元素display: flex;
（2）左右设置宽度；中间设置flex-grow:1.

## table布局
（1）父元素 display: table;width 100%
（2）子元素 display:table-cell, 左右两边设置宽度

## grid布局
父级元素：display: grid; grid-template-columns: 200px auto 200px;

## 绝对定位解决方案
（1）父级元素display: relative; 子元素全部 display: absolute;
（2）子元素左边left:0;右边子元素right:0;中间子元素:right:200px;left:200px.
缺点：高度不能保持一致。