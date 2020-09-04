<template>
  <div
    @dragstart.prevent
    :class="[
      'al-input-number',
      inputNumberSize ? 'al-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]"
  >
    <span
      class="al-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{ 'is-disabled': minDisabled }"
      @keydown.enter="decrease"
    >
      <i :class="`al-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="al-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{ 'is-disabled': maxDisabled }"
      @keydown.enter="increase"
    >
      <i :class="`al-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <al-input
      ref="input"
      :modelValue="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @update:modelValue="handleInput"
      @change="handleInputChange"
    >
    </al-input>
  </div>
</template>
<script>
import AlInput from '@components/input';
import Focus from '@mixins/focus';
import RepeatClick from '@directives/repeat-click';
import { getInject } from '@form/formInject';
import { defineComponent, ref } from 'vue';

function initData() {
  let currentValue = ref(0);
  let userInput = ref(null);
  return {
    currentValue,
    userInput
  };
}

function initMethods() {
  function toPrecision(num, precision) {
    if (precision === undefined) precision = this.numPrecision;
    let precisionStr = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision) + '';

    return parseFloat(precisionStr);
  }

  function getPrecision(value) {
    if (value === undefined) return 0;
    const valueString = value.toString();
    const dotPosition = valueString.indexOf('.');
    let precision = 0;
    if (dotPosition !== -1) {
      precision = valueString.length - dotPosition - 1;
    }
    return precision;
  }

  function setCurrentValue(newVal) {
    const oldVal = this.currentValue;
    if (typeof newVal === 'number' && this.precision !== undefined) {
      newVal = this.toPrecision(newVal, this.precision);
    }
    if (newVal >= this.max) newVal = this.max;
    if (newVal <= this.min) newVal = this.min;
    if (oldVal === newVal) return;
    this.userInput = null;
    this.$emit('update:modelValue', newVal);
    this.$emit('change', newVal, oldVal);
    this.currentValue = newVal;
  }

  function select() {
    this.$refs.input.select();
  }

  return {
    toPrecision,
    getPrecision,
    setCurrentValue,
    select
  };
}

const AlInputNumber = defineComponent({
  name: 'AlInputNumber',
  componentName: 'AlInputNumber',
  mixins: [Focus('input')],
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    AlInput
  },
  emits: {
    blur: null,
    focus: null,
    change: null,
    'update:modelValue': null
  },
  props: {
    /**
     * 	绑定值
     * default: 0
     */
    modelValue: {
      type: Number,
      default: 0
    },
    /**
     * 计数器步长
     * default: 1
     */
    step: {
      type: Number,
      default: 1
    },
    /**
     * 是否只能输入 step 的倍数
     * default: false
     */
    stepStrictly: {
      type: Boolean,
      default: false
    },
    /**
     * 设置计数器允许的最大值
     * default: Infinity
     */
    max: {
      type: Number,
      default: Infinity
    },
    /**
     * 设置计数器允许的最小值
     * default: -Infinity
     */
    min: {
      type: Number,
      default: -Infinity
    },
    /**
     * 是否禁用计数器
     * default: false
     */
    disabled: Boolean,
    /**
     * 计数器尺寸
     * options: large, small
     */
    size: String,
    /**
     * 是否使用控制按钮
     * default: true
     */
    controls: {
      type: Boolean,
      default: true
    },
    /**
     * 控制按钮位置
     * options: right
     */
    controlsPosition: {
      type: String,
      default: ''
    },
    /**
     * 原生属性
     */
    name: String,
    /**
     * 	输入框关联的label文字
     */
    label: String,
    /**
     * 输入框默认 placeholder
     */
    placeholder: String,
    /**
     * 数值精度
     * options: 10 进制 且 不小于 0
     */
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val + '', 10);
      }
    }
  },
  setup() {
    return {
      ...getInject(),
      ...initData(),
      ...initMethods()
    };
  },
  mounted() {
    let innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('role', 'spinbutton');
    innerInput.setAttribute('aria-valuemax', this.max);
    innerInput.setAttribute('aria-valuemin', this.min);
    innerInput.setAttribute('aria-valuenow', this.currentValue);
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
  },
  updated() {
    if (!this.$refs || !this.$refs.input) return;
    const innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('aria-valuenow', this.currentValue);
  },
  methods: {
    _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;

      const precisionFactor = Math.pow(10, this.numPrecision);
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },

    increase() {
      if (this.inputNumberDisabled || this.maxDisabled) return;
      const value = this.modelValue || 0;
      const newVal = this._increase(value, this.step);
      this.setCurrentValue(newVal);
    },

    _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;

      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },

    decrease() {
      if (this.inputNumberDisabled || this.minDisabled) return;
      const value = this.modelValue || 0;
      const newVal = this._decrease(value, this.step);
      this.setCurrentValue(newVal);
    },

    handleBlur(event) {
      this.$emit('blur', event);
    },

    handleFocus(event) {
      this.$emit('focus', event);
    },

    handleInput(value) {
      this.userInput = value;
    },

    handleInputChange(value) {
      const newVal = value === '' ? undefined : Number(value);
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal);
      }
      this.userInput = null;
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.modelValue, this.step) < this.min;
    },
    maxDisabled() {
      return this._increase(this.modelValue, this.step) > this.max;
    },
    numPrecision() {
      const { modelValue, step, getPrecision, precision } = this;
      const stepPrecision = getPrecision(step);
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn(
            '[Ale Warn][InputNumber]precision should not be less than the decimal places of step'
          );
        }
        return precision;
      } else {
        return Math.max(getPrecision(modelValue), stepPrecision);
      }
    },
    controlsAtRight() {
      return this.controls && this.controlsPosition === 'right';
    },
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    inputNumberSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    },
    inputNumberDisabled() {
      return this.disabled || !!(this.alForm || {}).disabled;
    },
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      }

      let currentValue = this.currentValue;

      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step);
          const precisionFactor = Math.pow(10, stepPrecision);
          currentValue =
            (Math.round(currentValue / this.step) * precisionFactor * this.step) / precisionFactor;
        }

        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }
      }

      return currentValue;
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        let newVal = value === undefined ? value : Number(value);
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return;
          }

          if (this.stepStrictly) {
            const stepPrecision = this.getPrecision(this.step);
            const precisionFactor = Math.pow(10, stepPrecision);
            newVal =
              (Math.round(newVal / this.step) * precisionFactor * this.step) / precisionFactor;
          }

          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision);
          }
        }
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.userInput = null;
        this.$emit('update:modelValue', newVal);
      }
    }
  }
});

export default AlInputNumber;
</script>
