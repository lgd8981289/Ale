<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="al-select-dropdown__item"
    v-show="visible"
    :class="{
      selected: itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      hover: hover
    }"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script type="text/babel">
import { $alEmit, $alOn } from '@mixins/emitter';

import { getValueByPath, escapeRegexpString } from '@utils/util';
import { defineComponent, inject, ref } from 'vue';

function initInject() {
  const select = inject('select', '');
  const parentEmitter = inject('emitter', {});
  const alSelectSetSelectedSymbol = inject('alSelect-setSelected', Symbol());
  const alSelectHandleOptionClickSymbol = inject('alSelect-handleOptionClick', Symbol());
  const alOptionQueryChangeSymbol = inject('alOption-queryChange', Symbol());
  const alOptionGroupHandleGroupDisabled = inject('alOptionGroup-handleGroupDisabled', Symbol());
  return {
    select,
    parentEmitter,
    alSelectSetSelectedSymbol,
    alSelectHandleOptionClickSymbol,
    alOptionQueryChangeSymbol,
    alOptionGroupHandleGroupDisabled
  };
}

function initData() {
  let index = ref(-1);
  let groupDisabled = ref(false);
  let visible = ref(true);
  let hitState = ref(false);
  let hover = ref(false);

  return { index, groupDisabled, visible, hitState, hover };
}

const option = defineComponent({
  name: 'AlOption',

  componentName: 'AlOption',

  props: {
    /**
     * 	选项的值
     */
    value: {
      type: [String, Number, Object],
      required: true
    },
    /**
     * 选项的标签，若不设置则默认与 value 相同
     */
    label: [String, Number],
    created: Boolean,
    /**
     * 是否禁用该选项
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    return {
      ...initInject(),
      ...initData()
    };
  },

  computed: {
    isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
    },

    currentLabel() {
      return this.label || (this.isObject ? '' : this.value);
    },

    currentValue() {
      return this.value || this.label || '';
    },

    itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.modelValue);
      } else {
        return this.contains(this.select.modelValue, this.value);
      }
    },

    limitReached() {
      if (this.select.multiple) {
        return (
          !this.itemSelected &&
          (this.select.modelValue || []).length >= this.select.multipleLimit &&
          this.select.multipleLimit > 0
        );
      } else {
        return false;
      }
    }
  },

  watch: {
    currentLabel() {
      if (!this.created && !this.select.remote) {
        // TODO: this.dispatch(this.emitter, 'AlSelect', 'setSelected');
        $alEmit(this.alSelectSetSelectedSymbol);
      }
    },
    value(val, oldVal) {
      const { remote, valueKey } = this.select;
      if (!this.created && !remote) {
        if (
          valueKey &&
          typeof val === 'object' &&
          typeof oldVal === 'object' &&
          val[valueKey] === oldVal[valueKey]
        ) {
          return;
        }
        // TODO: this.dispatch(this.emitter, 'AlSelect', 'setSelected');
        $alEmit(this.alSelectSetSelectedSymbol);
      }
    }
  },

  methods: {
    isEqual(a, b) {
      if (!this.isObject) {
        return a === b;
      } else {
        const valueKey = this.select.valueKey;
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
      }
    },

    contains(arr = [], target) {
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1;
      } else {
        const valueKey = this.select.valueKey;
        return (
          arr &&
          arr.some((item) => {
            return getValueByPath(item, valueKey) === getValueByPath(target, valueKey);
          })
        );
      }
    },

    handleGroupDisabled(val) {
      this.groupDisabled = val;
    },

    hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.select.options.indexOf(this);
      }
    },

    selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        // TODO: this.dispatch(this.emitter, 'AlSelect', 'handleOptionClick', [this, true]);
        $alEmit(this.alSelectHandleOptionClickSymbol, this);
      }
    },

    queryChange(query) {
      this.visible =
        new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created;
      if (!this.visible) {
        this.select.filteredOptionsCount--;
      }
    }
  },

  created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;
    // TODO: broadcast 事件修正
    // this.$on('queryChange', this.queryChange);
    // this.$on('handleGroupDisabled', this.handleGroupDisabled);
    $alOn(this.alOptionGroupHandleGroupDisabled, (val) => {
      this.handleGroupDisabled(val);
    });
    $alOn(this.alOptionQueryChangeSymbol, this.queryChange);
  },

  beforeDestroy() {
    const { selected, multiple } = this.select;
    let selectedOptions = multiple ? selected : [selected];
    let index = this.select.cachedOptions.indexOf(this);
    let selectedIndex = selectedOptions.indexOf(this);

    // if option is not selected, remove it from cache
    if (index > -1 && selectedIndex < 0) {
      this.select.cachedOptions.splice(index, 1);
    }
    this.select.onOptionDestroy(this.select.options.indexOf(this));
  }
});

export default option;
</script>
