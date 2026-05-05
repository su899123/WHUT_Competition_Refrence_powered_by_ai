import { _ as _defineProperty } from '../_chunks/dep-22bff531.js';
import { defineComponent, computed } from 'vue';
import renderNode from '../utils/render-fn.js';
import useSizeProps from '../utils/use-size-props.js';
import '../style/css.js';
import '../utils/use-common-classname.js';
import '../utils/config-context.js';

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
      "d": "M14.492 17.1379L19.784 19.0419L19.7859 19.045L19.7946 19.0353C20.1446 18.6478 20.4661 18.2341 20.7558 17.7974C21.858 16.1361 22.5 14.143 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 14.143 2.14198 16.136 3.24411 17.7973C3.53472 18.2353 3.85732 18.6503 4.20859 19.0389L4.21381 19.0446L4.21509 19.0419L14.4001 15.3739L14.492 17.1379ZM15.9381 16.0641L15.7929 13.278L14.2843 13.8213L14.1283 11.2859L9.81628 12.8399L9.64647 15.4915L4.70434 17.2714C3.63139 15.7896 3 13.9698 3 12C3 7.1134 6.89445 3.1364 11.7489 3.00343L11.2862 4.78999L10.2502 5.72799L10.0542 8.82199H9.52222V9.70399L9.98422 9.87199L9.88622 11.356L14.4782 9.70399V8.82199H13.9462L13.7502 5.72799L12.7202 4.78999L12.252 3.00346C17.106 3.13691 21 7.11372 21 12C21 13.97 20.3685 15.79 19.2953 17.2719L15.9381 16.0641ZM4.83765 19.678C6.71355 21.4286 9.23163 22.4999 11.9999 22.4999C14.7682 22.4999 17.2863 21.4286 19.1622 19.678C16.83 18.9449 14.3999 18.5658 11.9999 18.5658C9.59993 18.5658 7.17 18.945 4.83765 19.678ZM12.5833 6.28835L12.7581 9.04753L11.207 9.60555L11.417 6.29037L12.003 5.75984L12.5833 6.28835ZM5.78979 10.02C5.78979 11.2404 6.14187 12.3787 6.75 13.3387L7.5 12.8405C6.98666 12.0233 6.68979 11.0563 6.68979 10.02C6.68979 8.98366 6.98666 8.01668 7.5 7.19945L6.75 6.70129C6.14187 7.66127 5.78979 8.79951 5.78979 10.02ZM17.25 6.70194C17.8579 7.66179 18.2098 8.79979 18.2098 10.02C18.2098 11.2402 17.8579 12.3782 17.25 13.338L16.4996 12.8405C17.0129 12.0233 17.3098 11.0563 17.3098 10.02C17.3098 8.98366 17.0129 8.01668 16.4996 7.19945L17.25 6.70194Z"
    }
  }]
};
var logoTbeacon = defineComponent({
  name: "LogoTbeaconIcon",
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
    var propsSize = computed(() => props.size);
    var strokeColor1 = computed(() => {
      if (!props.strokeColor) return "currentColor";
      return Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor;
    });
    var strokeColor2 = computed(() => {
      var _props$strokeColor$;
      if (!props.strokeColor) return "currentColor";
      return Array.isArray(props.strokeColor) ? (_props$strokeColor$ = props.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props.strokeColor[0] : props.strokeColor;
    });
    var fillColor1 = computed(() => {
      if (!props.fillColor) return "transparent";
      return Array.isArray(props.fillColor) ? props.fillColor[0] : props.fillColor;
    });
    var fillColor2 = computed(() => {
      var _props$fillColor$;
      if (!props.fillColor) return "transparent";
      return Array.isArray(props.fillColor) ? (_props$fillColor$ = props.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props.fillColor[0] : props.fillColor;
    });
    var filledColor = computed(() => {
      if (!props.fillColor) return "currentColor";
      return Array.isArray(props.fillColor) ? props.fillColor[0] : props.fillColor;
    });
    var {
      className,
      style
    } = useSizeProps(propsSize);
    var finalCls = computed(() => ["t-icon", "t-icon-logo-tbeacon", className.value]);
    var finalStyle = computed(() => _objectSpread(_objectSpread({
      fill: "none"
    }, style.value), attrs.style));
    var finalProps = computed(() => ({
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
    return () => renderNode(element, finalProps.value);
  }
});

export default logoTbeacon;
//# sourceMappingURL=logo-tbeacon.js.map
