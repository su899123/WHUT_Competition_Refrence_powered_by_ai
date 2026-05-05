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
      "d": "M14.4922 17.1377L19.7842 19.042L19.7852 19.0439C17.8639 21.1661 15.0881 22.5 12 22.5C8.91168 22.5 6.13514 21.1663 4.21387 19.0439L4.21484 19.042L14.4004 15.374L14.4922 17.1377ZM12.001 19.5C10.336 19.5 8.65331 19.6922 7 20.0684C8.45753 20.9754 10.1686 21.5 12.001 21.5C13.8329 21.4999 15.5428 20.9749 17 20.0684C15.3473 19.6925 13.6654 19.5 12.001 19.5Z"
    }
  }, {
    "tag": "path",
    "attrs": {
      "fill": "props.filledColor",
      "d": "M12.583 6.28809L12.7578 9.04785L11.207 9.60547L11.417 6.29004L12.0029 5.75977L12.583 6.28809Z"
    }
  }, {
    "tag": "path",
    "attrs": {
      "fill": "props.filledColor",
      "d": "M12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 14.1433 21.8563 16.1355 20.7539 17.7969L15.9385 16.0645L15.793 13.2783L14.2842 13.8213L14.1279 11.2861L9.81641 12.8398L9.64648 15.4912L3.24512 17.7959C2.14319 16.1347 1.5 14.1428 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5ZM6.75 6.70117C6.14193 7.66107 5.7901 8.79919 5.79004 10.0195C5.79004 11.24 6.14187 12.3789 6.75 13.3389L7.5 12.8408C6.98666 12.0236 6.68945 11.0558 6.68945 10.0195C6.68952 8.98334 6.98672 8.01637 7.5 7.19922L6.75 6.70117ZM16.5 7.19922C17.0132 8.01635 17.3095 8.98338 17.3096 10.0195C17.3096 11.0558 17.0133 12.0236 16.5 12.8408L17.25 13.3379C17.8579 12.378 18.21 11.2397 18.21 10.0195C18.2099 8.79956 17.8577 7.66186 17.25 6.70215L16.5 7.19922ZM11.749 3.00391L11.2861 4.79004L10.25 5.72754L10.0547 8.82227H9.52246V9.7041L9.98438 9.87207L9.88574 11.3564L14.4785 9.7041V8.82227H13.9463L13.75 5.72754L12.7207 4.79004L12.252 3.00391H11.749Z"
    }
  }]
};
var logoTbeaconFilled = vue.defineComponent({
  name: "LogoTbeaconFilledIcon",
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
    var finalCls = vue.computed(() => ["t-icon", "t-icon-logo-tbeacon-filled", className.value]);
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

exports.default = logoTbeaconFilled;
//# sourceMappingURL=logo-tbeacon-filled.js.map
