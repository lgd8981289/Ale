<template>
  <div
    class="al-select-dropdown al-popper"
    :class="[{ 'is-multiple': parentSelect.multiple }, popperClass]"
    :style="{ minWidth: minWidth }"
  >
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import Popper from '@utils/vue-popper';
import { $alOn } from '@mixins/emitter';
import { defineComponent, inject, watch } from 'vue';

function initInject() {
  const parentSelect = inject('select');
  const alSelectDropdownDestroyPopperSymbol = inject('alSelectDropdown-destroyPopper', Symbol());
  const alSelectDropdownUpdatePopperSymbol = inject('alSelectDropdown-updatePopper', Symbol());
  return {
    parentSelect,
    alSelectDropdownDestroyPopperSymbol,
    alSelectDropdownUpdatePopperSymbol
  };
}

const AlSelectDropdown = defineComponent({
  name: 'AlSelectDropdown',

  componentName: 'AlSelectDropdown',

  mixins: [Popper],

  props: {
    placement: {
      default: 'bottom-start'
    },

    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },

    visibleArrow: {
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      minWidth: ''
    };
  },

  setup() {
    return {
      ...initInject()
    };
  },

  computed: {
    popperClass() {
      return this.parentSelect.popperClass;
    }
  },

  mounted() {
    watch(
      () => this.parentSelect.inputWidth,
      (val, oldVal) => {
        this.minWidth = this.parentSelect.$el.getBoundingClientRect().width + 'px';
      }
    );

    this.referenceElm = this.parentSelect.$refs.reference.$el;
    this.parentSelect.popperElm = this.popperElm = this.$el;
    // TODO：事件中心修改
    // this.$on('updatePopper', () => {
    //     if (this.$parent.visible) this.updatePopper();
    //   });
    //   this.$on('destroyPopper', this.destroyPopper);
    $alOn(this.alSelectDropdownUpdatePopperSymbol, (visible) => {
      if (visible) this.updatePopper();
    });
    $alOn(this.alSelectDropdownDestroyPopperSymbol, this.destroyPopper);
  }
});

export default AlSelectDropdown;
</script>
