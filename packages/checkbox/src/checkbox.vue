<template>
  <label
    class="al-checkbox"
    :class="[
      border && checkboxSize ? 'al-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
  >
    <span
      class="al-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="al-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="al-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
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
        class="al-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="al-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { $alEmit } from '@mixins/emitter';

import { getInject } from '@form/formInject';
import { initMethods, initData } from './checkbox';
import { defineComponent, inject } from 'vue';

/**
 * 初始化 Inject
 */
function initInject() {
  // TODO: AlCheckboxGroup 注入 true
  let isGroupInject = inject('alCheckboxGroup', false);
  // TODO：AlCheckboxGroup 注入 对象 {min， max, modelValue, disabled,checkboxGroupSize}
  let parentData = inject('parentData', {});
  let alCheckboxGroupUpdateSymbol = inject('alCheckboxGroup-updateSymbol', Symbol());
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    ...getInject(),
    isGroupInject,
    parentData,
    alCheckboxGroupUpdateSymbol,
    alFormItemFormChangeSymbol
  };
}

function initMitt() {
  const alCheckboxGroupChangeSymbol = inject('alCheckboxGroup-changeSymbol', Symbol());
  return {
    alCheckboxGroupChangeSymbol
  };
}

const AlCheckbox = defineComponent({
  name: 'AlCheckbox',

  componentName: 'AlCheckbox',
  emits: {
    change: null,
    'update:modelValue': null
  },
  props: {
    /**
     * 绑定的值
     */
    modelValue: [String, Number, Boolean],
    /**
     * checkbox 的 value
     */
    label: [String, Number, Boolean],
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
    falseLabel: [String, Number],
    /**
     * 设置 indeterminate 状态，只负责样式控制
     */
    indeterminate: Boolean,
    /**
     * 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系
     */
    id: String,
    /**
     * 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系
     */
    controls: String,
    /**
     * 是否显示边框
     */
    border: Boolean,
    /**
     * Checkbox 的尺寸，仅在 border 为真时有效
     */
    size: String
  },
  setup(props, { attrs, emit }) {
    return {
      ...initInject(),
      ...initData(),
      ...initMethods(),
      ...initMitt()
    };
  },
  created() {
    this.checked && this.addToStore();
  },
  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls);
    }
  },
  computed: {
    isGroup() {
      return this.isGroupInject;
    },
    model: {
      get() {
        return this.isGroup
          ? this.store
          : this.modelValue !== undefined
          ? this.modelValue
          : this.selfModel;
      },

      set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false;
          this.parentData.min !== undefined &&
            val.length < this.parentData.min &&
            (this.isLimitExceeded = true);

          this.parentData.max !== undefined &&
            val.length > this.parentData.max &&
            (this.isLimitExceeded = true);
          // this.isLimitExceeded === false &&
          //   this.dispatch('AlCheckboxGroup', 'update:modelValue', [val]);
          this.isLimitExceeded === false && $alEmit(this.alCheckboxGroupUpdateSymbol, val);
        } else {
          this.$emit('update:modelValue', val);
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
    store() {
      return this.isGroup ? this.parentData.modelValue : this.modelValue;
    },
    /**
     * 在max/min props 下是否进行 isDisabled（禁用的） 判断
     */
    isLimitDisabled() {
      const { max, min } = this.parentData;
      return (
        (!!(max || min) && this.model.length >= max && !this.isChecked) ||
        (this.model.length <= min && this.isChecked)
      );
    },
    isDisabled() {
      return this.isGroup
        ? this.parentData.disabled ||
            this.disabled ||
            (this.alForm || {}).disabled ||
            this.isLimitDisabled
        : this.disabled.value || (this.alForm || {}).disabled;
    },
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    checkboxSize() {
      const temCheckboxSize = this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
      return this.isGroup ? this.parentData.checkboxGroupSize || temCheckboxSize : temCheckboxSize;
    }
  },

  watch: {
    value(value) {
      // this.dispatch('AlFormItem', 'al.form.change', value);
      $alEmit(this.alFormItemFormChangeSymbol, value);
    }
  }
});

export default AlCheckbox;
</script>
