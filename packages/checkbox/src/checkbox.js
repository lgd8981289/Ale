import { ref } from 'vue';
// @ts-ignore
import { $alEmit } from '@mixins/emitter';

/**
 * 初始化方法
 * 用于  checkbox & checkbox
 */
export function initMethods() {
  function addToStore() {
    if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
      this.model.push(this.label);
    } else {
      this.model = this.trueLabel || true;
    }
  }

  function handleChange(ev) {
    if (this.isLimitExceeded) return;
    let value;
    if (ev.target.checked) {
      value = this.trueLabel === undefined ? true : this.trueLabel;
    } else {
      value = this.falseLabel === undefined ? false : this.falseLabel;
    }
    this.$emit('change', value, ev);
    setTimeout(() => {
      if (this.isGroup) {
        // TODO: this.dispatch('AlCheckboxGroup', 'change', [this.parentData.modelValue]);
        $alEmit(this.alCheckboxGroupChangeSymbol, this.parentData.modelValue);
      }
    }, 0);
  }

  return {
    addToStore,
    handleChange
  };
}

export function initData() {
  let selfModel = ref(false);
  let focus = ref(false);
  let isLimitExceeded = ref(false);
  return {
    selfModel,
    focus,
    isLimitExceeded
  };
}
