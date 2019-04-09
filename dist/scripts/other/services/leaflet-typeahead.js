'use strict';

L.Control.Typeahead = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function initialize(args) {
    // constructor
    console.log('init');
    this.arguments = [];
    for (var i = 0; i < args.length - 1; i++) {
      this.arguments.push(args[i]);
    } //console.log(this.arguments);
    L.Util.setOptions(this, args[args.length - 1]);
  },
  onAdd: function onAdd(map) {
    console.log('onadd');
    var that = this;
    // happens after added to map
    //top: -65px; left: 40px
    var container = L.DomUtil.create('div', '');
    // var container = document.getElementsByClassName("zoekbalken2")[0];
    container.style.position = "absolute";
    // container.style.top = "px";
    // container.style.left = "50px";
    this.typeahead = L.DomUtil.create('input', 'typeahead tt-input', container);
    this.typeahead.type = 'text';
    this.typeahead.id = "okzor";
    this.typeahead.placeholder = this.options.placeholder;
    $(this.typeahead).typeahead.apply($(this.typeahead), this.arguments);
    ["typeahead:active", "typeahead:idle", "typeahead:open", "typeahead:close", "typeahead:change", "typeahead:render", "typeahead:select", 'keyup', "typeahead:autocomplete", "typeahead:cursorchange", "typeahead:asyncrequest", "typeahead:asynccancel", "typeahead:asyncreceive"].forEach(function (method) {
      if (that.options[method]) {
        $(that.typeahead).bind(method, that.options[method]);
      }
    });
    L.DomEvent.disableClickPropagation(container);
    return container;
  },
  onRemove: function onRemove(map) {},
  keyup: function keyup(e) {
    console.log('typeahead KEYUP!!', e);

    if (e.keyCode == 13) {
      $(".tt-suggestion:first-child", this).trigger('click');
      // console.log('typeahead input!!');

      // var selectedValue = $('input.typeahead').data().ttView.dropdownView.getFirstSuggestion();
      // $("#value_id").val(selectedValue);
      // $('form').submit();
      // return true;
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      // do nothing
    } else {}
  },
  itemSelected: function itemSelected(e) {
    console.log('item selcted');
    L.DomEvent.preventDefault(e);
  },
  submit: function submit(e) {
    console.log('submit');

    L.DomEvent.preventDefault(e);
  }
});

L.control.typeahead = function (args) {
  return new L.Control.Typeahead(arguments);
};
