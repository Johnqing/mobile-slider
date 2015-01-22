(function($){



	var Slider = function(el, config){

		this.el = el;
		this.config = config;

		this.index = 0;
		this.timer = null;
		this.inter = null;


		this.w = el.width();
		this.tabs = $(config.tabs, el);
		this.len = this.tabs.children().length;

		this.btns = $(config.btns, el);

		//移动端事件

		var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
		var hasTouch = this.hasTouch = 'ontouchstart' in window && !isTouchPad;
		this.touchStart = hasTouch ? 'touchstart' : 'mousedown';
		this.touchMove = hasTouch ? 'touchmove' : '';
		this.touchEnd = hasTouch ? 'touchend' : 'mouseup';

		this.sY = null
		this.distX = 0
		this.startX = this.startY = this.dist = 0;

		this.init();

	}

	Slider.prototype = {

		init: function(){
			var that = this,
				tabsNode = that.tabs,
				config = that.config

			var navArr = []
			if(config.autoPage){
				that.btns.empty();

				for(var i=0; i<that.len; i++){
					navArr.push("<li>"+(i+1)+"</li>");
				}

				that.btns.html(navArr.join(''));
				that.btns = that.btns.children()

			}

			var tempSize = that.len

			// 循环播放 复制前一个后一个
			if(config.effect == 'left'){
				tempSize += 2;

				var children = tabsNode.children(),
					first = children.eq(0),
					last = children.last();

				children.width(that.w);

				tabsNode.append(first.clone());
				first.before(last.clone());
			}

			tabsNode.wrap('<div class="slider-wrap" style="overflow:hidden; position:relative;"></div>');
			tabsNode.css({
				width: tempSize * that.w,
				position: 'relative',
				overflow: 'hidden'
			});

			that.play();

			if(config.autoPlay){
				that.inter = setInterval(function(){
					that.index++;
					that.play();
				}, config.interTime);
			}

			that.bind();


		},
		play: function(){
			var that = this,
				config = that.config,
				currClass = config.currClass,
				w = that.w,
				len = that.len,
				delayTime = config.delayTime

			that.translate(-(that.index+1) * w, delayTime);

			if(that.index == -1){
				that.timer = setTimeout(function(){
					that.translate(-len * w, 0);
					that.index = len - 1;
				},delayTime);
			}else if(that.index == len){
				that.timer = setTimeout(function(){
					that.translate(-w, 0);
					that.index = 0
				},delayTime);
			}

			var n = that.index;
			// 修正最后一个等于length的数
			n = n == len ? 0 : n;

			that.btns.eq(n).addClass(currClass)
				.siblings().removeClass(currClass);
		},
		translate: function(dist, speed){
			var el = this.tabs[0].style;
			el.webkitTransitionDuration = speed + 'ms';
			el.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
		},

		bind: function(){
			var that = this,
				tabsNode = that.tabs[0]
			var touchEvent = {
				TStart: function(ev){
					clearTimeout(that.timer);

					that.sY = void 0;
					that.distX = 0;
					//获得屏幕上第一个touch
					var point = that.hasTouch ? ev.touches[0] : ev;

					that.startX = point.pageX;
					that.startY = point.pageY;

					// move 事件
					tabsNode.addEventListener(that.touchMove, touchEvent.TMove)
					// end 事件
					tabsNode.addEventListener(that.touchEnd, touchEvent.TEnd)
				},

				TMove: function(ev){
					// 多点或者缩放
					if(that.hasTouch){
						if(ev.touches.length > 1 || ev.scale && ev.scale !==1) return;
					}

					var point = that.hasTouch ? ev.touches[0] : ev;

					that.distX = point.pageX - that.startX;
					that.distY = point.pageY - that.startY;

					that.sY = that.sY || Math.abs(that.distX) < Math.abs(that.distY);

					if(!that.sY){
						ev.preventDefault()
						if(that.config.autoPlay) clearInterval(that.inter);

						that.translate(-(that.index+1)*that.w + that.distX, 0);
					}

				},
				TEnd: function(ev){
					if(!that.distX) return
					ev.preventDefault();

					if(!that.sY){
						if(Math.abs(that.distX) > that.w/that.config.distance){
							that.distX > 0 ? that.index-- : that.index++;
						}

						that.play();

						if(that.config.autoPlay){
							that.inter = setInterval(function(){
								that.index++;
								that.play();
							}, that.config.interTime);
						}

					}

					tabsNode.removeEventListener(that.touchMove, touchEvent.TMove);
					tabsNode.removeEventListener(that.touchEnd, touchEvent.TEnd);
				}
			}

			tabsNode.addEventListener(that.touchStart, touchEvent.TStart)
		}


	}

	var defConfig = {
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
		// 计算方式为 单张的宽度/distance  2为一半
		distance: 2
	}

	$.fn.slider = function(config){

		var opts = $.extend({}, defConfig, config);

		return this.each(function(){
			new Slider($(this), opts);
		});

	}
})(jQuery||Zepto);

