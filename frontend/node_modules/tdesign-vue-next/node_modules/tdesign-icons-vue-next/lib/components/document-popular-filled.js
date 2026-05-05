'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var defineProperty = require('../_chunks/dep-934a202c.js');
var vue = require('vue');
var utils_renderFn = require('../utils/render-fn.js');
var utils_useSizeProps = require('../utils/use-size-props.js');
require('../utils/use-common-classname.js');
require('../utils/config-context.js');

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { defineProperty._defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var element = {
  "tag": "svg",
  "attrs": {
    "fill": "none",
    "viewBox": "0 0 24 24",
    "width": "1em",
    "height": "1em"
  },
  "children": [{
    "tag": "path",
    "attrs": {
      "fill": "props.filledColor",
      "d": "M20.2334 12.999C20.2334 14.1535 20.3939 14.7025 20.6699 15.1787L20.7949 15.3799L20.8164 15.4131L20.8359 15.4473C21.0219 15.783 21.2038 16.0696 21.3857 16.3535C21.5621 16.6288 21.7522 16.9238 21.916 17.2295C22.2687 17.8878 22.5 18.5985 22.5 19.5977C22.5 20.6415 21.9938 21.65 21.2344 22.2881C20.4469 22.9496 19.2942 23.2719 18.1406 22.6904C18.0135 22.6264 17.7539 22.5701 17.417 22.5791C17.075 22.5883 16.8367 22.659 16.7744 22.6904C15.9117 23.1252 15.1151 23.0755 14.4619 22.7139C13.9056 22.4057 13.5297 21.9006 13.3594 21.6865C12.3572 20.4264 12.1228 19.1137 12.3477 17.9434C12.5643 16.816 13.1907 15.8944 13.793 15.292L14.5 14.585L15.0352 15.1201C15.0935 14.9459 15.1615 14.7633 15.2461 14.5801C15.5037 14.0223 15.904 13.4393 16.5508 12.9609C17.1957 12.484 18.0314 12.1511 19.1006 12.0078L20.2334 11.8564V12.999ZM20.5 10.3066L18.9014 10.5215C17.6284 10.692 16.5426 11.1016 15.6592 11.7549C15.279 12.036 14.9635 12.3454 14.6982 12.6631L14.5 12.4639L12.7324 14.2314C11.9766 14.9874 11.1621 16.1663 10.875 17.6602C10.6067 19.0569 10.8351 20.5717 11.7432 21.999H1.5V0.999023H20.5V10.3066ZM6 12.499H11V10.499H6V12.499ZM6 8.49902H16V6.49902H6V8.49902Z"
    }
  }]
};
var documentPopularFilled = vue.defineComponent({
  name: "DocumentPopularFilledIcon",
  props: {
    size: {
      type: String
    },
    onClick: {
      type: Function
    },
    fillColor: {
      type: [Array, String]
    },
    strokeColor: {
      type: [Array, String]
    },
    strokeWidth: {
      type: Number
    }
  },
  setup(props, _ref) {
    var {
      attrs
    } = _ref;
    var propsSize = vue.computed(() => props.size);
    var strokeColor1 = vue.computed(() => {
      if (!props.strokeColor) return "currentColor";
      return Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor;
    });
    var strokeColor2 = vue.computed(() => {
      var _props$strokeColor$;
      if (!props.strokeColor) return "currentColor";
      return Array.isArray(props.strokeColor) ? (_props$strokeColor$ = props.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props.strokeColor[0] : props.strokeColor;
    });
    var fillColor1 = vue.computed(() => {
      if (!props.fillColor) return "transparent";
      return Array.isArray(props.fillColor) ? props.fillColor[0] : props.fillColor;
    });
    var fillColor2 = vue.computed(() => {
      var _props$fillColor$;
      if (!props.fillColor) return "transparent";
      return Array.isArray(props.fillColor) ? (_props$fillColor$ = props.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props.fillColor[0] : props.fillColor;
    });
    var filledColor = vue.computed(() => {
      if (!props.fillColor) return "currentColor";
      return Array.isArray(props.fillColor) ? props.fillColor[0] : props.fillColor;
    });
    var {
      className,
      style
    } = utils_useSizeProps['default'](propsSize);
    var finalCls = vue.computed(() => ["t-icon", "t-icon-document-popular-filled", className.value]);
    var finalStyle = vue.computed(() => _objectSpread(_objectSpread({
      fill: "none"
    }, style.value), attrs.style));
    var finalProps = vue.computed(() => ({
      class: finalCls.value,
      style: finalStyle.value,
      onClick: e => {
        var _props$onClick;
        return (_props$onClick = props.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props, {
          e
        });
      },
      strokeColor1: strokeColor1.value,
      strokeColor2: strokeColor2.value,
      fillColor1: fillColor1.value,
      fillColor2: fillColor2.value,
      strokeWidth: props.strokeWidth || 2,
      filledColor: filledColor.value
    }));
    return () => utils_renderFn['default'](element, finalProps.value);
  }
});

exports.default = documentPopularFilled;
//# sourceMappingURL=document-popular-filled.js.map
