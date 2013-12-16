// Ensure private scope + aliases
(function ( $, window) {
  
  window.console = window.console || {
    log: function() {}, 
    info: function() {}
  };
  
  var pluginName = 'nativePicker';
  
  var defaults = {
    inputSelector: "select, input[type='text]', input[type='date'], textarea", 
    toggleSelector: "a, button", 
    type: 'auto', 
    toggleEvent: 'click touchstart focus', 
    dateFormat: 'dd.mm.yyyy'
  };
  
  
  // http://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
  function getLocalIsoString(date) {
    var padDigits = function padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    };

    var tzOffset = date.getTimezoneOffset() + 30 * -1,
        tzHour = padDigits( Math.floor(tzOffset / 60), 2 ),
        tzMin = padDigits( (tzOffset % 60), 2 ),
        tz = "";

    tz = tzHour > 0 ? "+" : "-";
    tz = tz + tzHour + ":" + tzMin;

    return date.getFullYear() 
            + "-" + padDigits((date.getMonth()+1),2) 
            + "-" + padDigits(date.getDate(),2) 
            + "T" 
            + padDigits(date.getHours(),2)
            + ":" + padDigits(date.getMinutes(),2)
            + ":" + padDigits(date.getSeconds(),2)
            + "." + padDigits(date.getMilliseconds(),2)
            + tz;
  }
  
  function getType(element) {
    
  }
  
  // TODO: cache results
  function isTypeSupported(type) {
    
    switch (type) {
      
      // html4 input types
      case 'select': 
      case 'text':
      case 'textarea':
        result = true;
        break;
      default: 
        // detect html5 input types
        var i = document.createElement('input');
        i.setAttribute("type", type);
        // general support
        if (i.getAttribute('type') == type) {
          // exact support
          switch (type) {
            case 'date': 
              var testValue = "not a timestring";
              i.setAttribute('value', testValue);
              console.log ("html5 support? ", i.value, testValue);
              // html5 date control accepts iso time strings only
              if (!i.value) {
                result = true;
                break;
              }
            default: 
              result = false;
          }
        }
        delete i;
    }
    
    
    return result;
  }
  
  var pluginClass = function NativePicker(element, options) {
    
    var nativePicker = this;
    
    var inputSelector = options.inputSelector;
    
    var $element = $(element);
    var picker, toggle;
    
    
    function getType() {
      if (options.type && options.type != 'auto') {
        return options.type;
      }
      var picker = getPicker();
      
      if (picker) {
        var tagName = picker.prop('tagName').toLowerCase();
        switch (tagName) {
          case 'select': 
          case 'textarea': 
            return tagName;
          case 'input': 
            return picker.prop('type');
        }
      }
      return null;
    }
    
    function getPicker() {
      
      if (!picker) {
        picker = $element.is(options.inputSelector) ? $element : (function() {
          var picker = null;
          var type = getType();
          switch (type) {
            case 'select': 
              picker = document.createElement(type);
              break;
            default: 
              picker = document.createElement('input');
              picker.setAttribute('type', type);
              picker.setAttribute('min', options.min);
          }
          $(picker).on('change', function(event) {
            console.log("PICKER CHANGED", this);
            pickerChanged();
          });
         
          element.parentNode.insertBefore(picker, element); 
          return $(picker);
        })();
      }
      return picker;
    }
    
    function getToggle() {
      //if (!toggle) {
        toggle = options.toggle ? 
          typeof (options.toggle) == "function" ? options.toggle.call(element) : $(options.toggle)
          : $element;
      //}
      return toggle;
    }
    
    var toggle = getToggle(); 
    
    function layout() {
      var picker = getPicker();
      var toggle = getToggle();
      if (picker && toggle) {
        picker.css({
          opacity: 0, 
          position: 'absolute', 
          zIndex: -1, 
          width: toggle.outerWidth(false), 
          height: toggle.outerHeight(false), 
          display: ''
        });
      }
    }
    
    function toggleHandler(event) {
      console.info("TOGGLE PICKER");
      //if (isTypeSupported(options.type)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        showPicker();
      //}
    }
    
    function showPicker() {
      input = getPicker();
      input.focus();
      if (options.show) {
        options.show.call(element);
      }
    }
    
    function getToggleValue() {
      var toggle = getToggle();
      var value = toggle.prop('value');
      if (value) {
        return value;
      }
      return value;
    }
    
    this.getPickerValue = function() {
      return getPicker().prop('value');
    };
    
    this.setPickerValue = function(value) {
      if (value instanceof Date) {
        value = getLocalIsoString(value).substring(0, 10);
      }
      getPicker().prop('value', value);
    };
    
    function pickerChanged() {
      console.log("picker change");
      var value = nativePicker.getPickerValue();
      switch (toggle.prop('tagName').toLowerCase()) {
        case 'input': 
        case 'select': 
          toggle.prop('value', value);
          break;
        default: 
          toggle.html(value);
      }
      if (options.update) {
        value = options.update.call(element, value);
      }
    }
    
    
    
    function init() {
      
      
      var type = getType();
      if (type && !isTypeSupported(type)) {
        console.warn("type '" + type + "' is not natively supported", element, type);
        return;
      }
      
      var toggle = getToggle(); 
      
      toggle.bind('touchstart mousedown', toggleHandler);
      
      layout.call(this);
      
      // var value = options.value || getToggleValue();
      // if (value) {
        // this.setPickerValue(value);
      // }
      
      
    }
    
    
    
    init.call(this);
    
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