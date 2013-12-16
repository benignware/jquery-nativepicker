jquery-nativepicker
================

provides html5-input types as a fallback for common javascript controls

Features
--------
* Custom css styling
* Keyboard and Tab control

Examples
--------


Using Bootstrap Select
```
$('.selectpicker').selectpicker().nativepicker({
  toggle: function() {
    return $(this).next().find('.btn');
  }
});  
```

Using Bootstrap Datepicker
```
$('.datepicker').datepicker().nativepicker({
  type: 'date',
  update: function(value) {
    $(this).datepicker('update', value ? new Date(value) : "");
  }, 
  show: function() {
    var value = $(this).data('datepicker').getDate();
    $(this).data('nativePicker').setPickerValue(value);
  }
})
```

Native only
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
    <td>toggle</td><td>method for retrieving the toggle element</td>
  </tr>
  <tr>
    <td>picker</td><td>method for retrieving the toggle element</td>
  </tr>
  <tr>
    <td>show</td><td>callback that fires before the nativepicker shows up</td>
  </tr>
  <tr>
    <td>change</td><td>callback that fires when the nativepicker value has changed</td>
  </tr>
</table>
