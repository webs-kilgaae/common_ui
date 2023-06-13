

$(function(){
	if($("select").length) {
		$("select").selectBox();
	}
});


/* custom select box */
/*
 * option
 * data-width="100px or 80%"
 * data-placeholder="선택해주세요."
 * disabled="disabled"
 */
(function($) {
	$.fn.extend({
		selectBox: function() {
			$(this).each(function(){
			    return new SelectBox(this);
			});
		}
	});

	SelectBox = (function(){
		function SelectBox(elm) {
			var self = this;

			self.$select = $(elm);
			self.$selectWrap = self.$select.parent();
			self.$selectList = null;
			self.placeholder = self.$select.data("placeholder") || null;
			self.disable = self.$select.prop("disabled");
			self.open = false;
			self.optLen = 0;
			self.index = self.$select.data("selected") || null;

			self._setSelect();
			self._eventSet();
		}
		SelectBox.prototype._setSelect = function() {
			var self = this,
				selected = false,
				$selected = $(self.disable ? "<span class='disabled selected'></span>" : "<a href='#' class='selected'></a>");

			self.$select.siblings(".selected") ? self.$select.siblings(".selected").remove() : null;
			self.$select.find("option.noneOption") ? self.$select.find("option.noneOption").remove() : null;

			self.$select.find("option").each(function(index) {
				if( $(this)[0].defaultSelected  ) {
					selected = true;
				}
			});

			if(self.placeholder != null) {
			    self.$select.prepend("<option value='' class='noneOption' disabled>"+self.placeholder+"</option>");
			}

			if(!selected) {
				if (self.index != null){
				    self.$select.find("option:eq("+self.index+")").prop("selected", true);
				    $selected.html("<span>" + self.$select.find("option:eq("+self.index+")").text() + "</span>");
				} else {
				    if(self.placeholder != null) {
        			    self.$select.find("option:eq(0)").prop("selected", true);
        			    $selected.html("<span>" + self.placeholder + "</span>").addClass("placeholder");
    				} else {
    				    $selected.html("<span>" + self.$select.find("option:selected").text() + "</span>");
    				}
				}
			} else {
    			$selected.html("<span>" + self.$select.find("option:selected").text() + "</span>");
			}

			self.$selectWrap.append($selected);
			self.optLen = self.$select.find("option").length;

			if( self.$select.data("width") ){
				self.$selectWrap.css({"width": self.$select.data("width")})
			} else {
				self.$selectWrap.css({"width" : self.$select.outerWidth()});
			}

			self.$select.hide();
		};
		SelectBox.prototype._eventSet = function() {
			var self = this;

			$(document).on("focusin click", function(e){
				if( !(self.$selectWrap.has(e.target).length || self.$selectWrap.is($(e.target))) && self.open){
					self._removeList();
				}
			});

			self.$select.on("change", function() {
			   var index = $(this).find("option:selected").index();

			   $(this).data("selected", index);

			   self.index = index;
			   self._setSelect();
			   self._eventSet();
			});

			self.$selectWrap.find(">a").on("click", function(e){
			    e.preventDefault();

				if(self.open){ self._removeList(); }
				else if(self.optLen) {
				    if(self.optLen == 1 && self.$select.find("option").hasClass("noneOption")) {
				        return false;
				    }
				    self._setList();
				}
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
})(jQuery);

	//  라디오 박스 
	$(function(){			
		$(document).on('click','.radiobox label',radioChk);
		$(document).on('focus','.radiobox input[type=radio]',radioChk);
	});
	// 라디오 박스 
	function radioChk(){
		var $this = $(this),
			$parent = $this.parent(),
			_name = $parent.find('input').attr('name'),
			_disabled = $parent.find('input').attr('disabled');
		var _input = $('input[type=radio]').filter(function(){
			if ($(this).attr('name') == _name){
				return $(this)
			};
		});

		if($this.hasClass('disabled')) {
			_input.parent().removeClass('on');
			_input.attr('checked', false);
		} else {
			_input.parent().removeClass('on');
			_input.attr('checked', false);
			$parent.addClass('on');
			$parent.find('input').attr('checked', true).prop('checked', true).change().trigger('click');			
			return false;
		}
	};

	//셀렉트박스
	$(function(){		
		// Common
		var select_root = $('div.select');
		var select_value = $('.my_value');
		var select_a = $('div.select ul.select_list li a');
		var select_input = $('div.select>ul>li>input[type=radio]');
		var select_label = $('div.select>ul>li>label');
		
		// Radio Default Value
		$('div.my_value').each(function(){
			var default_value = $(this).next('.i_list').find('input[checked]').next('label').text();
			$(this).append(default_value);
		});
		
		// Line
		select_value.bind('focusin',function(){$(this).addClass('outLine')});
		select_value.bind('focusout',function(){$(this).removeClass('outLine')});
		select_input.bind('focusin',function(){$(this).parents('div.select').children('div.my_value').addClass('outLine')});
		select_input.bind('focusout',function(){$(this).parents('div.select').children('div.my_value').removeClass('outLine')});
		
		// Show
		function show_option(){
			$(this).parents('div.select:first').toggleClass('open');
			$(this).siblings('.ctrl').toggleClass('open');			
		}
		
		// Hover
		function i_hover(){
			$(this).parents('ul:first').children('li').removeClass('hover');
			$(this).parents('li:first').toggleClass('hover');			
		}
		
		// Hide
		function hide_option(){
			var t = $(this);
			setTimeout(function(){
				t.parents('div.select:first').removeClass('open');
			}, 1);
		}
		
		// Set Input
		function set_label(){
			var v = $(this).next('label').text();
			$(this).parents('.option_box').prev('.my_value').text('').append(v);
			$(this).parents('.option_box').prev('.my_value').addClass('selected');
		}
		
		// Set Anchor
		function set_anchor(){
			var v = $(this).text();
			$(this).parents('.option_box').siblings('.my_value').text('').append(v);
			$(this).parents('.option_box').siblings('.my_value').addClass('selected');
		}

		// Anchor Focus Out
		$('*:not("div.select a")').on('focus', function(){
			$('.select_list').parent('.select').removeClass('open');
		});
		
		select_value.click(show_option);
		select_root.removeClass('open');
		select_root.mouseleave(function(){$(this).removeClass('open');$(this).find('.ctrl').removeClass('open');});
		select_a.click(set_anchor).click(hide_option).focus(i_hover).hover(i_hover);
		select_input.change(set_label).focus(set_label);
		select_label.hover(i_hover).click(hide_option);		

		//disabled
		$('.select .my_value').on('click', function(){			
			if ($(this).hasClass('disabled')){
				$(this).parents('.select').removeClass('open');
				$(this).siblings('.ctrl').removeClass('open');
			}
		});
	});

	// 체크박스
	$(function(){	
		$('input:checked').siblings('label').addClass('on');
        $('.checkbox input, input[type=checkbox]').on('focus blur',function(e){
            var $this = $(this),
                $label = $this.siblings('label');
            switch(e.type){
                case 'focus' :
                    $label.addClass('over');
                break;
                case 'blur' :
                    $label.removeClass('over');
                break;
            }
        });
	});

	$(document).on('click','.checkbox input',function(){
		var $this = $(this),
			$thisInput = ($this[0].tagName.toUpperCase() == 'INPUT'),
			$input = $this.parent().find('label');
		if ($input.hasClass('on')){
			if ($thisInput){
				$this.attr('checked',false);
			} else {
				$this.siblings('input').attr('checked',false);
			}
			$input.removeClass('on');
		} else {
			if ($thisInput){
				$this.attr('checked',true);
			} else {
				$this.siblings('input').attr('checked',true);
			}
			$input.addClass('on');
		}
	});        

	//layerPop
	function layerOpen(obj){		
		var $layer = $(obj).attr('href');

		$($layer).show();	
		
		var $layerWidth = $($layer).find('.layer_pop').outerWidth()/2;
		var $layerHeight = $($layer).find('.layer_pop').outerHeight()/2;	
		
		$($layer).find('.layer_pop').css({'margin-top':-$layerHeight, 'margin-left':-$layerWidth});	
		$('body').addClass('layer');
		
		if ($layer == '#revise'){
			$('body').removeClass('layer');
		}	
	};

	function layerClose(obj){
		$(obj).closest('.layer_wrp, .layer_revise').hide();
		$('body').removeClass('layer');
	};
	
	$(function(){
		//faq
		$('.acdn .tit a').on('click', function(){
			var $tite = $(this).parent('dt');
			
			$('.acdn dd').stop().slideUp();
			if (!$tite.hasClass('on')){
				$tite.addClass('on');
				$tite.siblings('dt').removeClass('on');
				$tite.next('dd').stop().slideDown();				
			}else {		
				$tite.removeClass('on');			
			};
			return false;
		});		
	
		//상세보기
		$('.btn_details').on('click', function(){
			$('.more_history').slideToggle();
			$(this).toggleClass('on');
			if(!$(this).hasClass('on')){
				$(this).children('span').text('자세히보기');
			}else{
				$(this).children('span').text('닫기');
			}
			return false;
		});		
	});

	/* tab */
	$(function(){       
		var idx ;
		var $meun = $('.tab li');
		var $tabcnt = $('.tab_wrp .tab_inner');	

		$tabcnt.not(':first').hide();		
		$meun.on('click', function(){
			var idx = $(this).index();
			$meun.removeClass('on');
			$(this).addClass('on');										
			$tabcnt.eq(idx).show().siblings().hide();		
		});	
	});

	/* 아코디언 */
	$(function(){
		$('.acdn .btn_crl').on('click', function(){		
			if (!$(this).hasClass('on')){
				$(this).addClass('on');
				$(this).parent().next('dd').stop().slideDown();
				$(this).find('.txt').text('닫기')
			}else {
				$(this).removeClass('on');
				$(this).parent().next('dd').stop().slideUp();
				$(this).find('.txt').text('내용보기');
			};
		});
	});

	/* 요금계산기 */
	$(function(){
		//식스플랜추가
		$('.btn_tip').hover(function(){
				$(this).next().show();
			}, function(){
				$(this).next().hide();
		});
		calcuate();

		$('.btn_adjust .mdify').on('click', function(){
			calcuate();
			return false;
		});
	});

	function calcuate(){
		$('.list_wrp').css({height:'auto'});
		var $calculate = $('.more_history ').height();
		$('.list_wrp').css({height:$calculate});
	};

	// 전화로신청 팝업 선불유심 라디오버튼
	$(function(){
		$(".pop_wrap.call_apply.type02 .radio_list input[type='radio']").on("change", function(){
			var $this = $(this),
				thisName = $this.attr("name");
			$(".pop_wrap.call_apply.type02 .radio_list input[name=" + thisName + "]").parent().removeClass("checked");
			$this.parent().addClass("checked");
		});

		$(".pop_wrap.call_apply.type02 .radio_list input[type='checkbox']").on("change", function(){
			var $this = $(this);
			$this.is(":checked") ? $this.parent().addClass("checked") : $this.parent().removeClass("checked");
		});
	});

	/* radio button */
	$(document).on("change", "input[type='radio']", function() {
		var $this = $(this),
			thisName = $this.attr("name");
		$("input[name=" + thisName + "]").parent().removeClass("checked");
		$this.parent().addClass("checked");
	});
	
	//상담톡
	$(function(){		
		$('.ui_quick .btn_consult').on('click', function(){
			$(this).toggleClass('on');
			$('.consult_box').toggleClass('on');
		}); 

		// 챗봇
		if ($('.chat_bot').length > 0) {
			zE('messenger', 'close');
			$('.chat_bot').on('click', function(){
				$(this).toggleClass('close');	
				$('iframe[title="메시징 창"]').parent('div').addClass('chat_msgbox');			
			});			
		}

	});