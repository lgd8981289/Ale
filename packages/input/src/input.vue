<template>
  <div
    :class="[
      type === 'textarea' ? 'al-textarea' : 'al-input',
      inputSize ? 'al-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'al-input-group': $slots.prepend || $slots.append,
        'al-input-group--append': $slots.append,
        'al-input-group--prepend': $slots.prepend,
        'al-input--prefix': $slots.prefix || prefixIcon,
        'al-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="al-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="al-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      />
      <!-- 前置内容 -->
      <span class="al-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="al-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>
      <!-- 后置内容 -->
      <span class="al-input__suffix" v-if="getSuffixVisible()">
        <span class="al-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="al-input__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
          </template>
          <i
            v-if="showClear"
            class="al-input__icon al-icon-circle-close al-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="al-input__icon al-icon-view al-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="al-input__count">
            <span class="al-input__count-inner"> {{ textLength }}/{{ upperLimit }} </span>
          </span>
        </span>
        <i
          class="al-input__icon"
          v-if="validateState"
          :class="['al-input__validateIcon', validateIcon]"
        >
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="al-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="al-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="al-input__count"
      >{{ textLength }}/{{ upperLimit }}</span
    >
  </div>
</template>

<script>
import { $alEmit, $alOn } from '@mixins/emitter';
import merge from '@utils/merge';
import { isKorean } from '@utils/shared';
import Migrating from '@mixins/migrating';
import { getInject } from '@form/formInject';
import calcTextareaHeight from './calcTextareaHeight';
import { defineComponent, ref, nextTick, inject } from 'vue';

function initData() {
  let textareaCalcStyle = ref({});
  let hovering = ref(false);
  let focused = ref(false);
  let isComposing = ref(false);
  let passwordVisible = ref(false);
  return { textareaCalcStyle, hovering, focused, isComposing, passwordVisible };
}

function initMitt() {
  const alInputSelectSymbol = Symbol('alInput-inputSelect');
  return {
    alInputSelectSymbol
  };
}

function initInject() {
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  let alFormItemFormBlurSymbol = inject('alFormItem-formBlurSymbol', Symbol());
  return {
    ...getInject(),
    alFormItemFormChangeSymbol,
    alFormItemFormBlurSymbol
  };
}

