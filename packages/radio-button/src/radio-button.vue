<template>
  <label
    class="al-radio-button"
    :class="[
      size ? 'al-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="al-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    />
    <span
      class="al-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop
    >
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { $alEmit } from '@mixins/emitter';
import { getInject } from '@form/formInject';
import { initData } from '../../radio/src/radio';
import { defineComponent, inject } from 'vue';

function initInject() {
  let alRadioGroupUpdateSymbol = inject('alRadioGroup-updateSymbol', Symbol());
  let alRadioGroupHandleChangeSymbol = inject('alRadioGroup-alRadioGroupHandleChangeSymbol', null);
  return {
    ...getInject(),
    alRadioGroupUpdateSymbol,
    alRadioGroupHandleChangeSymbol
  };
}

const AlRadioButton = defineComponent({
  name: 'AlRadioButton',
  componentName: 'AlRadioButton',
  emits: {
    'update:modelValue': null
  },
  props: {
    /**
     * Radio 的 value
     */
    label: {},
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 原生 name 属性
     */
    name: String
  },
  setup() {
    return {
      ...initInject(),
      ...initData()
    };
  },
  computed: {
    value: {
      get() {
        return this._radioGroup.modelValue;
      },
      set(value) {
        $alEmit(this.alRadioGroupUpdateSymbol, value);
      }
    },
    _radioGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'AlRadioGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },
    activeStyle() {
      return {
        backgroundColor: this._radioGroup.fill || '',
        borderColor: this._radioGroup.fill || '',
        boxShadow: this._radioGroup.fill ? `-1px 0 0 0 ${this._radioGroup.fill}` : '',
        color: this._radioGroup.textColor || ''
      };
    },
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    size() {
      return (
        this._radioGroup.radioGroupSize || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size
      );
    },
    isDisabled() {
      return this.disabled || this._radioGroup.disabled || (this.alForm || {}).disabled;
    },
    tabIndex() {
      return this.isDisabled || (this._radioGroup && this.value !== this.label) ? -1 : 0;
    }
  },

  methods: {
    handleChange() {
      this.$nextTick(() => {
        // TODO: this.dispatch('AlRadioGroup', 'handleChange', this.value);
        $alEmit(this.alRadioGroupHandleChangeSymbol, this.value);
      });
    }
  }
});

export default AlRadioButton;
</script>
