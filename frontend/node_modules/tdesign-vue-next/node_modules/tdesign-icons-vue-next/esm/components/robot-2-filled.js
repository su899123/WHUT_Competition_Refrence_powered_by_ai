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
      "d": "M9.00098 11.5C9.82846 11.5002 10.5 12.1715 10.5 12.999V13.001C10.5 13.8285 9.82846 14.4998 9.00098 14.5H8.99902C8.1714 14.5 7.5 13.8286 7.5 13.001V12.999C7.5 12.1714 8.1714 11.5 8.99902 11.5H9.00098Z"
    }
  }, {
    "tag": "path",
    "attrs": {
      "fill": "props.filledColor",
      "d": "M15.001 11.5C15.8285 11.5002 16.5 12.1715 16.5 12.999V13.001C16.5 13.8285 15.8285 14.4998 15.001 14.5H14.999C14.1714 14.5 13.5 13.8286 13.5 13.001V12.999C13.5 12.1714 14.1714 11.5 14.999 11.5H15.001Z"
    }
  }, {
    "tag": "path",
    "attrs": {
      "fill": "props.filledColor",
      "d": "M12 0C13.1046 0 14 0.89543 14 2C14 2.73976 13.5971 3.3835 13 3.72949V5C17.2834 5 20.8654 7.99185 21.7754 12H22C23.1046 12 24 12.8954 24 14C24 15.1046 23.1046 16 22 16H21.7754C20.8654 20.0082 17.2834 23 13 23H11C6.71661 23 3.13458 20.0082 2.22461 16H2C0.89543 16 0 15.1046 0 14C0 12.8954 0.89543 12 2 12H2.22461C3.13458 7.99185 6.71661 5 11 5V3.72949C10.4029 3.3835 10 2.73976 10 2C10 0.89543 10.8954 0 12 0ZM12 8.25C9.12907 8.25001 7.31702 9.20711 6.29492 10.6611C5.31668 12.053 5.20708 13.7023 5.27344 14.8223C5.36452 16.3596 6.71295 17.25 8.00879 17.25H15.9912C17.287 17.2499 18.6345 16.3596 18.7256 14.8223C18.7919 13.7022 18.6825 12.053 17.7041 10.6611C16.682 9.20719 14.8707 8.25007 12 8.25Z"
    }
  }]
};
var robot2Filled = defineComponent({
  name: "Robot2FilledIcon",
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
    var finalCls = computed(() => ["t-icon", "t-icon-robot-2-filled", className.value]);
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

export default robot2Filled;
//# sourceMappingURL=robot-2-filled.js.map
