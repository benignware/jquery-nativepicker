jquery-nativepicker
================

provides html5-input types as a fallback for common javascript controls

Features
--------
* toggles a html5-input picker control
* integrates with common javascript controls

Examples
--------

### Using Bootstrap Datepicker
```
$('.datepicker').datepicker().nativepicker({
  type: 'date',
  change: function(value) {
    $(this).datepicker('update', value ? new Date(value) : "");
  }, 
  show: function() {
    var value = $(this).data('datepicker').getDate();
    $(this).data('nativePicker').setPickerValue(value);
  }
})
```

### Using Bootstrap Select
note that bootstrap-select has built-in support for native-select on mobile. 
```
$('.selectpicker').selectpicker().nativepicker({
  toggle: function() {
    return $(this).next().find('.btn');
  }
});  
```

### Native only
```
$('.nativepicker').nativepicker({
  toggle: function() {
    return $($(this).next('.btn')[0]);
  }
});
```

Get access to the plugin-instance:
```
var nativepicker = $(".nativepicker").data('nativepicker');
```


Options
-------
<table>
  <tr>
    <th>Name</th><th>Description</th>
  </tr>
  <tr>
    <td>type</td><td>type of the native input, e.g. 'date'</td>
  </tr>
  <tr>
    <td>toggle</td><td>function for retrieving the toggle element</td>
  </tr>
  <tr>
    <td>picker</td><td>function for retrieving the native input</td>
  </tr>
  <tr>
    <td>show</td><td>callback that fires before the nativepicker shows up</td>
  </tr>
  <tr>
    <td>change</td><td>callback that fires when the nativepicker value has changed</td>
  </tr>
</table>

Methods
-------
<table>
  <tr>
    <th>Name</th><th>Description</th><th>Return</th>
  </tr>
  <tr>
    <td>setPickerValue</td><td>sets the picker value</td><td>void</td>
  </tr>
  <tr>
    <td>getPickerValue</td><td>gets the picker value</td><td>string</td>
  </tr>
</table>

Example Demo
------------
http://rawgithub.com/benignware/jquery-nativepicker/master/examples/index.html
