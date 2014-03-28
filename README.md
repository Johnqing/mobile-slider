移动版焦点图
=============

## 使用

dom结构

```html
<div id="slideBox" class="slideBox">

	<div class="bd">
		<ul>
			<li>
				<a class="pic" href="#"><img src="img/1.jpg" /></a>
				<a class="tit" href="#">汤唯新片大卖请剧组吃回锅肉</a>
			</li>
			<li>
				<a class="pic" href="#"><img src="img/2.jpg"/></a>
				<a class="tit" href="#">范冰冰黄晓明亲密无间</a>
			</li>
			<li>
				<a class="pic" href="#"><img src="img/3.jpg"/></a>
				<a class="tit" href="#">一周体育快报</a>
			</li>
			<li>
				<a class="pic" href="#"><img src="img/4.jpg"/></a>
				<a class="tit" href="#">金正恩携娇妻视察</a>
			</li>
		</ul>
	</div>

	<div class="hd">
		<ul></ul>
	</div>
</div>
```

调用

```javascript

$('#slideBox').slider({
	// 需要切换的dom结构
	tabs: '.bd ul',
	// 小圆点 切换的结构
	btns: '.hd ul',
	// 切换方式（目前只支持 左）
	effect: 'left',
	// 是否切换小圆点
	autoPage: true,
	// 是否自动播放
	autoPlay: true,
	//切换效果的速度
	delayTime: 200,
	//每一次切换的时间间隔
	interTime: 2500,
	// 小圆点的样式
	currClass: 'on',
	// 鼠标拖动单张slider，需要到什么位置切换
	// 计算方式为 
	distance: 2
});
```
