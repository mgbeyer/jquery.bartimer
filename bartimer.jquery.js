/**
 * jQuery BarTimer Plugin v0.1
 * Author: Michael Beyer
 *
 * http://github.com/mgbeyer/jquery.bartimer
 *
 * Licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * This work is based on PieTimer (http://github.com/chikamichi/jquery.pietimer), 
 * originally written by Jean-Denis Vauguet (https://github.com/chikamichi)
 *
 */

(function($){
  var methods = {
    init: function(options) {
      var state = {
        timer: null,
		refreshRateMs: 10,
        timerSeconds: 10,
		color: '#ff0000',
		bgColor: '#900000',
		opacityPercent: 75,
		height: 10,
		orientation: "top",	// caution: "bottom" changes position of host parent-element (wrapper) to "relative" !!
		shadow: false,
        callback: function() {},
      };

      state = $.extend(state, options);

      return this.each(function() {
        var $this = $(this);
        var data = $this.data('bartimer');
        if (!data) {
		  if (state.orientation!="bottom" && state.orientation!="top") state.orientation= "top";
		  if (state.orientation=="bottom")	{
			  $this.css("position", "absolute");
			  $this.css("bottom", "0");
			  if ($this.parent()) $this.parent().css("position", "relative");
		  } else {
			  $this.css("position", "relative");
		  }
		  if (state.shadow) {
			  var updown= (state.orientation=="bottom") ? "-" : "";
			  var boxShadow= "0px " + updown + "0px 20px 6px " + colorIntensity(state.bgColor, 50);
			  $this.css("box-shadow", boxShadow);
			  $this.css("-moz-box-shadow", boxShadow);
			  $this.css("-webkit-box-shadow", boxShadow);
		  }
		  $this.css("width", "100%");
		  $this.css("background-color", state.bgColor);
		  $this.css("opacity", state.opacityPercent / 100);		  
		  $this.css("height", state.height + "px");		  
          $this.html('<div id="barTimerProgress"></div>');
			  $('#barTimerProgress').css("position", "absolute");		  
			  $('#barTimerProgress').css("width", "1%");
			  $('#barTimerProgress').css("height", "100%");
			  $('#barTimerProgress').css("background-color", state.color);
			  $('#barTimerProgress').css("opacity", state.opacityPercent / 100);
          $this.data('bartimer', state);
          $this.bartimer('start');
        }
      });
    },

    stopWatch: function() {
      var data = $(this).data('bartimer');
      if (data) {        
		var seconds = (data.timerFinish-(new Date().getTime()))/1000;
        if (seconds <= 0) {
          clearInterval(data.timer);
          $(this).bartimer('drawTimer', 100);
          data.callback();
        } else {
          var percent = 100-((seconds/(data.timerSeconds))*100);
          $(this).bartimer('drawTimer', percent);
        }
      }
    },

    drawTimer: function(percent) {
	  $this = $(this);
      var data = $this.data('bartimer');      
	  if (data) {
        $('#barTimerProgress').css('width', Math.ceil(percent) + "%");
      }
    },
    
    start: function() {
      var data = $(this).data('bartimer');
      if (data) {
        data.timerFinish = new Date().getTime()+(data.timerSeconds*1000);
        $(this).bartimer('drawTimer', 0);
        data.timer = setInterval("$this.bartimer('stopWatch')", data.refreshRateMs);
      }
    },

    reset: function() {
      var data = $(this).data('bartimer');
      if (data) {
        clearInterval(data.timer);
        $(this).bartimer('drawTimer', 0);
      }
    }
  };

  $.fn.bartimer = function(method) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.bartimer');
    }
  };
})(jQuery);


/* 
	col (color)
		hexcode (with or without #)
	amt (amount)
		decimal value (range 0..255) to add to or subtract from rgb values (negative is towards black = darker)
*/
function colorIntensity(col, amt) {   
	var useHash= false;
  
    if (col[0] == "#") {
        col= col.slice(1);
        useHash= true;
    }
 
    var num= parseInt(col, 16);
 
    var r= (num >> 16) + amt;
    if (r > 255) r= 255;
		else if (r < 0) r= 0;
 
    var g= (num & 0x0000FF) + amt;
    if (g > 255) g= 255;
		else if (g < 0) g= 0;

	var b= ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b= 255;
		else if (b < 0) b= 0;
    return (useHash ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);  
}
