// ==UserScript==
// @name         test
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
  function cw3() {
     const name = "Съесть тяжеловатое невероятно хитроумное сооружение из погребных брусков Двуногих, обвязанных изумительным лоскутом голубой ткани в горошек с помойки";
     $(document).ready(function () {
         $('head').append(`<style>#thdey > *:not(#thdey_new) {
	display: none !important;
}
#thdey_new div {
	color: black !important;
}

#layer_new {
	width: 200px;
	margin-bottom: 3px;
	margin-left: 5px;
	margin-top: 3px;
}

#thdey_new {
	max-width: 270px;
	width: fit-content;
	word-break: break-word;
	margin: 3px 15px;
}

.item-menu, .item-menu-flat {
	width: 100%;
	margin: 2px 0;
	display: flex;
}

.item-menu {
	background-color: #ffe;
	border: 1px solid #d2b067;
}

.item-menu-btn, .item-menu-btn-flat {
	padding: 2px 7px;
}

.item-menu-btn {
	cursor: pointer;
	width: 100%;
}

.item-menu-btn:hover {
	background-color: #fffff7;
	-webkit-box-shadow: 0px 0px 0px 2px #d2b067;
	-moz-box-shadow: 0px 0px 0px 2px #d2b067;
	box-shadow: 0px 0px 0px 2px #d2b067;
}

.item-menu-btn:active {
	background-color: #fff0ca;
}

.item-menu-btn.col-2 {
	width: 50%;
	display: inline-block;
}

         </style>`);
      $('#thdey').append(`
      <div id="thdey_new">
      <div class="item-menu-flat">
        <div class="item-menu-btn-flat">Уникальный ID: 41191092</div>
      </div>
      <div class="item-menu">
        <div class="item-menu-btn">${name}</div>
      </div>
      <div class="item-menu">
        <div class="item-menu-btn"><span>Положить на землю</div>
      </div>
      <div class="item-menu">
        <!--<div class="item-menu-btn col-2"><span>Осмотреть<br>поверхностно</span></div>
        <div class="item-menu-btn col-2"><span>Осмотреть<br>тщательно</span></div>-->
        <div class="item-menu-btn"><span>Осмотреть</div>
      </div>
      <div class="item-menu">
        <div class="item-menu-btn"><span>Разделить</span></div>
      </div>
      <div class="item-menu">
        <div class="item-menu-btn"><span>Разжевать</span></div>
      </div>
      <div class="item-menu">
        <div class="item-menu-btn"><span>Закопать</span><br>
        <div id="layer_new" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 0%;"></span></div></div>
      </div>
      Чем правее, тем глубже будет закопан предмет. <a href="/about?id=12" target="_blank">[?]</a></div>`);
     });
  }
})(window, document, jQuery);
