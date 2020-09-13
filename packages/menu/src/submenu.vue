<script>
import AlCollapseTransition from '@transitions/collapse-transition';
import menuMixin from './menu-mixin';
import Popper from '@utils/vue-popper';
import { $alEmit, $alOn } from '@mixins/emitter';
import { nextTick, inject, h, Transition } from 'vue';
const poperMixins = {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: false
    },
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  data: Popper.data,
  methods: Popper.methods,
  beforeDestroy: Popper.beforeDestroy,
  deactivated: Popper.deactivated
};

function initMitt() {
  const alSubmenuClickSymbol = inject('alSubmenu-clickSymbol', Symbol());
  const alSubmenuToggleCollapseSymbol = inject('alSubmenu-toggleCollapseSymbol', Symbol());

  const alSubmenuMouseEnterChildSymbol = Symbol('alSubmenu-mouseEnterChildSymbol');
  const alSubmenuMouseLeaveChildSymbol = Symbol('alSubmenu-mouseLeaveChildSymbol');

  return {
    alSubmenuClickSymbol,
    alSubmenuToggleCollapseSymbol,
    alSubmenuMouseEnterChildSymbol,
    alSubmenuMouseLeaveChildSymbol
  };
}

export default {
  name: 'AlSubmenu',

  componentName: 'AlSubmenu',

  mixins: [menuMixin, poperMixins],

  components: { AlCollapseTransition },

  props: {
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperClass: String,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    }
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  data() {
    return {
      popperJS: null,
      timeout: null,
      items: {},
      submenus: {},
      mouseInChild: false
    };
  },
  watch: {
    opened(val) {
      if (this.isMenuPopup) {
        nextTick().then(() => {
          this.updatePopper();
        });
      }
    }
  },
  computed: {
    // popper option
    appendToBody() {
      return this.popperAppendToBody === undefined ? this.isFirstLevel : this.popperAppendToBody;
    },
    menuTransitionName() {
      return this.rootMenu.collapse ? 'al-zoom-in-left' : 'al-zoom-in-top';
    },
    opened() {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1;
    },
    active() {
      let isActive = false;
      const submenus = this.submenus;
      const items = this.items;

      Object.keys(items).forEach(index => {
        if (items[index].active) {
          isActive = true;
        }
      });

      Object.keys(submenus).forEach(index => {
        if (submenus[index].active) {
          isActive = true;
        }
      });

      return isActive;
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
    isMenuPopup() {
      return this.rootMenu.isMenuPopup;
    },
    titleStyle() {
      if (this.mode !== 'horizontal') {
        return {
          color: this.textColor
        };
      }
      return {
        borderBottomColor: this.active
          ? this.rootMenu.activeTextColor
            ? this.activeTextColor
            : ''
          : 'transparent',
        color: this.active ? this.activeTextColor : this.textColor
      };
    },
    isFirstLevel() {
      let isFirstLevel = true;
      let parent = this.$parent;
      while (parent && parent !== this.rootMenu) {
        if (['AlSubmenu', 'AlMenuItemGroup'].indexOf(parent.$options.componentName) > -1) {
          isFirstLevel = false;
          break;
        } else {
          parent = parent.$parent;
        }
      }
      return isFirstLevel;
    }
  },
  methods: {
    handleCollapseToggle(value) {
      if (value) {
        this.initPopper();
      } else {
        this.doDestroy();
      }
    },
    addItem(item) {
      // this.$set(this.items, item.index, item);
      this.items[item.index] = item;
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      // this.$set(this.submenus, item.index, item);
      this.submenus[item.index] = item;
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    handleClick() {
      const { rootMenu, disabled } = this;
      if (
        (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal') ||
        (rootMenu.collapse && rootMenu.mode === 'vertical') ||
        disabled
      ) {
        return;
      }
      // this.dispatch('AlMenu', 'submenu-click', this);
      $alEmit(this.alSubmenuClickSymbol, this);
    },
    handleMouseenter(event, showTimeout = this.showTimeout) {
      if (!('ActiveXObject' in window) && event.type === 'focus' && !event.relatedTarget) {
        return;
      }
      const { rootMenu, disabled } = this;
      if (
        (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal') ||
        (!rootMenu.collapse && rootMenu.mode === 'vertical') ||
        disabled
      ) {
        return;
      }
      // this.dispatch('AlSubmenu', 'mouse-enter-child');
      $alEmit(this.alSubmenuMouseEnterChildSymbol);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.rootMenu.openMenu(this.index, this.indexPath);
      }, showTimeout);

      if (this.appendToBody) {
        this.$parent.$el.dispatchEvent(new MouseEvent('mouseenter'));
      }
    },
    handleMouseleave(deepDispatch = false) {
      const { rootMenu } = this;
      if (
        (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal') ||
        (!rootMenu.collapse && rootMenu.mode === 'vertical')
      ) {
        return;
      }
      // this.dispatch('AlSubmenu', 'mouse-leave-child');
      $alEmit(this.alSubmenuMouseLeaveChildSymbol);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        !this.mouseInChild && this.rootMenu.closeMenu(this.index);
      }, this.hideTimeout);

      if (this.appendToBody && deepDispatch) {
        if (this.$parent.$options.name === 'AlSubmenu') {
          this.$parent.handleMouseleave(true);
        }
      }
    },
    handleTitleMouseenter() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      const title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.hoverBackground);
    },
    handleTitleMouseleave() {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
      const title = this.$refs['submenu-title'];
      title && (title.style.backgroundColor = this.rootMenu.backgroundColor || '');
    },
    updatePlacement() {
      this.currentPlacement =
        this.mode === 'horizontal' && this.isFirstLevel ? 'bottom-start' : 'right-start';
    },
    initPopper() {
      this.referenceElm = this.$el;
      this.popperElm = this.$refs.menu;
      this.updatePlacement();
    }
  },
  created() {
    $alOn(this.alSubmenuToggleCollapseSymbol, this.handleCollapseToggle);
    $alOn(this.alSubmenuMouseEnterChildSymbol, () => {
      this.mouseInChild = true;
      clearTimeout(this.timeout);
    });
    $alOn(this.alSubmenuMouseLeaveChildSymbol, () => {
      this.mouseInChild = false;
      clearTimeout(this.timeout);
    });
  },
  mounted() {
    this.parentMenu.addSubmenu(this);
    this.rootMenu.addSubmenu(this);
    this.initPopper();
  },
  beforeDestroy() {
    this.parentMenu.removeSubmenu(this);
    this.rootMenu.removeSubmenu(this);
  },
  render() {
    const {
      active,
      opened,
      paddingStyle,
      titleStyle,
      backgroundColor,
      rootMenu,
      currentPlacement,
      menuTransitionName,
      mode,
      disabled,
      popperClass,
      $slots,
      isFirstLevel
    } = this;

    const popupMenu = (
      <Transition name={menuTransitionName}>
        <div
          ref="menu"
          v-show={opened}
          class={[`al-menu--${mode}`, popperClass]}
          on-mouseenter={$event => this.handleMouseenter($event, 100)}
          on-mouseleave={() => this.handleMouseleave(true)}
          on-focus={$event => this.handleMouseenter($event, 100)}
        >
          <ul
            role="menu"
            class={['al-menu al-menu--popup', `al-menu--popup-${currentPlacement}`]}
            style={{ backgroundColor: rootMenu.backgroundColor || '' }}
          >
            {$slots.default}
          </ul>
        </div>
      </Transition>
    );

    const inlineMenu = (
      <al-collapse-transition>
        <ul
          role="menu"
          class="al-menu al-menu--inline"
          v-show={opened}
          style={{ backgroundColor: rootMenu.backgroundColor || '' }}
        >
          {$slots.default}
        </ul>
      </al-collapse-transition>
    );

    const submenuTitleIcon =
      (rootMenu.mode === 'horizontal' && isFirstLevel) ||
      (rootMenu.mode === 'vertical' && !rootMenu.collapse)
        ? 'al-icon-arrow-down'
        : 'al-icon-arrow-right';

    return (
      <li
        class={{
          'al-submenu': true,
          'is-active': active,
          'is-opened': opened,
          'is-disabled': disabled
        }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={opened}
        on-mouseenter={this.handleMouseenter}
        on-mouseleave={() => this.handleMouseleave(false)}
        on-focus={this.handleMouseenter}
      >
        <div
          class="al-submenu__title"
          ref="submenu-title"
          on-click={this.handleClick}
          on-mouseenter={this.handleTitleMouseenter}
          on-mouseleave={this.handleTitleMouseleave}
          style={[paddingStyle, titleStyle, { backgroundColor }]}
        >
          {$slots.title}
          <i class={['al-submenu__icon-arrow', submenuTitleIcon]}></i>
        </div>
        {this.isMenuPopup ? popupMenu : inlineMenu}
      </li>
    );
  }
};
</script>
