<template>
  <div
    class="al-tab-pane"
    v-if="!lazy || loaded || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
import { $alEmit } from '@mixins/emitter.js';
import { inject } from 'vue';

function initMitt() {
  const alTabNavUpdateSymbol = inject('alTabNav-updateSymbol', Symbol());
  return {
    alTabNavUpdateSymbol
  };
}

export default {
  name: 'AlTabPane',

  componentName: 'AlTabPane',

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean,
    pIndex: [String, Number]
  },

  data() {
    return {
      index: null,
      loaded: false,
      refTabs: []
    };
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable;
    },
    active() {
      const active = this.$parent.currentName + '' === (this.name || this.index + '');
      if (active) {
        this.loaded = true;
      }
      return active;
    },
    paneName() {
      return this.name || this.index;
    }
  },

  mounted() {
    this.index = this.pIndex;
  },
  updated() {
    // $alEmit(this.alTabNavUpdateSymbol);
  },
  methods: {}
};
</script>
