<template>
  <button
    class="al-button"
    ref="alButton"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'al-button--' + type : '',
      buttonSize ? 'al-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="al-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
import { getInject } from '@form/formInject';
import { ref } from 'vue';

function initRef() {
  let alButton = ref(null);
  return {
    alButton
  };
}
const AlButton = {
  name: 'AlButton',
  props: {
    /**
     * 按钮类型:
     * primary
     * success
     * warning
     * danger
     * info
     * text
     * default (默认值)
     */
    type: {
      type: String,
      default: 'default'
    },
    /**
     * 按钮大小:
     * large (默认值)
     * medium
     * small
     * mini
     */
    size: {
      type: String,
      default: 'large'
    },
    /**
     * 按钮图标，接受元素图标组件的图标名称
     */
    icon: String,
    /**
     * HTML Button 元素的 type
     * submit
     * reset
     * button (默认值)
     * menu
     */
    nativeType: {
      type: String,
      default: 'button'
    },
    /**
     * 确定它是否正在加载，默认为 false
     */
    loading: Boolean,
    /**
     * 是否禁用按钮，默认为 false
     */
    disabled: Boolean,
    /**
     * 确定它是否是一个普通按钮
     */
    plain: Boolean,
    /**
     * HTML Button 元素的 Autofocus，使按钮自动获取焦点，默认为 false
     */
    autofocus: Boolean,
    /**
     * 确定它是否一个圆角按钮
     */
    round: Boolean,

    /**
     * 是否显示圆形按钮，默认为 false
     */
    circle: Boolean
  },
  emits: {
    click: null
  },
  setup(props, context) {
    return {
      ...initRef(),
      ...getInject()
    };
  },
  mounted() {
    if (this.circle) {
      this.alButton.style.height = this.alButton.offsetWidth + 'px';
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  },
  computed: {
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    buttonSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.disabled || (this.alForm || {}).disabled;
    }
  }
};

export default AlButton;
</script>
