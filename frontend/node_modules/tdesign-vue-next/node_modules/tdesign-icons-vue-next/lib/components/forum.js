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
      "id": "forum"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "id": "fill1",
        "fill": "props.fillColor1",
        "d": "M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM9.5 14C9.22386 14 9 14.2239 9 14.5C9 14.7761 9.22386 15 9.5 15C9.77614 15 10 14.7761 10 14.5C10 14.2239 9.77614 14 9.5 14ZM8 11V11.002H8.00195V11H8ZM13 7C11.8954 7 11 7.89543 11 9C11 10.1046 11.8954 11 13 11C14.1046 11 15 10.1046 15 9C15 7.89543 14.1046 7 13 7Z",
        "fillRule": "evenodd",
        "clipRule": "evenodd"
      }
    }, {
      "tag": "path",
      "attrs": {
        "id": "stroke1",
        "stroke": "props.strokeColor1",
        "d": "M14.2855 4.33121C17.5471 2.18336 20.3467 1.37821 21.4843 2.51574C22.6218 3.65328 21.8166 6.45287 19.6688 9.71453M14.2855 4.33121C13.5613 4.1157 12.7942 3.99997 12 3.99997C7.58169 3.99997 3.99997 7.58169 3.99997 12C3.99997 12.7942 4.1157 13.5613 4.33121 14.2855M14.2855 4.33121C16.866 5.09914 18.9009 7.13402 19.6688 9.71453M4.33121 14.2855C2.18336 17.5471 1.37821 20.3467 2.51574 21.4843C3.65328 22.6218 6.45288 21.8166 9.71453 19.6688M4.33121 14.2855C5.09914 16.866 7.13402 18.9009 9.71453 19.6688M19.6688 9.71453C19.8843 10.4387 20 11.2058 20 12C20 16.4182 16.4183 20 12 20C11.2058 20 10.4387 19.8843 9.71453 19.6688M19.6688 9.71453C18.5199 11.4592 16.9868 13.336 15.1614 15.1614C13.336 16.9868 11.4592 18.5199 9.71453 19.6688",
        "strokeLinecap": "square",
        "strokeWidth": "props.strokeWidth"
      }
    }, {
      "tag": "g",
      "attrs": {
        "id": "stroke2"
      },
      "children": [{
        "tag": "path",
        "attrs": {
          "stroke": "props.strokeColor2",
          "d": "M10.0002 14.5C10.0002 14.7761 9.77639 15 9.50024 15C9.2241 15 9.00024 14.7761 9.00024 14.5C9.00024 14.2239 9.2241 14 9.50024 14C9.77639 14 10.0002 14.2239 10.0002 14.5Z",
          "strokeWidth": "props.strokeWidth"
        }
      }, {
        "tag": "path",
        "attrs": {
          "stroke": "props.strokeColor2",
          "d": "M8.01023 11C8.01023 11.0055 8.00576 11.01 8.00023 11.01C7.99471 11.01 7.99023 11.0055 7.99023 11C7.99023 10.9945 7.99471 10.99 8.00023 10.99C8.00576 10.99 8.01023 10.9945 8.01023 11Z",
          "strokeWidth": "props.strokeWidth"
        }
      }, {
        "tag": "path",
        "attrs": {
          "stroke": "props.strokeColor2",
          "d": "M15.0002 9C15.0002 10.1046 14.1048 11 13.0002 11C11.8957 11 11.0002 10.1046 11.0002 9C11.0002 7.89543 11.8957 7 13.0002 7C14.1048 7 15.0002 7.89543 15.0002 9Z",
          "strokeWidth": "props.strokeWidth"
        }
      }]
    }]
  }]
};
var forum = vue.defineComponent({
  name: "ForumIcon",
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
    var finalCls = vue.computed(() => ["t-icon", "t-icon-forum", className.value]);
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

exports.default = forum;
//# sourceMappingURL=forum.js.map
