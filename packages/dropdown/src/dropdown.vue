<script>
import Clickoutside from '@utils/clickoutside';
import { $alEmit, $alOn } from '@mixins/emitter';
import Migrating from '@mixins/migrating';
import ElButton from '@components/button';
import ElButtonGroup from '@components/button-group';
import { generateId } from '@utils/util';
import { provide } from 'vue';

function initMitt() {
  const alDropdownMenuItemClickSymbol = Symbol('alDropdown-menuItemClickSymbol');
  const alDropdownMenuVisibleSymbol = Symbol('alDropdownMenu-visibleSymbol');

  provide('alDropdown-menuItemClickSymbol', alDropdownMenuItemClickSymbol);
  provide('alDropdownMenu-visibleSymbol', alDropdownMenuVisibleSymbol);

  return {
    alDropdownMenuItemClickSymbol,
    alDropdownMenuVisibleSymbol
  };
}

export default {
  name: 'AlDropdown',

  componentName: 'AlDropdown',

  mixins: [Migrating],

  emits: {
    'visible-change': null,
    click: null,
    command: null
  },

  directives: { Clickoutside },

  components: {
    ElButton,
    ElButtonGroup
  },

  provide() {
    return {
      dropdown: this
    };
  },

  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    type: String,
    size: {
      type: String,
      default: ''
    },
    splitButton: Boolean,
    hideOnClick: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom-end'
    },
    visibleArrow: {
      default: true
    },
    showTimeout: {
      type: Number,
      default: 250
    },
    hideTimeout: {
      type: Number,
      default: 150
    },
    tabindex: {
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
      timeout: null,
      visible: false,
      triggerElm: null,
      menuItems: null,
      menuItemsArray: null,
      dropdownElm: null,
      focusing: false,
      listId: `dropdown-menu-${generateId()}`
    };
  },

  computed: {
    dropdownSize() {
      return this.size || (window.Ale.$ELEMENT || {}).size;
    }
  },

  mounted() {
    // TODO: this.$on('menu-item-click', this.handleMenuItemClick);
    $alOn(this.alDropdownMenuItemClickSymbol, this.handleMenuItemClick);
  },

  watch: {
    visible(val) {
      // TODO: this.broadcast('ElDropdownMenu', 'visible', val);
      $alEmit(this.alDropdownMenuVisibleSymbol, val);
      this.$emit('visible-change', val);
    },
    focusing(val) {
      const selfDefine = this.$el.querySelector('.al-dropdown-selfdefine');
      if (selfDefine) {
        // 自定义
        if (val) {
          selfDefine.className += ' focusing';
        } else {
          selfDefine.className = selfDefine.className.replace('focusing', '');
        }
      }
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'menu-align': 'menu-align is renamed to placement.'
        }
      };
    },
    show() {
      if (this.triggerElm.disabled) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.visible = true;
        },
        this.trigger === 'click' ? 0 : this.showTimeout
      );
    },
    hide() {
      if (this.triggerElm.disabled) return;
      this.removeTabindex();
      if (this.tabindex >= 0) {
        this.resetTabindex(this.triggerElm);
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.visible = false;
        },
        this.trigger === 'click' ? 0 : this.hideTimeout
      );
    },
    handleClick() {
      if (this.triggerElm.disabled) return;
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    handleTriggerKeyDown(ev) {
      const keyCode = ev.keyCode;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up/down
        this.removeTabindex();
        this.resetTabindex(this.menuItems[0]);
        this.menuItems[0].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) {
        // space enter选中
        this.handleClick();
      } else if ([9, 27].indexOf(keyCode) > -1) {
        // tab || esc
        this.hide();
      }
    },
    handleItemKeyDown(ev) {
      const keyCode = ev.keyCode;
      const target = ev.target;
      const currentIndex = this.menuItemsArray.indexOf(target);
      const max = this.menuItemsArray.length - 1;
      let nextIndex;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up/down
        if (keyCode === 38) {
          // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        } else {
          // down
          nextIndex = currentIndex < max ? currentIndex + 1 : max;
        }
        this.removeTabindex();
        this.resetTabindex(this.menuItems[nextIndex]);
        this.menuItems[nextIndex].focus();
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) {
        // enter选中
        this.triggerElmFocus();
        target.click();
        if (this.hideOnClick) {
          // click关闭
          this.visible = false;
        }
      } else if ([9, 27].indexOf(keyCode) > -1) {
        // tab // esc
        this.hide();
        this.triggerElmFocus();
      }
    },
    resetTabindex(ele) {
      // 下次tab时组件聚焦元素
      this.removeTabindex();
      ele.setAttribute('tabindex', '0'); // 下次期望的聚焦元素
    },
    removeTabindex() {
      this.triggerElm.setAttribute('tabindex', '-1');
      this.menuItemsArray.forEach((item) => {
        item.setAttribute('tabindex', '-1');
      });
    },
    initAria() {
      this.dropdownElm.setAttribute('id', this.listId);
      this.triggerElm.setAttribute('aria-haspopup', 'list');
      this.triggerElm.setAttribute('aria-controls', this.listId);

      if (!this.splitButton) {
        // 自定义
        this.triggerElm.setAttribute('role', 'button');
        this.triggerElm.setAttribute('tabindex', this.tabindex);
        this.triggerElm.setAttribute(
          'class',
          (this.triggerElm.getAttribute('class') || '') + ' al-dropdown-selfdefine'
        ); // 控制
      }
    },
    initEvent() {
      let {
        trigger,
        show,
        hide,
        handleClick,
        splitButton,
        handleTriggerKeyDown,
        handleItemKeyDown
      } = this;

      this.triggerElm = splitButton
        ? this.$refs.trigger.$el
        : document.getElementById('version-span');

      let dropdownElm = this.dropdownElm;

      this.triggerElm.addEventListener('keydown', handleTriggerKeyDown); // triggerElm keydown
      dropdownElm.addEventListener('keydown', handleItemKeyDown, true); // item keydown
      // 控制自定义元素的样式
      if (!splitButton) {
        this.triggerElm.addEventListener('focus', () => {
          this.focusing = true;
        });
        this.triggerElm.addEventListener('blur', () => {
          this.focusing = false;
        });
        this.triggerElm.addEventListener('click', () => {
          this.focusing = false;
        });
      }
      if (trigger === 'hover') {
        this.triggerElm.addEventListener('mouseenter', show);
        this.triggerElm.addEventListener('mouseleave', hide);
        dropdownElm.addEventListener('mouseenter', show);
        dropdownElm.addEventListener('mouseleave', hide);
      } else if (trigger === 'click') {
        this.triggerElm.addEventListener('click', handleClick);
      }
    },
    handleMenuItemClick(command, instance) {
      if (this.hideOnClick) {
        this.visible = false;
      }
      this.$emit('command', command, instance);
    },
    triggerElmFocus() {
      this.triggerElm.focus && this.triggerElm.focus();
    },
    initDomOperation() {
      this.dropdownElm = this.popperElm;
      this.menuItems = this.dropdownElm.querySelectorAll("[tabindex='-1']");
      this.menuItemsArray = [].slice.call(this.menuItems);

      this.initEvent();
      this.initAria();
    }
  },

  render() {
    let { hide, splitButton, type, dropdownSize } = this;

    const handleMainButtonClick = (event) => {
      this.$emit('click', event);
      hide();
    };

    let triggerElm = !splitButton ? (
      this.$slots.default()
    ) : (
      <al-button-group>
        <al-button type={type} size={dropdownSize} nativeOn-click={handleMainButtonClick}>
          {this.$slots.default}
        </al-button>
        <al-button ref="trigger" type={type} size={dropdownSize} class="al-dropdown__caret-button">
          <i class="al-dropdown__icon al-icon-arrow-down"></i>
        </al-button>
      </al-button-group>
    );

    return (
      <div class="al-dropdown" v-clickoutside={hide}>
        {triggerElm}
        {this.$slots.dropdown}
      </div>
    );
  }
};
</script>
