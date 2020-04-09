参考：https://www.cnblogs.com/nyw1983/p/11333471.html
发生外边距重叠的两个条件：（1）必须是相邻的（2）必须是垂直方向
示例1：相邻同级元素margin取最大的；
示例2：父子相邻导致子元素margin影响父元素。
破解方法是使他们不相邻。

根元素或其它包含它的元素；
浮动 (元素的float不为none)；
绝对定位元素 (元素的position为absolute或fixed)；
行内块inline-blocks(元素的 display: inline-block)；
表格单元格(元素的display: table-cell，HTML表格单元格默认属性)；
overflow的值不为visible的元素；
弹性盒 flex boxes (元素的display: flex或inline-flex)；

https://juejin.im/post/59b73d5bf265da064618731d
