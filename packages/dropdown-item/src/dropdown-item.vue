<template>
  <li
    class="al-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'al-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script>
import { $alEmit } from '@mixins/emitter';
import { inject } from 'vue';

function initMitt() {
  const alDropdownMenuItemClickSymbol = inject('alDropdown-menuItemClickSymbol', Symbol());
  return {
    alDropdownMenuItemClickSymbol
  };
}

export default {
  name: 'AlDropdownItem',

  props: {
    command: {},
    disabled: Boolean,
    divided: Boolean,
    icon: String
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  methods: {
    handleClick(e) {
      // this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);
      $alEmit(this.alDropdownMenuItemClickSymbol, {
        command: this.command,
        instance: this
      });
    }
  }
};
</script>
