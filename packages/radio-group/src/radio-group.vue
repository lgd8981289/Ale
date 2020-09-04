<template>
  <div class="al-radio-group" role="radiogroup" @keydown="handleKeydown">
    <slot></slot>
  </div>
</template>
<script>
import { $alEmit, $alOn } from '@mixins/emitter';
import { getInject } from '@form/formInject';
import { defineComponent, provide, inject } from 'vue';

const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
});

function initMitt(emit) {
  let handleChangeSymbol = Symbol('alRadioGroup-handleChange');
  let updateSymbol = Symbol('alRadioGroup-update:modelValue');

  $alOn(handleChangeSymbol, (e) => emit('change', e));
  $alOn(updateSymbol, (e) => emit('update:modelValue', e));

  provide('alRadioGroup-handleChangeSymbol', handleChangeSymbol);
  provide('alRadioGroup-updateSymbol', updateSymbol);
}

function initMethods() {
  function handleKeydown(e) {
    // 左右上下按键 可以在radio组内切换不同选项
    const target = e.target;
    const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
    const radios = this.$el.querySelectorAll(className);
    const length = radios.length;
    const index = [].indexOf.call(radios, target);
    const roleRadios = this.$el.querySelectorAll('[role=radio]');
    switch (e.keyCode) {
      case keyCode.LEFT:
      case keyCode.UP:
        e.stopPropagation();
        e.preventDefault();
        if (index === 0) {
          roleRadios[length - 1].click();
          roleRadios[length - 1].focus();
        } else {
          roleRadios[index - 1].click();
          roleRadios[index - 1].focus();
        }
        break;
      case keyCode.RIGHT:
      case keyCode.DOWN:
        if (index === length - 1) {
          e.stopPropagation();
          e.preventDefault();
          roleRadios[0].click();
          roleRadios[0].focus();
        } else {
          roleRadios[index + 1].click();
          roleRadios[index + 1].focus();
        }
        break;
      default:
        break;
    }
  }
  return {
    handleKeydown
  };
}

function initInject() {
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    ...getInject(),
    alFormItemFormChangeSymbol
  };
}

const AlRadioGroup = defineComponent({
  name: 'AlRadioGroup',

  componentName: 'AlRadioGroup',

  emits: {
    handleChange: null,
    change: null,
    'update:modelValue': null
  },

  props: {
    /**
     * 绑定的值
     */
    modelValue: [String, Number, Boolean],
    /**
     * 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效
     */
    size: String,
    /**
     * 按钮形式的 Radio 激活时的填充色和边框色
     */
    fill: String,
    /**
     * 按钮形式的 Radio 激活时的文本颜色
     */
    textColor: String,
    /**
     * 是否禁用
     */
    disabled: Boolean
  },

  setup(props, { emit }) {
    initMitt(emit);
    return {
      ...initInject(),
      ...initMethods()
    };
  },

  computed: {
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    radioGroupSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    }
  },

  mounted() {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航

    const radios = this.$el.querySelectorAll('[type=radio]');
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
    if (![].some.call(radios, (radio) => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  },
  watch: {
    value(value) {
      $alEmit(this.alFormItemFormChangeSymbol, value);
    }
  }
});

export default AlRadioGroup;
</script>
