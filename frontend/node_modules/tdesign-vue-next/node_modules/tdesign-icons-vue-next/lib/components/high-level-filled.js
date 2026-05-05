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
      "d": "M12 0.5C13.4655 0.5 14.6898 1.56053 14.9482 2.95312C16.2164 3.3418 17.414 3.98301 18.4463 4.85645C20.3893 6.49985 21.6328 8.81116 21.9326 11.3428L22.0508 12.3359L20.0645 12.5703L19.9473 11.5771C19.707 9.54912 18.7109 7.70028 17.1543 6.38379C16.4049 5.74972 15.5406 5.26848 14.6211 4.95215C14.108 5.87336 13.1257 6.5 12 6.5C10.3477 6.5 9 5.15228 9 3.5C9 1.84772 10.3477 0.5 12 0.5ZM7.5 17C7.5 18.6523 6.15228 20 4.5 20C2.84772 20 1.5 18.6523 1.5 17C1.5 16.2123 1.80897 15.4962 2.30859 14.96C1.95539 13.5807 1.90126 12.1363 2.15527 10.7139L2.15625 10.7119C2.61202 8.19963 4.01238 5.96634 6.05566 4.45605L6.85938 3.86133L8.04883 5.46973L7.24414 6.06445C5.60767 7.27413 4.48826 9.06085 4.12402 11.0684C3.94752 12.0586 3.95867 13.0572 4.14746 14.0215C4.26316 14.0078 4.38074 14 4.5 14C6.15228 14 7.5 15.3477 7.5 17ZM22.5 17C22.5 18.6523 21.1523 20 19.5 20C19.231 20 18.971 19.9605 18.7227 19.8936C17.8053 20.7311 16.731 21.4026 15.5459 21.8545L15.5439 21.8555C13.1675 22.7549 10.5339 22.7216 8.17676 21.7432L7.25293 21.3604L8.01953 19.5127L8.94336 19.8965C10.8262 20.678 12.9324 20.7049 14.8359 19.9844C15.6406 19.6772 16.3817 19.2429 17.0371 18.708C16.6992 18.2226 16.5 17.634 16.5 17C16.5 15.3477 17.8477 14 19.5 14C21.1523 14 22.5 15.3477 22.5 17Z"
    }
  }]
};
var highLevelFilled = vue.defineComponent({
  name: "HighLevelFilledIcon",
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
    var finalCls = vue.computed(() => ["t-icon", "t-icon-high-level-filled", className.value]);
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

exports.default = highLevelFilled;
//# sourceMappingURL=high-level-filled.js.map
