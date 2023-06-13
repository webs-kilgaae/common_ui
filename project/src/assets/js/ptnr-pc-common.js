/* tab - normal */
$(function(){
	$(".tab li > a").on("click", function(e){
		var $this = $(this),
			$thisWrap = $this.parent(),
			$cont = $thisWrap.closest(".tab_wrap").find("> .tab_cont");

		$thisWrap.siblings().removeClass('on');
		$thisWrap.addClass('on');

		if( $cont.length ){
			$cont.hide();
			$cont.eq($thisWrap.index()).show();

			if($cont.find("select").length){
				$("select").selectBox();
			}
			e.preventDefault();
		}
	});
});

/* checkbox and radio button */
$(function(){
	$("input[type='radio']").on("change", function(){
		var $this = $(this),
			thisName = $this.attr("name");
		$("input[name=" + thisName + "]").parent().removeClass("checked");
		$this.parent().addClass("checked");
	});

	$("input[type='checkbox']").on("change", function(){
		var $this = $(this);
		$this.is(":checked") ? $this.parent().addClass("checked") : $this.parent().removeClass("checked");
	});
});

/* accordion */
$(function(){
	$(".accordion01:not('.no_func')").each(function(){
		var $this = $(this),
			$acdBtn = $this.find(".acd_tit, .acd_btn");

		$acdBtn.on("click", function(e){
			var $curWrap = $(this).closest("li"),
				$item = $this.find(">ul>li").not($curWrap),
				$ir = $curWrap.find(".acd_btn span");

			$item.removeClass("on");
			$item.find(".acd_btn span").html("펼침");

			if( $curWrap.hasClass("on") ){
				$curWrap.removeClass("on");
				$ir.html("펼침");
			} else {
				$curWrap.addClass("on");
				$ir.html("닫힘");
			}

			e.preventDefault();
		});
	});
});

/* layer and tooltip */
$(function(){

	/* btn nolike */
	$(".btn.nolike").on("click", function(e){
		openLayer($(this).siblings(".layerPop"));
		e.preventDefault();
	});

	/* common layer button */
	$(".btn_layer").on("click", function(e){
		openLayer($(this).siblings(".layerPop"));
		e.preventDefault();
	});

	function openLayer($layer) {
	
		$layer.css("display") == "block" ? $layer.hide() : $layer.show();	

		$layer.find(".layer_close").on("click", function(e){
			$layer.hide();
			e.preventDefault();
		});
	}
});

(function($) {
	$.fn.extend({
		numRolling: function(settings) {
			$(this).each(function(){
				return new NumRolling(this, settings);
			});
		}
	});
	NumRolling = (function(){
		function NumRolling(elm, settings) {
			var self = this,
				defaults = {
					item: null,
					gap: 0,
					len: 0
				};

			self.options = $.extend(defaults, settings);

			self.$elm = $(elm);
			self.$item = self.$elm.find(self.options.item);
			self.options.len = self.$item.length;

			self._rollingNumber();
		}
		NumRolling.prototype._rollingNumber = function(){
			var self = this;

			self.$item.each(function(){
				var $this = $(this),
					flag = self.options.len;

				self._rollingAnimate($this, flag);
			});
		}
		NumRolling.prototype._rollingAnimate = function($this, flag){
			var	self = this,
				num = $this.text();

			$this.animate({
				"background-position-y": -self.options.gap *( self.$item.index($this) == --flag ? num : 9 ) + "px"
			}, function(){

				if( self.$item.index($this) == flag) {return false;}

				$this.css("background-position-y", 0);

				self._rollingAnimate($this, flag);
			});
		}

		return NumRolling;
	})();
})(jQuery);


