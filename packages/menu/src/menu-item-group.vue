<template>
  <li class="al-menu-item-group">
    <div class="al-menu-item-group__title" :style="{ paddingLeft: levelPadding + 'px' }">
      <template v-if="!$slots.title">{{ title }}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
import { inject } from 'vue';

function initInject() {
  const rootMenu = inject('rootMenu');
  return {
    rootMenu
  };
}

export default {
  name: 'AlMenuItemGroup',

  componentName: 'AlMenuItemGroup',

  props: {
    title: {
      type: String
    }
  },
  setup() {
    return {
      ...initInject()
    };
  },
  data() {
    return {
      paddingLeft: 20
    };
  },
  computed: {
    levelPadding() {
      let padding = 20;
      let parent = this.$parent;
      if (this.rootMenu.collapse) return 20;
      while (parent && parent.$options.componentName !== 'AlMenu') {
        if (parent.$options.componentName === 'AlSubmenu') {
          padding += 20;
        }
        parent = parent.$parent;
      }
      return padding;
    }
  }
};
</script>
