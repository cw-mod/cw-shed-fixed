// ==UserScript==
// @name         test2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @include      /https:\/\/\w?\.?catwar\.su\/cw3\//
// @author       You
// @require      https://abstract-class-shed.github.io/cwshed/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==
/*global jQuery*/
(function (window, document, $) {
  'use strict';
  if (typeof $ === 'undefined') return;

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  const pageurl = window.location.href;
  const isCW3 = (/^https:\/\/\w?\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));

  try {
    if (isCW3) cw3();
  }
  catch (err) {
    window.console.error('error: ', err);
  }
    const rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  function cw3() {
     const name = "Съесть тяжеловатое невероятно хитроумное сооружение из погребных брусков Двуногих, обвязанных изумительным лоскутом голубой ткани в горошек с помойки";
     $(document).ready(function () {
         $(document).on('click', '.itemInMouth', function() {
             if ($(this).hasClass('active_thing')) {
                 let r = rand(0, 2), newname = "Съесть кактус";
                 if (r == 0) {
                     newname = "Воспользоваться силой души Белифуса";
                 } else if (r == 1) {
                     newname = name;
                 }
                 $('#eat_new').text(newname);
             }
         });
         $('head').append(`<style>#thdey > *:not(#thdey_new) {
	display: none !important;
}
#thdey_new div {
	color: #352819 !important;
}

#layer_new {
	width: 200px;
	margin-bottom: 5px;
	margin-left: 15px;
	margin-top: 3px;
}
#layer_new .ui-state-default, #layer_new .ui-widget-content .ui-state-default, #layer_new .ui-widget-header .ui-state-default {
    border: 1px solid #20170e;
    background: #4d3a24 url(https://i.ibb.co/qCG7dVb/ui-bg-gloss-wave-60-fece2f-500x100.png) 50% 50% repeat-x;
    color: #352819;
}
#thdey_new {
	max-width: 270px;
	width: fit-content;
	word-break: break-word;
	margin: 3px 15px;
}

.item-menu-wrap, .item-menu-flat {
	width: 100%;
	margin: 4px 0;
    align-items: start;
	display: flex;
	flex-direction: column;
}
.mb-0 {
	margin-bottom: 0;
}
.mt-0 {
	margin-top: 0;
}
.item-menu {
	display: flex;
    align-items: center;
}
.item-menu-wrap {
	background-color: #edc88b;
	border-radius: 3px;
}
.item-menu-icon {
	padding: 0 1px 0 5px;
/* 	align-self: start; */
}
.item-menu-btn {
	padding: 2px 5px 2px 1px;
}
.item-menu-btn-flat {
	padding: 2px 2px;
}

.item-menu {
	cursor: pointer;
	width: 100%;
}

.item-menu-wrap:hover {
	-webkit-box-shadow: 0px 0px 0px 1px #352819;
	-moz-box-shadow: 0px 0px 0px 1px #352819;
	box-shadow: 0px 0px 0px 1px #352819;
}

.item-menu-wrap:active {
/* 	background-color: #fff0ca; */
}</style>`);
      $('#thdey').append(`
      <div id="thdey_new">
      <div class="item-menu-flat">
        <div class="item-menu-btn-flat">Уникальный ID: 41191092</div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
          <div class="item-menu-icon"><img src="https://i.ibb.co/Z86FFXV/1.png"></div>
          <div class="item-menu-btn"><span id="eat_new">${name}</span></div>
        </div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
        <div class="item-menu-icon"><img src="https://i.ibb.co/bgQzGyS/3.png" class="icon"></div>
        <div class="item-menu-btn">Положить на землю</div>
        </div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
        <div class="item-menu-icon"><img src="https://i.ibb.co/YNbDryq/4.png" class="icon"></div>
        <div class="item-menu-btn"><span>Осмотреть</span></div>
        </div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
        <div class="item-menu-icon"><img src="https://i.ibb.co/ggJfkYG/5.png" class="icon"></div>
        <div class="item-menu-btn"><span>Разделить</span></div>
        </div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
        <div class="item-menu-icon"><img src="https://i.ibb.co/LhYnrN8/2.png" class="icon"></div>
        <div class="item-menu-btn"><span>Разжевать</span></div>
        </div>
      </div>
      <div class="item-menu-wrap">
        <div class="item-menu">
        <div class="item-menu-icon"><img src="https://i.ibb.co/dtBFh72/6.png" class="icon"></div>
        <div class="item-menu-btn"><span>Закопать</span></div>
        </div>
        <div class="item-menu">
          <div id="layer_new" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 0%;"></span>
          </div>
        </div>
      </div>
      Чем правее, тем глубже будет закопан предмет. <a href="/about?id=12" target="_blank">[?]</a></div>`);
     });
  }
})(window, document, jQuery);
