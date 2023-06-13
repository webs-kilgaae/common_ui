'use strict';

// const { init } = require('browser-sync');

const uiMain = (function(uiMain, $window, $body){
    const mainInit = function(){
        scrollEv.init();
        visual.init();
        $('.open-modal-popup').length > 0 && mainPop.init();
    }

    const scrollEv = {
        _t: null,
        $obj: $('#header'),
        init() {
            this.evt();
        },
        evt(){
            $window.on('scroll', () => {
                this._t = $window.scrollTop();
                this.toggle();
            });
            this.$obj.on('mouseenter', () => {
                this.$obj.removeClass('on');
            });
            this.$obj.on('mouseleave', () => {
                $window.scrollTop() > 0 || this.$obj.addClass('on');
            });
        },
        toggle(){
            this._t > 0 ? this.$obj.removeClass('on') : this.$obj.addClass('on');
        }
    };

    const mainPop = {
        init(){
            this.open();
            this.event();
        },
        open(){
            this.popup =  $('.open-modal-popup-wrap');
            uiCommon.bodyFix.on();
        },
        event(){
            $('.open-modal-popup .btn-close-x-wh').on('click', function(){
                mainPop.close('.open-modal-popup-wrap');
            });
        },
        close(){
            $('body').removeClass('scrollOff');
            $('.open-modal-popup-wrap').fadeOut();
            this.popup.removeClass('on');
        }
    };
    //상단비주얼
    const visual = {
        $obj: $('.sec-main-visual .slick-control'),
        $slick: $(".sec-main-visual .slick-visual"),
        dotsLength: $('.sec-main-visual .slick-control .slick-dots li').length,
        $currentNum: $('.slick-control .first-page'),
        currentNum: 0,
        $endNum: $('.sec-main-visual .slick-control .end-page'),
        $play: $(".sec-main-visual .slick-control .slick-play"),
        $pause: $(".sec-main-visual .slick-control .slick-pause"),
        init(){
            this._evt();
            this._set();
            window.setTimeout(function(){
				visual._change();
			}, 500)
        },
        _evt(){
            this.$pause.on('click', () => { this._pause(); });
            this.$play.on('click', () => { this._play(); });
            this.$slick.on('afterChange', (e,s,c) => { this.currenteNum = c+1; this._change(); });
        },
        _set(leng){
            let dotLength = leng || this.dotsLength;
            this.$endNum.text(dotLength);
        },
        _pause(){
            this.$pause.removeClass('on');
            this.$play.addClass('on');
            this.$slick.slick('slickPause');
        },
        _play(){
            this.$play.removeClass('on');
            this.$pause.addClass('on');
            this.$slick.slick('slickPlay');
        },
        _change(){
            $body.attr('class', '').addClass($(".sec-main-visual .slick-current").data().colorValue);
            this.$currentNum.text(this.currenteNum);
        }
    }

    mainInit();
    return{
        visual : visual,
    };

}(window.uiMain || {}, $(window), $('body')));

uiCommon.progressAni.amountCircle('main-bar01', 0.86);
uiCommon.progressAni.amountCircle('main-bar02', 0.11);
uiCommon.progressAni.amountCircle('main-bar03', 0.55);