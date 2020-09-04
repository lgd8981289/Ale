<template>
  <ul class="al-select-group__wrap" v-show="visible">
    <li class="al-select-group__title">{{ label }}</li>
    <li>
      <ul class="al-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
import { $alEmit, $alOn } from '@mixins/emitter';
import { defineComponent, ref, provide, inject } from 'vue';

function initMitt() {
  const alOptionGroupHandleGroupDisabled = Symbol('alOptionGroup-handleGroupDisabled');
  provide('alOptionGroup-handleGroupDisabled', alOptionGroupHandleGroupDisabled);
  return {
    alOptionGroupHandleGroupDisabled
  };
}

function initInject() {
  const alOptionQueryChangeSymbol = inject('alOption-queryChange', Symbol());
  return {
    alOptionQueryChangeSymbol
  };
}

function initData() {
  let visible = ref(true);
  return { visible };
}

const AlOptionGroup = defineComponent({
  name: 'AlOptionGroup',

  componentName: 'AlOptionGroup',

  props: {
    /**
     * 分组的组名
     */
    label: String,
    /**
     * 是否将该分组下所有选项置为禁用
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    disabled(val) {
      // TODO: this.broadcast(this.emitter, 'AlOption', 'handleGroupDisabled', val);
      $alEmit(this.alOptionGroupHandleGroupDisabled, val);
    }
  },

  methods: {
    queryChange() {
      this.visible =
        this.$children &&
        Array.isArray(this.$children) &&
        this.$children.some((option) => option.visible === true);
    }
  },

  setup() {
    return {
      ...initMitt(),
      ...initInject(),
      ...initData()
    };
  },

  created() {
    $alOn(this.alOptionQueryChangeSymbol, this.queryChange);
  },

  mounted() {
    if (this.disabled) {
      $alEmit(this.alOptionGroupHandleGroupDisabled, this.disabled);
    }
  }
});

export default AlOptionGroup;
</script>
