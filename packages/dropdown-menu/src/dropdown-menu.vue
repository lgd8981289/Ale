<template>
  <transition name="al-zoom-in-top" @after-leave="doDestroy">
    <ul
      class="al-dropdown-menu al-popper"
      :class="[size && `al-dropdown-menu--${size}`]"
      v-show="showPopper"
    >
      <slot></slot>
    </ul>
  </transition>
</template>
<script>
import Popper from '@utils/vue-popper';
import { $alOn } from '@mixins/emitter';
import { inject } from 'vue';

function initMitt() {
  const alDropdownMenuVisibleSymbol = inject('alDropdownMenu-visibleSymbol', Symbol());
  const alDropdownMenuUpdatePopperSymbol = inject('alDropdownMenu-updatePopperSymbol', Symbol());
  return {
    alDropdownMenuVisibleSymbol,
    alDropdownMenuUpdatePopperSymbol
  };
}

export default {
  name: 'AlDropdownMenu',

  componentName: 'AlDropdownMenu',

  mixins: [Popper],

  props: {
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    }
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  data() {
    return {
      size: this.dropdown.dropdownSize
    };
  },

  inject: ['dropdown'],

  created() {
    $alOn(this.alDropdownMenuUpdatePopperSymbol, (e) => {
      if (this.showPopper) this.updatePopper();
    });

    $alOn(this.alDropdownMenuVisibleSymbol, (e) => {
      this.showPopper = e;
    });
  },

  mounted() {
    this.dropdown.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.dropdown.$el;
    // compatible with 2.6 new v-slot syntax
    // issue link https://github.com/ElemeFE/element/issues/14345
    this.dropdown.initDomOperation();
  },

  watch: {
    'dropdown.placement': {
      immediate: true,
      handler(val) {
        this.currentPlacement = val;
      }
    }
  }
};
</script>
