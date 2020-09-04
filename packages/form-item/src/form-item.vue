<template>
  <div
    class="al-form-item"
    :class="[
      {
        'al-form-item--feedback': alForm && alForm.statusIcon,
        'is-error': validateState === 'error',
        'is-validating': validateState === 'validating',
        'is-success': validateState === 'success',
        'is-required': isRequired || required,
        'is-no-asterisk': alForm && alForm.hideRequiredAsterisk
      },
      sizeClass ? 'al-form-item--' + sizeClass : ''
    ]"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'"
    >
      <label
        :for="labelFor"
        class="al-form-item__label"
        :style="labelStyle"
        v-if="label || $slots.label"
      >
        <slot name="label">{{ label + form.labelSuffix }}</slot>
      </label>
    </label-wrap>
    <div class="al-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="al-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage"
        >
          <div
            class="al-form-item__error"
            :class="{
              'al-form-item__error--inline':
                typeof inlineMessage === 'boolean'
                  ? inlineMessage
                  : (alForm && alForm.inlineMessage) || false
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
import { $alEmit, $alOn, $alOffAll } from '@mixins/emitter';
import AsyncValidator from 'async-validator';

import objectAssign from '@utils/merge';

import { noop, getPropByPath } from '@utils/util';

import LabelWrap from './label-wrap';
import { defineComponent, inject, ref, provide } from 'vue';

function initInject() {
  let alForm = inject('alForm');
  return {
    alForm
  };
}

function initMitt() {
  const alTimeSelectFieldResetSymbol = Symbol('alTimeSelect-fieldResetSymbol');
  const alFormItemFormChangeSymbol = Symbol('alFormItem-formChangeSymbol');
  const alFormItemFormBlurSymbol = Symbol('alFormItem-formBlurSymbol');

  provide('alTimeSelect-fieldResetSymbol', alTimeSelectFieldResetSymbol);
  provide('alFormItem-formChangeSymbol', alFormItemFormChangeSymbol);
  provide('alFormItem-formBlurSymbol', alFormItemFormBlurSymbol);

  const alFormAddFieldSymbol = inject('alFrom-addFieldSymbol', Symbol());
  const alFormRemoveFieldSymbol = inject('alFrom-removeFieldSymbol', Symbol());

  return {
    alTimeSelectFieldResetSymbol,
    alFormItemFormChangeSymbol,
    alFormItemFormBlurSymbol,
    alFormAddFieldSymbol,
    alFormRemoveFieldSymbol
  };
}

function initData() {
  let validateState = ref('');
  let validateMessage = ref('');
  let validateDisabled = ref(false);
  let validator = ref({});
  let isNested = ref(false);
  let computedLabelWidth = ref('');
  return {
    validateState,
    validateMessage,
    validateDisabled,
    validator,
    isNested,
    computedLabelWidth
  };
}

const AlFormItem = defineComponent({
  name: 'AlFormItem',

  componentName: 'AlFormItem',

  emits: {
    validate: null
  },

  provide() {
    return {
      alFormItem: this
    };
  },

  props: {
    /**
     * 标签文本
     */
    label: String,
    /**
     * 表单域标签的的宽度，例如 '50px'。支持 auto。
     */
    labelWidth: String,
    /**
     * 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 是否必填，如不设置，则会根据校验规则自动生成
     */
    required: {
      type: Boolean,
      default: undefined
    },
    /**
     * 表单验证规则
     */
    rules: [Object, Array],
    /**
     * 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
     */
    error: String,
    validateStatus: String,
    for: String,
    /**
     * 以行内形式展示校验信息
     */
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    /**
     * 是否显示校验错误信息
     */
    showMessage: {
      type: Boolean,
      default: true
    },
    /**
     * 用于控制该表单域下组件的尺寸
     */
    size: String
  },

  setup() {
    return {
      ...initInject(),
      ...initData(),
      ...initMitt()
    };
  },

  components: {
    // use this component to calculate auto width
    LabelWrap
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      }
    },
    validateStatus(value) {
      this.validateState = value;
    }
  },
  computed: {
    labelFor() {
      return this.for || this.prop;
    },
    labelStyle() {
      const ret = {};
      if (this.form.labelPosition === 'top') return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      if (this.form.labelPosition === 'top' || this.form.inline) return ret;
      if (!label && !this.labelWidth && this.isNested) return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.form.labelWidth === 'auto') {
          ret.marginLeft = this.alForm.autoLabelWidth;
        }
      } else {
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    form() {
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      while (parentName !== 'AlForm') {
        if (parentName === 'AlFormItem') {
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    },
    fieldValue() {
      const model = this.form.model;
      if (!model || !this.prop) {
        return;
      }

      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      let rules = this.getRules();
      let isRequired = false;

      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    },
    _formSize() {
      return this.alForm.size;
    },
    alFormItemSize() {
      return this.size || this._formSize;
    },
    sizeClass() {
      return this.alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }

      this.validateState = 'validating';

      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;

      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';

        callback(this.validateMessage, invalidFields);
        this.alForm &&
          this.alForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
      });
    },
    clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = '';
      this.validateMessage = '';

      let model = this.form.model;
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }

      let prop = getPropByPath(model, path, true);

      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }

      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false;
      });

      // TODO: this.broadcast('AlTimeSelect', 'fieldReset', this.initialValue);
      $alEmit(this.alTimeSelectFieldResetSymbol, this.initialValue);
    },
    getRules() {
      let formRules = this.form.rules;
      const selfRules = this.rules;
      const requiredRule = this.required !== undefined ? { required: !!this.required } : [];

      const prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : [];

      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map((rule) => objectAssign({}, rule));
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }

      this.validate('change');
    },
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
    addValidateEvents() {
      const rules = this.getRules();

      if (rules.length || this.required !== undefined) {
        // TODO: this.$on('el.form.blur', this.onFieldBlur);
        // TODO: this.$on('el.form.change', this.onFieldChange);
        $alOn(this.alFormItemFormBlurSymbol, this.onFieldBlur);
        $alOn(this.alFormItemFormChangeSymbol, this.onFieldChange);
      }
    },
    removeValidateEvents() {
      // TODO: this.$off();
      $alOffAll();
    }
  },
  mounted() {
    if (this.prop) {
      // TODO: this.dispatch('AlForm', 'el.form.addField', [this]);
      $alEmit(this.alFormAddFieldSymbol, this);
      let initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      });

      this.addValidateEvents();
    }
  },
  beforeDestroy() {
    // TODO: this.dispatch('AlForm', 'el.form.removeField', [this]);
    $alEmit(this.alFormRemoveFieldSymbol, this);
  }
});

export default AlFormItem;
</script>
