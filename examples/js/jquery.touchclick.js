// Ensure private scope + aliases
(function ( $, window) {
  
  window.console = window.console || {
    log: function() {}, 
    info: function() {}
  };
  
  var pluginName = 'touchclick';
  
  var defaults = {
    draggingTimeout: 100, 
    scrollingTimeout: 750, 
    preventClickTimeout: 500
  };
  
  function getOverflowContainer(elem) {
    while (elem && elem.nodeType == 1) {
      if (elem.nodeName.toLowerCase() == 'body' || elem.nodeName.toLowerCase() == 'html') {
        break;
      }
      var overflow = $(elem).css('overflow');
      if (overflow == 'auto' || overflow == 'scroll') {
        return elem;
      }
      elem = elem.parentNode;
    }
    return window;
  }
  
  // helper methods

  var pluginClass = function TouchClick(element, options) {
    
    var touchClick = this;
    
    var $element = $(element);
    var $window = $(window);
    
    var dragging = false;
    var draggingTimeoutId = null;
    var preventClick = false;
    var touchStartElement = null;
    
    var overflowContainer = null;
    var scrolling = false;
    var touchStartScrollPos = null;
    var scrollingTimeoutId = null;
    
    var preventClickTimeoutId = null;
    
    $element.bind('touchstart', function(event) {
      touchStartScrollPos = null;
      overflowContainer = getOverflowContainer(event.target);
      if (overflowContainer) {
        var scrollPos = {
          x: overflowContainer.scrollLeft, 
          y: overflowContainer.scrollTop
        };
        touchStartScrollPos = scrollPos;
      }
      window.clearTimeout(draggingTimeoutId);
      window.clearTimeout(scrollingTimeoutId);
      window.clearTimeout(preventClickTimeoutId);
      dragging = false;
      scrolling = false;
      touchStartElement = event.target;
      
      if (overflowContainer && (overflowContainer.scrollHeight > 0 || overflowContainer.scrollWidth > 0)) {
        $(overflowContainer).bind('scroll', scrollHandler);
      }
      
    });
    
    $element.bind('touchmove', function(event) {
      dragging = true;
      if (overflowContainer) {
        var scrollPos = {
          x: overflowContainer.scrollLeft, 
          y: overflowContainer.scrollTop
        };
        if (touchStartScrollPos) {
          if (touchStartScrollPos.x != scrollPos.x || touchStartScrollPos.y != scrollPos.y) {
            scrolling = true;
          }
        }
      }
    });
    
    var clicked = false;

    $element.bind('click', function(event) {
        console.info("TEST CLICK", event.target);
    });
    
    $element.bind('mousedown', function(event) {
        console.info("TEST MOUSE DOWN", event.target);
    });
    
    
    function preventClickHandler(event, custom) {
      
      console.log("PREVENT CLICK", event, custom);
      
      if (!custom) {
        //event.preventDefault();
        //event.stopImmediatePropagation();
        $(this).unbind('click', preventClickHandler);
        
      } else {
        console.log("DEFAULT CLICK");
        
        window.setTimeout(function() {
          if (custom && !event.isDefaultPrevented()) {
            var a = $(event.target).is('a[href]') ? event.target : $(event.target).parents('a[href]')[0];
            if (a && a.href) {
              window.location.href = a.href;
            }
          }
      }, 1);
      }
    }
    
    $element.bind('touchend', function(event) {
      
      console.info('touch end');
      
      if (!scrolling && !dragging && event.target == touchStartElement) {
        
        $(event.target).unbind('click', preventClickHandler);
        $(event.target).bind('click', preventClickHandler);
        
        var events = jQuery._data(event.target).events;
        if (events && events['click'] && events['click'].length > 1) {
          var onClickHandlers = events['click'];
          onClickHandlers.splice(0, 0, onClickHandlers.pop());
        }
        
        $(event.target).focus();
        
        $(event.target).trigger({
          type: 'click', 
          bubbles: true
        }, [true]);

        event.preventDefault();
        event.stopImmediatePropagation();
      }
      
      window.clearTimeout(draggingTimeoutId);
      draggingTimeoutId = window.setTimeout(function() {
        dragging = false;
      }, options.draggingTimeout);
      
      //event.preventDefault();
      
    });
    
    function scrollHandler(event) {
      scrolling = true;
      window.clearTimeout(draggingTimeoutId);
      draggingTimeoutId = window.setTimeout(function() {
        scrolling = false;
        $(this).unbind('scroll', scrollHandler);
      }, options.scrollingTimeout);
    }
    
    
  };
  

  // bootstrap plugin
  
  $.fn[pluginName] = function(options) {
      
      options = $.extend({}, defaults, options);

      return this.each(function() {
  
          if (!$(this).data(pluginName)) {
            
              $(this).data(pluginName, new pluginClass(this, options));
  
          }
          
          return $(this);
  
    });

  };

})( jQuery, window );