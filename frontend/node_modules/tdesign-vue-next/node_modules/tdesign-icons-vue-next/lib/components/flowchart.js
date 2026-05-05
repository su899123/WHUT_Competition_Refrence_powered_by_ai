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
    "tag": "g",
    "attrs": {
      "id": "flowchart"
    },
    "children": [{
      "tag": "g",
      "attrs": {
        "id": "fill1"
      },
      "children": [{
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M3.00012 6.75008H8.06723V3.24992H3.00012V6.75008Z"
        }
      }, {
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M3 17.2497H8V20.7499H3V17.2497Z"
        }
      }, {
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M21.0001 5C21.0001 6.10457 20.1047 7 19.0001 7C17.8955 7 17.0001 6.10457 17.0001 5C17.0001 3.89543 17.8955 3 19.0001 3C20.1047 3 21.0001 3.89543 21.0001 5Z"
        }
      }, {
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M21.0001 19.0001C21.0001 20.1046 20.1047 21.0001 19.0001 21.0001C17.8955 21.0001 17 20.1043 17 18.9998C17 17.8952 17.8955 17.0001 19.0001 17.0001C20.1047 17.0001 21.0001 17.8955 21.0001 19.0001Z"
        }
      }, {
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M3.00011 13.7501H8.00011V10.2499H3.00011V13.7501Z"
        }
      }, {
        "tag": "path",
        "attrs": {
          "fill": "props.fillColor1",
          "d": "M21.0001 12C21.0001 13.1046 20.1047 14 19.0001 14C17.8955 14 17.0001 13.1046 17.0001 12C17.0001 10.8954 17.8955 9.99999 19.0001 9.99999C20.1047 9.99999 21.0001 10.8954 21.0001 12Z"
        }
      }]
    }, {
      "tag": "path",
      "attrs": {
        "id": "stroke1",
        "stroke": "props.strokeColor1",
        "d": "M5.56723 10.2499V6.75008M5.56723 6.75008H3.00012V3.24992H8.06723V5M5.56723 6.75008H8.06723V5M8.06723 5H17.0001M17.0001 5C17.0001 6.10457 17.8955 7 19.0001 7C20.1047 7 21.0001 6.10457 21.0001 5C21.0001 3.89543 20.1047 3 19.0001 3C17.8955 3 17.0001 3.89543 17.0001 5ZM5.5 13.7497V17.2497M8 18.9998V17.2497H3V20.7499H8V18.9998ZM8 18.9998H17M17 18.9998C17 20.1043 17.8955 21.0001 19.0001 21.0001C20.1047 21.0001 21.0001 20.1046 21.0001 19.0001C21.0001 17.8955 20.1047 17.0001 19.0001 17.0001C17.8955 17.0001 17 17.8952 17 18.9998ZM8.00011 12V13.7501H3.00011V10.2499H8.00011V12ZM8.00011 12C8.00011 12 13.4854 12 17.0001 12M17.0001 12C17.0001 13.1046 17.8955 14 19.0001 14C20.1047 14 21.0001 13.1046 21.0001 12C21.0001 10.8954 20.1047 9.99999 19.0001 9.99999C17.8955 9.99999 17.0001 10.8954 17.0001 12Z",
        "strokeLinecap": "square",
        "strokeWidth": "props.strokeWidth"
      }
    }]
  }]
};
var flowchart = vue.defineComponent({
  name: "FlowchartIcon",
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
    var finalCls = vue.computed(() => ["t-icon", "t-icon-flowchart", className.value]);
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

exports.default = flowchart;
//# sourceMappingURL=flowchart.js.map
