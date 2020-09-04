<template>
  <label
    class="al-checkbox-button"
    :class="[
      size ? 'al-checkbox-button--' + size : '',
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked },
      { 'is-focus': focus }
    ]"
    role="checkbox"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <input
      v-if="trueLabel || falseLabel"
      class="al-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    />
    <input
      v-else
      class="al-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    />

    <span
      class="al-checkbox-button__inner"
      v-if="$slots.default || label"
      :style="isChecked ? activeStyle : null"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script>
import { $alEmit } from '@mixins/emitter';

import { getInject } from '@form/formInject';
import { initMethods, initData } from '../../checkbox/src/checkbox';
import { defineComponent, inject } from 'vue';

function initInject() {
  let alCheckboxGroupUpdateSymbol = inject('alCheckboxGroup-updateSymbol', Symbol());
  return {
    ...getInject(),
    alCheckboxGroupUpdateSymbol
  };
}

const AlCheckboxButton = defineComponent({
  name: 'AlCheckboxButton',
  componentName: 'AlCheckboxButton',
  emits: {
    'update:modelValue': null,
    change: null
  },

  props: {
    /**
     * 绑定的值
     */
    modelValue: [String, Number, Boolean],
    /**
     * checkbox 的 value
     */
    label: {},
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 当前是否勾选
     */
    checked: Boolean,
    /**
     * 原生 name 属性
     */
    name: String,
    /**
     * 选中时的值
     */
    trueLabel: [String, Number],
    /**
     * 没有选中时的值
     */
    falseLabel: [String, Number]
  },
  setup(props) {
    return {
      ...initInject(),
      ...initData(),
      ...initMethods()
    };
  },
  created() {
    this.checked && this.addToStore();
  },
  computed: {
    model: {
      get() {
        return this._checkboxGroup
          ? this.store
          : this.modelValue !== undefined
          ? this.modelValue
          : this.selfModel;
      },

      set(val) {
        if (this._checkboxGroup) {
          this.isLimitExceeded = false;
          this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (this.isLimitExceeded = true);

          this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (this.isLimitExceeded = true);

          // this.isLimitExceeded === false &&
          // this.dispatch('AlCheckboxGroup', 'update:modelValue', [val]);
          this.isLimitExceeded === false && $alEmit(this.alCheckboxGroupUpdateSymbol, val);
        } else if (this.modelValue !== undefined) {
          this.$emit('update:modelValue', val);
        } else {
          this.selfModel = val;
        }
      }
    },

    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },

    _checkboxGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'AlCheckboxGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },

    store() {
      return this._checkboxGroup ? this._checkboxGroup.modelValue : this.modelValue;
    },

    activeStyle() {
      return {
        backgroundColor: this._checkboxGroup.fill || '',
        borderColor: this._checkboxGroup.fill || '',
        color: this._checkboxGroup.textColor || '',
        'box-shadow': '-1px 0 0 0 ' + this._checkboxGroup.fill
      };
    },

    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },

    size() {
      return (
        this._checkboxGroup.checkboxGroupSize || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size
      );
    },

    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup;
      return (
        (!!(max || min) && this.model.length >= max && !this.isChecked) ||
        (this.model.length <= min && this.isChecked)
      );
    },

    isDisabled() {
      return this._checkboxGroup
        ? this._checkboxGroup.disabled ||
            this.disabled ||
            (this.alForm || {}).disabled ||
            this.isLimitDisabled
        : this.disabled || (this.alForm || {}).disabled;
    }
  }
});

export default AlCheckboxButton;
</script>
