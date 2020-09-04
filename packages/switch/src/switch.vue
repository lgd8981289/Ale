<template>
  <div
    class="al-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      class="al-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <span
      :class="['al-switch__label', 'al-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText"
    >
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{
        inactiveText
      }}</span>
    </span>
    <span class="al-switch__core" ref="core" :style="{ width: coreWidth + 'px' }"> </span>
    <span
      :class="['al-switch__label', 'al-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText"
    >
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
import { $alEmit } from '@mixins/emitter';
import Focus from '@mixins/focus';
import Migrating from '@mixins/migrating';
import { getInject } from '@form/formInject';

import { defineComponent, ref, inject } from 'vue';

function initInject() {
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    ...getInject(),
    alFormItemFormChangeSymbol
  };
}

const AlSwitch = defineComponent({
  name: 'AlSwitch',
  mixins: [Focus('input'), Migrating],
  emits: {
    'update:modelValue': null,
    change: null
  },
  props: {
    /**
     * 	绑定值
     */
    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * switch 的宽度（像素）
     */
    width: {
      type: Number,
      default: 40
    },
    /**
     * switch 打开时所显示图标的类名，设置此项会忽略 active-text
     */
    activeIconClass: {
      type: String,
      default: ''
    },
    /**
     * switch 关闭时所显示图标的类名，设置此项会忽略 inactive-text
     */
    inactiveIconClass: {
      type: String,
      default: ''
    },
    /**
     * switch 打开时的文字描述
     */
    activeText: String,
    /**
     * switch 关闭时的文字描述
     */
    inactiveText: String,
    /**
     * switch 打开时的背景色
     */
    activeColor: {
      type: String,
      default: ''
    },
    /**
     * switch 关闭时的背景色
     */
    inactiveColor: {
      type: String,
      default: ''
    },
    /**
     * switch 打开时的值
     * TODO: true-value && false-value 已取消，待添加
     */
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    /**
     * switch 关闭时的值
     */
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    /**
     * switch 对应的 name 属性
     */
    name: {
      type: String,
      default: ''
    },
    /**
     * 	改变 switch 状态时是否触发表单的校验
     */
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String
  },
  setup(props) {
    return {
      ...initInject(),
      coreWidth: ref(props.width)
    };
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.modelValue)) {
      this.$emit('update:modelValue', this.inactiveValue);
    }
  },
  computed: {
    checked() {
      return this.modelValue === this.activeValue;
    },
    switchDisabled() {
      return this.disabled || (this.alForm || {}).disabled;
    }
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
      if (this.validateEvent) {
        // TODO: this.dispatch('AlFormItem', 'el.form.change', [this.value]);
        $alEmit(this.alFormItemFormChangeSymbol, this.modelValue);
      }
    }
  },
  methods: {
    handleChange(event) {
      const val = this.checked ? this.inactiveValue : this.activeValue;
      this.$emit('update:modelValue', val);
      this.$emit('change', val);
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked;
      });
    },
    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig() {
      return {
        props: {
          'on-color': 'on-color is renamed to active-color.',
          'off-color': 'off-color is renamed to inactive-color.',
          'on-text': 'on-text is renamed to active-text.',
          'off-text': 'off-text is renamed to inactive-text.',
          'on-value': 'on-value is renamed to active-value.',
          'off-value': 'off-value is renamed to inactive-value.',
          'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
          'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
        }
      };
    }
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
  }
});

export default AlSwitch;
</script>
