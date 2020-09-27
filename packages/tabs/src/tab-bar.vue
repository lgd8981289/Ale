<template>
  <div class="al-tabs__active-bar" :class="`is-${rootTabs.tabPosition}`" :style="barStyle"></div>
</template>
<script>
import { arrayFind } from '@utils/util';
import { $alOn } from '@mixins/emitter.js';
import { setTimeout } from 'timers';
import { nextTick, inject } from 'vue';

function initMitt() {
  const alTabNavTabClickSymbol = inject('alTabNav-tabclickSymbol', Symbol());
  return {
    alTabNavTabClickSymbol
  };
}

export default {
  name: 'TabBar',

  props: {
    tabs: Array
  },

  inject: ['rootTabs'],

  data() {
    return {
      barStyle: {}
    };
  },
  setup() {
    return {
      ...initMitt()
    };
  },

  mounted() {
    this.onUpdateBarStyle();
    $alOn(this.alTabNavTabClickSymbol, this.onUpdateBarStyle);
  },

  methods: {
    async onUpdateBarStyle() {
      await nextTick();
      console.log(this.refTabs);
      let style = {};
      let offset = 0;
      let tabSize = 0;
      const sizeName =
        ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
      const sizeDir = sizeName === 'width' ? 'x' : 'y';
      const firstUpperCase = str => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
      };

      this.tabs.every((tab, index) => {
        let $el = arrayFind(document.getElementsByClassName('al-tabs__item') || [], t => {
          return t.id.replace('tab-', '') === tab.props.name;
        });
        if (!$el) {
          return false;
        }
        if (!tab.active) {
          offset += $el[`client${firstUpperCase(sizeName)}`];
          return true;
        } else {
          tabSize = $el[`client${firstUpperCase(sizeName)}`];
          const tabStyles = window.getComputedStyle($el);
          if (sizeName === 'width' && this.tabs.length > 1) {
            tabSize -= parseFloat(tabStyles.paddingLeft) + parseFloat(tabStyles.paddingRight);
          }
          if (sizeName === 'width') {
            offset += parseFloat(tabStyles.paddingLeft);
          }
          return false;
        }
      });

      const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
      style[sizeName] = tabSize + 'px';
      style.transform = transform;
      style.msTransform = transform;
      style.webkitTransform = transform;
      this.barStyle = style;
    }
  }
};
</script>
