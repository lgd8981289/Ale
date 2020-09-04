<template>
  <transition name="al-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="al-autocomplete-suggestion al-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region"
    >
      <al-scrollbar
        tag="ul"
        wrap-class="al-autocomplete-suggestion__wrap"
        view-class="al-autocomplete-suggestion__list"
      >
        <li v-if="!parent.hideLoading && parent.loading"><i class="al-icon-loading"></i></li>
        <slot v-else> </slot>
      </al-scrollbar>
    </div>
  </transition>
</template>
<script>
import Popper from '@utils/vue-popper';
import { $alEmit, $alOn } from '@mixins/emitter';
import AlScrollbar from '@components/scrollbar';
import { nextTick, inject } from 'vue';

function initMitt() {
  const alAutocompleteItemClickSymbol = inject('alAutocomplete-itemClickSymbol', Symbol());
  const alAutocompleteVisibleSymbol = inject('alAutocomplete-visibleSymbol', Symbol());
  return {
    alAutocompleteItemClickSymbol,
    alAutocompleteVisibleSymbol
  };
}

export default {
  components: { AlScrollbar },
  mixins: [Popper],

  componentName: 'AlAutocompleteSuggestions',

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },

  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  methods: {
    select(item) {
      // this.dispatch('AlAutocomplete', 'item-click', item);
      $alEmit(this.alAutocompleteItemClickSymbol, item);
    }
  },

  updated() {
    // this.$nextTick((_) => {
    //   this.popperJS && this.updatePopper();
    // });
    nextTick().then(() => {
      this.popperJS && this.updatePopper();
    });
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm =
      this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
    this.referenceList = this.$el.querySelector('.al-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  },

  created() {
    // this.$on('visible', (val, inputWidth) => {
    //   this.dropdownWidth = inputWidth + 'px';
    //   this.showPopper = val;
    // });
    $alOn(this.alAutocompleteVisibleSymbol, (e) => {
      this.dropdownWidth = e.inputWidth + 'px';
      this.showPopper = e.val;
    });
  }
};
</script>