(function($) {
	$.fn.extend({
		selectBox: function(type) {
			$(this).each(function(){
				return new SelectBox(this, type);
			});
		}
	});

	SelectBox = (function(){
		function SelectBox(elm, type) {
			var self = this;

			self.$select = $(elm);
			self.$selectWrap = self.$select.parent();
			self.$selectList = null;
			self.placeholder = self.$select.data("placeholder") || null;
			self.disable = self.$select.prop("disabled");
			self.open = false;
			self.optLen = self.$select.find("option").length;

			self._setSelect();
			self._eventSet();
		}
		SelectBox.prototype._setSelect = function() {
			var self = this,
				$selected = $(self.disable ? "<span class='disabled selected'></span>" : "<a href='#' class='selected'></a>");

			self.$select.siblings(".selected").remove();
			self.$select.find("option.noneOption").remove();
			self.$select.hide();

			if( self.placeholder != null ) {
				$selected.html("<span>" + self.placeholder + "</span>").addClass("placeholder");
				self.$select.prepend("<option value='' class='noneOption' disabled selected>"+self.placeholder+"</option>");
			} else {
				$selected.html("<span>" + self.$select.find("option:selected").text() + "</span>");
			}

			self.$selectWrap.append($selected);

			if( self.$select.data("width") ){
				self.$selectWrap.css({"width": self.$select.data("width")})
			} else {
				self.$selectWrap.css({"width" : self.$select.outerWidth()});
			}

		};
		SelectBox.prototype._eventSet = function() {
			var self = this;

			$(document).on("focusin click", function(e){
				if( !(self.$selectWrap.has(e.target).length || self.$selectWrap.is($(e.target))) && self.open){
					self._removeList();
				}
			});

			self.$selectWrap.find(">a").on("click", function(e){
				if(self.open){ self._removeList(); }
				else if(!self.open && self.optLen ) { self._setList(); }
				e.preventDefault();
			});
		};
		SelectBox.prototype._setList = function() {
			var self = this,
				list = "<ul class='select_list_wrap'>";
			self.$select.find("option").each(function(i){
				var $opThis = $(this);

				if( self.placeholder != null && i == 0 ) {
					list += "";
				} else if($opThis.is(":selected")){
					list += "<li class='on' data-index=" + i + "><a href='#'><span>" + $opThis.text() + "</span></a></li>";
				} else {
					list += "<li data-index=" + i + "><a href='#'><span>" + $opThis.text() + "</span></a></li>";
				}
			});
			list += "</ul>";

			self.$selectWrap.addClass("open");
			self.open = true;

			self.$selectList = $(list);
			self.$selectList.appendTo(self.$selectWrap);

			self._hasScroll();

			self.$selectList.find("a").on("click", function(e){
				var $optThis = $(this);

				self.$selectWrap.find(".selected").removeClass("placeholder");
				self.$selectWrap.find(".selected>span").text($optThis.text());
				self.$select.find("option").eq($optThis.parent().data("index")).prop("selected", true);
				self.$select.trigger("change");

				self._removeList();

				e.preventDefault();
			});
		};
		SelectBox.prototype._removeList = function() {
			var self = this;

			self.$selectWrap.removeClass("open");
			self.$selectList.remove();
			self.$selectList = null;
			self.open = false;
		}
		SelectBox.prototype._hasScroll = function() {
			var self = this;

			if( self.$selectList.get(0).scrollHeight > self.$selectList.innerHeight() ){
				self.$selectList.find("li").css({
					"padding-right": function(index, value) {
						return parseInt(value) - 17;
					}
				})
			}
		}
		return SelectBox;
	})();

	$(document).ready(function(){
		if( $("select").length ) {
			$("select").selectBox();
		}
	});
})(jQuery);

$(function(){

	// quick benner
	if($('.incontent').length >= 1){
		var incontent = $('.incontent').offset().top; //기준div 위치
		var viewH = incontent - 91; //기준div - 헤더높이

		$(window).scroll(function(){
			var scrTop = $(window).scrollTop(); //스크롤위치
			var targetTop = (scrTop - viewH)+10;

			if( viewH - scrTop <= 0 ){
				$('#quickBanner, #floatingBanner').css('top',  targetTop+'px'); // 180312 선택자 추가
			} else {
				$('#quickBanner, #floatingBanner').css('top', '10px'); // 180312 선택자 추가
			}
		});
	}

	//top btn
	$('#viewTop').click(function(){
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});

	$('.usm_join').click(function(){
		var $targetP = $('.step_inner').offset().top;

		$('body,html').animate({
			scrollTop: $targetP-90
		}, 500);
		return false;
	});
		
	$('.quick_benner a').on('click', function(){		
		var $target = $(this).data('layer');
		
		$('#' + $target).show();
		$('#' + $target).siblings().hide();		
	});

	$('.layer_close').click(function(){
		$(this).closest('.layer_pop').hide();
		$('#msk').fadeOut(500);
	});

	// 셀프개통
	$('.btn_so_layer').click(function() {
		var href = $(this).attr('href');
		var $layerPostin = ($(window).height()-$(href).outerHeight())/2+$(window).scrollTop();

		$(href).show();
		$(href).css({'position':'absolute','top':$layerPostin});
		$('#msk').fadeIn(500);
	});

});

/* main slide */
$(function(){
	if( $('.main_visual').length > 0){
		$('.main_visual').slick({
			 dots: false,
			 autoplay: true,
			autoplaySpeed: 4000
		});
	};	
});

/* alert */
$(function(){

	alert = function(msg, func){
		var windowHeight = $(window).height(),
		layerHeight = $(".layer_alert").outerHeight(),
		layerPosTop = (windowHeight - layerHeight) /2;
		$(".layer_alert p").html(msg.replace(/\n/gi,'<br/>'));
		$(".layer_alert").css("top",layerPosTop);
		$("#msk").show();
		$(".layer_alert").show();

		$(".layer_alert .btn").unbind('click');
		$(".layer_alert .btn").click(function(){
			$("#msk").hide();
			$(".layer_alert").hide();
			if (typeof func === 'function') {
				func();
			}
		});
	};
});


// 메인 팝업
$(function(){	
	$('.system_pop .pop_slide').css({'overflow': 'hidden'})
	if($('.system_pop .pop_slide').length) {
		$('.system_pop .pop_slide').slick({
			infinite: true,
			dots: true,
			arrows: true,
			autoplay: true,
			autoplaySpeed: 3000,
			playButton: true
		});
		$('.system_pop .pop_slide').css({'overflow': 'visible'})
	}
	
	$('.system_pop .msg_footer .btn_close,.dim').on('click', function(){
		$('.system_pop').fadeOut();
		$('.dim').fadeOut();			
	});
});