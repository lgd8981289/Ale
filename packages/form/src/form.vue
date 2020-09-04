<template>
  <form
    class="al-form"
    :class="[labelPosition ? 'al-form--label-' + labelPosition : '', { 'al-form--inline': inline }]"
  >
    <slot></slot>
  </form>
</template>
<script>
import { $alOn } from '@mixins/emitter';
import objectAssign from '@utils/merge';
import { defineComponent, ref, provide } from 'vue';

function initData() {
  let fields = ref([]);
  // 使用此数组计算自动宽度
  let potentialLabelWidthArr = ref([]);
  return {
    fields,
    potentialLabelWidthArr
  };
}

function initMitt(data) {
  let alFormAddFieldSymbol = Symbol('alFrom-addFieldSymbol');
  let alFormRemoveFieldSymbol = Symbol('alFrom-removeFieldSymbol');

  $alOn(alFormAddFieldSymbol, (field) => {
    if (field) {
      data.fields.value.push(field);
    }
  });

  $alOn(alFormRemoveFieldSymbol, (field) => {
    if (field) {
      data.fields.value.splice(data.fields.value.indexOf(field), 1);
    }
  });

  provide('alFrom-addFieldSymbol', alFormAddFieldSymbol);
  provide('alFrom-removeFieldSymbol', alFormRemoveFieldSymbol);
}

const AlForm = defineComponent({
  name: 'AlForm',

  componentName: 'AlForm',

  provide() {
    return {
      alForm: this
    };
  },

  props: {
    /**
     * 表单数据对象
     */
    model: Object,
    /**
     * 表单验证规则
     */
    rules: Object,
    /**
     * 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     */
    labelPosition: String,
    /**
     * 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
     */
    labelWidth: String,
    /**
     * 表单域标签的后缀
     */
    labelSuffix: {
      type: String,
      default: ''
    },
    /**
     * 行内表单模式
     */
    inline: Boolean,
    /**
     * 是否以行内形式展示校验信息
     */
    inlineMessage: Boolean,
    /**
     * 是否在输入框中显示校验结果反馈图标
     */
    statusIcon: Boolean,
    /**
     * 是否显示校验错误信息
     */
    showMessage: {
      type: Boolean,
      default: true
    },
    /**
     * 用于控制该表单内组件的尺寸
     */
    size: String,
    /**
     * 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
     */
    disabled: Boolean,
    /**
     * 是否在 rules 属性改变后立即触发一次验证
     */
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示必填字段的标签旁边的红色星号
     */
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const data = initData();
    initMitt(data);
    return {
      ...data
    };
  },
  watch: {
    rules() {
      // remove then add event listeners on form-item after form rules change
      this.fields.forEach((field) => {
        field.removeValidateEvents();
        field.addValidateEvents();
      });

      if (this.validateOnRuleChange) {
        this.validate(() => {});
      }
    }
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0;
      const max = Math.max(...this.potentialLabelWidthArr);
      return max ? `${max}px` : '';
    }
  },

  methods: {
    resetFields() {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for resetFields to work.');
        return;
      }
      this.fields.forEach((field) => {
        field.resetField();
      });
    },
    clearValidate(props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter((field) => props === field.prop)
          : this.fields.filter((field) => props.indexOf(field.prop) > -1)
        : this.fields;
      fields.forEach((field) => {
        field.clearValidate();
      });
    },
    validate(callback) {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for validate to work!');
        return;
      }

      let promise;
      // if no callback, return promise
      if (typeof callback !== 'function' && Promise) {
        promise = new Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      let valid = true;
      let count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {};
      this.fields.forEach((field) => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false;
          }
          invalidFields = objectAssign({}, invalidFields, field);
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields);
          }
        });
      });

      if (promise) {
        return promise;
      }
    },
    validateField(props, cb) {
      props = [].concat(props);
      const fields = this.fields.filter((field) => props.indexOf(field.prop) !== -1);
      if (!fields.length) {
        console.warn('[Element Warn]please pass correct props!');
        return;
      }

      fields.forEach((field) => {
        field.validate('', cb);
      });
    },
    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.indexOf(width);
      // it's impossible
      if (index === -1) {
        throw new Error(`[AlementForm]unpected width ${width}`);
      }
      return index;
    },
    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal);
        this.potentialLabelWidthArr.splice(index, 1, val);
      } else if (val) {
        this.potentialLabelWidthArr.push(val);
      }
    },
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val);
      this.potentialLabelWidthArr.splice(index, 1);
    }
  }
});

export default AlForm;
</script>
