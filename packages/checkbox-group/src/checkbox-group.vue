<template>
  <div class="al-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { $alEmit, $alOn } from '@mixins/emitter';
import { defineComponent, provide, inject, computed } from 'vue';
function initInject() {
  let alFormItem = inject('alFormItem', '');
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    alFormItem,
    alFormItemFormChangeSymbol
  };
}

function initComputed(props, injectData) {
  let _alFormItemSize = computed(() => (injectData.alFormItem || {}).alFormItemSize);
  let checkboxGroupSize = computed(
    () => props.size || _alFormItemSize || (window.Ale.$ELEMENT || {}).size
  );
  return {
    _alFormItemSize,
    checkboxGroupSize
  };
}

function initMitt(emit) {
  let updateSymbol = Symbol('alCheckboxGroup-update:modelValue');
  let changeSymbol = Symbol('alCheckboxGroup-changeSymbol');

  $alOn(updateSymbol, (e) => emit('update:modelValue', e));

  provide('alCheckboxGroup-updateSymbol', updateSymbol);
  provide('alCheckboxGroup-changeSymbol', changeSymbol);
}

const AlCheckboxGroup = defineComponent({
  name: 'AlCheckboxGroup',

  componentName: 'AlCheckboxGroup',

  emits: {
    change: null,
    'update:modelValue': null
  },

  props: {
    /**
     * 绑定值
     */
    modelValue: {},
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 可被勾选的 checkbox 的最小数量
     */
    min: Number,
    /**
     * 可被勾选的 checkbox 的最大数量
     */
    max: Number,
    /**
     * 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效
     */
    size: String,
    /**
     * 按钮形式的 Checkbox 激活时的填充色和边框色
     */
    fill: String,
    /**
     * 按钮形式的 Checkbox 激活时的文本颜色
     */
    textColor: String
  },

  setup(props, { emit }) {
    initMitt(emit);

    let injectData = initInject();
    let computedData = initComputed(props, injectData);

    provide('alCheckboxGroup', true);
    provide('parentData', props);
    return {
      ...injectData,
      ...computedData
    };
  },

  watch: {
    value(value) {
      // TODO: this.dispatch('AlFormItem', 'el.form.change', [value]);
      $alEmit(this.alFormItemFormChangeSymbol, value);
    }
  }
});

export default AlCheckboxGroup;
</script>
