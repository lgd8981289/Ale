<template>
  <li
    class="al-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, itemStyle, { backgroundColor }]"
    :class="{
      'is-active': active,
      'is-disabled': disabled
    }"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <al-tooltip
      v-if="parentMenu.$options.componentName === 'ElMenu' && rootMenu.collapse && $slots.title"
      effect="dark"
      placement="right"
    >
      <div slot="content"><slot name="title"></slot></div>
      <div
        style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;"
      >
        <slot></slot>
      </div>
    </al-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
import Menu from './menu-mixin';
import AlTooltip from '@components/tooltip';
import { $alEmit } from '@mixins/emitter';
import { inject, h } from 'vue';

function initMitt() {
  const alMenuItemClickSymbol = inject('alMenuItem-clickSymbol', Symbol());
  return { alMenuItemClickSymbol };
}

export default {
  name: 'AlMenuItem',

  componentName: 'AlMenuItem',

  mixins: [Menu],

  components: { AlTooltip },

  emits: {
    click: null
  },

  props: {
    index: {
      default: null,
      validator: val => typeof val === 'string' || val === null
    },
    route: [String, Object],
    disabled: Boolean
  },
  setup() {
    return {
      ...initMitt()
    };
  },
  render() {
    return h('div', {}, [h('h3', {}, this.$parent.$options.name), 'al-menu-item']);
  },
  computed: {
    active() {
      return this.index === this.rootMenu.activeIndex;
    },
    hoverBackground() {
      return this.rootMenu.hoverBackground;
    },
    backgroundColor() {
      return this.rootMenu.backgroundColor || '';
    },
    activeTextColor() {
      return this.rootMenu.activeTextColor || '';
    },
    textColor() {
      return this.rootMenu.textColor || '';
    },
    mode() {
      return this.rootMenu.mode;
    },
    itemStyle() {
      const style = {
        color: this.active ? this.activeTextColor : this.textColor
      };
      if (this.mode === 'horizontal' && !this.isNested) {
        style.borderBottomColor = this.active
          ? this.rootMenu.activeTextColor
            ? this.activeTextColor
            : ''
          : 'transparent';
      }
      return style;
    },
    isNested() {
      return this.parentMenu !== this.rootMenu;
    }
  },
  methods: {
    onMouseEnter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.hoverBackground;
    },
    onMouseLeave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      this.$el.style.backgroundColor = this.backgroundColor;
    },
    handleClick() {
      if (!this.disabled) {
        // this.dispatch('AlMenu', 'item-click', this);
        $alEmit(this.alMenuItemClickSymbol, this);
        this.$emit('click', this);
      }
    }
  },
  mounted() {
    console.log(this.$parent.$options.name);
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeDestroy() {
    this.parentMenu.removeItem(this);
    this.rootMenu.removeItem(this);
  }
};
</script>
