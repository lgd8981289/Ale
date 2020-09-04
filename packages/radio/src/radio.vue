<template>
  <label
    class="al-radio"
    :class="[
      border && radioSize ? 'al-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="al-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="al-radio__inner"></span>
      <input
        ref="radio"
        class="al-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      />
    </span>
    <span class="al-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { $alEmit } from '@mixins/emitter';
import { getInject } from '@form/formInject';
import { initData } from './radio';
import { defineComponent, nextTick, inject } from 'vue';

function initInject() {
  let alRadioGroupUpdateSymbol = inject('alRadioGroup-updateSymbol', Symbol());
  let alRadioGroupHandleChangeSymbol = inject('alRadioGroup-handleChangeSymbol', Symbol());
  return {
    ...getInject(),
    alRadioGroupUpdateSymbol,
    alRadioGroupHandleChangeSymbol
  };
}

const AlRadio = defineComponent({
  name: 'AlRadio',

  componentName: 'AlRadio',

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
    name: String,
    /**
     * 是否显示边框
     */
    border: Boolean,
    /**
     * radio 的尺寸，仅在 border 为真时有效
     */
    size: String
  },

  setup() {
    return {
      ...initInject(),
      ...initData()
    };
  },
  computed: {
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'AlRadioGroup') {
          parent = parent.$parent;
        } else {
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },
    model: {
      get() {
        return this.isGroup ? this._radioGroup.modelValue : this.modelValue;
      },
      set(val) {
        if (this.isGroup) {
          // TODO: this.dispatch('AlRadioGroup', 'update:modelValue', [val]);
          $alEmit(this.alRadioGroupUpdateSymbol, val);
        } else {
          this.$emit('update:modelValue', val);
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
      }
    },
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    radioSize() {
      const temRadioSize = this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
      return this.isGroup ? this._radioGroup.radioGroupSize || temRadioSize : temRadioSize;
    },
    isDisabled() {
      return this.isGroup
        ? this._radioGroup.disabled || this.disabled || (this.alForm || {}).disabled
        : this.disabled || (this.alForm || {}).disabled;
    },
    tabIndex() {
      return this.isDisabled || (this.isGroup && this.model !== this.label) ? -1 : 0;
    }
  },

  methods: {
    handleChange() {
      nextTick().then(() => {
        this.$emit('change', this.model);
        // TODO: this.isGroup && this.dispatch('AlRadioGroup', 'handleChange', this.model);
        this.isGroup && $alEmit(this.alRadioGroupHandleChangeSymbol, this.model);
      });
    }
  }
});

export default AlRadio;
</script>