function initMethods() {
  function focus() {
    this.getInput().focus();
  }

  function blur() {
    this.getInput().blur();
  }

  function getMigratingConfig() {
    return {
      props: {
        icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
        'on-icon-click': 'on-icon-click is removed.'
      },
      events: {
        click: 'click is removed.'
      }
    };
  }

  function handleBlur(event) {
    this.focused = false;
    this.$emit('blur', event);
    if (this.validateEvent) {
      // this.dispatch('AlFormItem', 'al.form.blur', [this.modelValue]);
      $alEmit(this.alFormItemFormBlurSymbol, this.modelValue);
    }
  }

  function select() {
    this.getInput().select();
  }

  function resizeTextarea() {
    if (this.$isServer) return;
    const { autosize, type } = this;
    if (type !== 'textarea') return;
    if (!autosize) {
      this.textareaCalcStyle = {
        minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
      };
      return;
    }
    const minRows = autosize.minRows;
    const maxRows = autosize.maxRows;

    this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
  }

  function setNativeInputValue() {
    const input = this.getInput();
    if (!input) return;
    if (input.value === this.nativeInputValue) return;
    input.value = this.nativeInputValue;
  }

  function handleFocus(event) {
    this.focused = true;
    this.$emit('focus', event);
  }

  function handleCompositionStart() {
    this.isComposing = true;
  }

  function handleCompositionUpdate(event) {
    const text = event.target.value;
    const lastCharacter = text[text.length - 1] || '';
    this.isComposing = !isKorean(lastCharacter);
  }

  function handleCompositionEnd(event) {
    if (this.isComposing) {
      this.isComposing = false;
      this.handleInput(event);
    }
  }

  function handleInput(event) {
    // should not emit input during composition
    if (this.isComposing) return;
    // should remove the following line when we don't support IE
    if (event.target.value === this.nativeInputValue) return;
    if (this.$attrs.modelModifiers && this.$attrs.modelModifiers.number) {
      const numberValue = parseInt(event.target.value, 10);
      this.$emit('update:modelValue', numberValue ? numberValue : event.target.value);
      this.$emit('input', numberValue ? numberValue : event.target.value);
    } else {
      this.$emit('update:modelValue', event.target.value);
      this.$emit('input', event.target.value);
    }
    // ensure native input value is controlled
    nextTick().then(() => {
      this.setNativeInputValue();
    });
  }

  function handleChange(event) {
    this.$emit('change', event.target.value);
  }

  function calcIconOffset(place) {
    let elList = [].slice.call(this.$el.querySelectorAll(`.al-input__${place}`) || []);
    if (!elList.length) return;
    let el = null;
    for (let i = 0; i < elList.length; i++) {
      if (elList[i].parentNode === this.$el) {
        el = elList[i];
        break;
      }
    }
    if (!el) return;
    const pendantMap = {
      suffix: 'append',
      prefix: 'prepend'
    };

    const pendant = pendantMap[place];
    if (this.$slots[pendant]) {
      el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
        this.$el.querySelector(`.al-input-group__${pendant}`).offsetWidth
      }px)`;
    } else {
      el.removeAttribute('style');
    }
  }

  function updateIconOffset() {
    this.calcIconOffset('prefix');
    this.calcIconOffset('suffix');
  }

  function clear() {
    this.$emit('update:modelValue', '');
    this.$emit('input', '');
    this.$emit('change', '');
    this.$emit('clear');
  }
  function handlePasswordVisible() {
    this.passwordVisible = !this.passwordVisible;
    this.focus();
  }
  function getInput() {
    return this.$refs.input || this.$refs.textarea;
  }
  function getSuffixVisible() {
    return (
      this.$slots.suffix ||
      this.suffixIcon ||
      this.showClear ||
      this.showPassword ||
      this.isWordLimitVisible ||
      (this.validateState && this.needStatusIcon)
    );
  }

  return {
    focus,
    blur,
    getMigratingConfig,
    handleBlur,
    select,
    resizeTextarea,
    setNativeInputValue,
    handleFocus,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
    handleInput,
    handleChange,
    calcIconOffset,
    updateIconOffset,
    clear,
    handlePasswordVisible,
    getInput,
    getSuffixVisible
  };
}

const AlInput = defineComponent({
  name: 'AlInput',

  componentName: 'AlInput',

  mixins: [Migrating],

  emits: {
    'update:modelValue': null,
    input: null,
    change: null,
    clear: null,
    blur: null,
    focus: null
  },

  props: {
    /**
     * 绑定值
     */
    modelValue: [Number, String, Boolean],
    /**
     * 输入框尺寸，只在 type!="textarea" 时有效
     */
    size: String,
    /**
     * 控制是否能被用户缩放
     */
    resize: String,
    /**
     * 	原生属性
     */
    form: String,
    /**
     * 禁用
     */
    disabled: Boolean,
    /**
     * 原生属性，是否只读
     */
    readonly: Boolean,
    /**
     * 类型
     * text，textarea 和其他 原生 input 的 type 值
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }
     */
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    /**
     * 原生属性，自动补全
     */
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated */
    // autoComplete: {
    // },
    /**
     * 输入时是否触发表单的校验
     */
    validateEvent: {
      type: Boolean,
      default: true
    },
    /**
     * 输入框尾部图标
     */
    suffixIcon: String,
    /**
     * 输入框头部图标
     */
    prefixIcon: String,
    /**
     * 输入框关联的label文字
     */
    label: String,
    /**
     * 是否可清空
     */
    clearable: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示切换密码图标
     */
    showPassword: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
     */
    showWordLimit: {
      type: Boolean,
      default: false
    },
    /**
     * 输入框的tabindex
     */
    tabindex: String
  },

  setup(props, { attrs }) {
    return {
      ...initInject(),
      ...initData(),
      ...initMethods(),
      ...initMitt()
    };
  },
  created() {
    // TODO: mitt 代替 $on
    // this.emitter.on('inputSelect', this.select);
    $alOn(this.alInputSelectSymbol, this.select);
  },
  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();

    this.updateIconOffset();
  },

  updated() {
    nextTick().then(() => {
      this.updateIconOffset();
    });
  },
  computed: {
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },
    validateState() {
      return this.alFormItem ? this.alFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.alForm ? this.alForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'al-icon-loading',
        success: 'al-icon-circle-check',
        error: 'al-icon-circle-close'
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.alForm || {}).disabled;
    },
    nativeInputValue() {
      return this.modelValue === null || this.modelValue === undefined
        ? ''
        : String(this.modelValue);
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      );
    },
    showPwdVisible() {
      return (
        this.showPassword &&
        !this.inputDisabled &&
        !this.readonly &&
        (!!this.nativeInputValue || this.focused)
      );
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      );
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.modelValue === 'number') {
        return String(this.modelValue).length;
      }

      return (this.modelValue || '').length;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    }
  },

  watch: {
    modelValue(val) {
      nextTick().then(() => {
        this.resizeTextarea();
        if (this.validateEvent) {
          // TODO: this.dispatch('AlFormItem', 'el.form.change', [val]);
          $alEmit(this.alFormItemFormChangeSymbol, val);
        }
      });
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    type() {
      nextTick().then(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    }
  }
});

export default AlInput;
</script>
