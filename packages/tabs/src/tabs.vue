<script>
import TabNav from './tab-nav';
import { $alOn, $alEmit } from '@mixins/emitter.js';
import { provide } from 'vue';

function initMitt() {
  const alTabNavUpdateSymbol = Symbol('alTabNav-updateSymbol');
  const alTabNavTabClickSymbol = Symbol('alTabNav-tabclickSymbol');
  provide('alTabNav-updateSymbol', alTabNavUpdateSymbol);
  provide('alTabNav-tabclickSymbol', alTabNavTabClickSymbol);
  return {
    alTabNavUpdateSymbol,
    alTabNavTabClickSymbol
  };
}

export default {
  name: 'AlTabs',

  components: {
    TabNav
  },

  emits: {
    'tab-click': null,
    edit: null,
    'tab-remove': null,
    'tab-add': null,
    'update:modelValue': null
  },

  props: {
    modelValue: {},
    type: String,
    activeName: String,
    closable: Boolean,
    addable: Boolean,
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  provide() {
    return {
      rootTabs: this
    };
  },

  data() {
    return {
      currentName: this.modelValue || this.activeName,
      panes: []
    };
  },

  watch: {
    tabPosition() {
      $alEmit(this.alTabNavTabClickSymbol, this.currentName);
    },
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    currentName(value) {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          this.$refs.nav.$nextTick(_ => {
            this.$refs.nav.scrollToActiveTab();
          });
        });
      }
    }
  },

  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default().filter(vnode => {
          if (vnode.__v_isVNode && vnode.type && vnode.type.name === 'AlTabPane') {
            return vnode;
          }
        });
        // update indeed
        const panes = paneSlots.map(item => item);
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => {
            return pane.type.__hmrId === this.panes[index].type.__hmrId;
          })
        );
        if (isForceUpdate || panesChanged) {
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit('tab-click', tab, event);
      $alEmit(this.alTabNavTabClickSymbol, tabName);
    },
    handleTabRemove(pane, ev) {
      if (pane.disabled) return;
      ev.stopPropagation();
      this.$emit('edit', pane.name, 'remove');
      this.$emit('tab-remove', pane.name);
    },
    handleTabAdd() {
      this.$emit('edit', null, 'add');
      this.$emit('tab-add');
    },
    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value;
        this.$emit('update:modelValue', value);
      };
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName);
        if (before && before.then) {
          before.then(
            () => {
              changeCurrentName();
              this.$refs.nav && this.$refs.nav.removeFocus();
            },
            () => {
              // https://github.com/ElemeFE/element/pull/14816
              // ignore promise rejection in `before-leave` hook
            }
          );
        } else if (before !== false) {
          changeCurrentName();
        }
      } else {
        changeCurrentName();
      }
    }
  },

  render() {
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch
    } = this;

    const newButton =
      editable || addable ? (
        <span
          class="al-tabs__new-tab"
          onclick={handleTabAdd}
          tabindex="0"
          onkeydown={ev => {
            if (ev.keyCode === 13) {
              handleTabAdd();
            }
          }}
        >
          <i class="al-icon-plus"></i>
        </span>
      ) : null;

    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch
      },
      ref: 'nav'
    };
    const header = (
      <div class={['al-tabs__header', `is-${tabPosition}`]}>
        {newButton}
        <TabNav {...navData.props} ref="nav"></TabNav>
      </div>
    );
    const panels = <div class="al-tabs__content">{this.panes}</div>;

    return (
      <div
        class={{
          'al-tabs': true,
          'al-tabs--card': type === 'card',
          [`al-tabs--${tabPosition}`]: true,
          'al-tabs--border-card': type === 'border-card'
        }}
      >
        {tabPosition !== 'bottom' ? [header, panels] : [panels, header]}
      </div>
    );
  },

  created() {
    if (!this.currentName) {
      this.setCurrentName('0');
    }

    // this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true));
    $alOn(this.alTabNavUpdateSymbol, this.calcPaneInstances.bind(null, true));
  },

  mounted() {
    this.calcPaneInstances();
  },

  updated() {
    this.calcPaneInstances();
  }
};
</script>
