<template>
  <transition name="al-zoom-in-top">
    <div
      class="al-table-filter"
      v-if="multiple"
      v-clickoutside="handleOutsideClick"
      v-show="showPopper"
    >
      <div class="al-table-filter__content">
        <al-scrollbar wrap-class="al-table-filter__wrap">
          <al-checkbox-group class="al-table-filter__checkbox-group" v-model="filteredValue">
            <al-checkbox v-for="filter in filters" :key="filter.value" :label="filter.value">{{
              filter.text
            }}</al-checkbox>
          </al-checkbox-group>
        </al-scrollbar>
      </div>
      <div class="al-table-filter__bottom">
        <button
          @click="handleConfirm"
          :class="{ 'is-disabled': filteredValue.length === 0 }"
          :disabled="filteredValue.length === 0"
        >
          {{ t('el.table.confirmFilter') }}
        </button>
        <button @click="handleReset">{{ t('el.table.resetFilter') }}</button>
      </div>
    </div>
    <div class="al-table-filter" v-else v-clickoutside="handleOutsideClick" v-show="showPopper">
      <ul class="al-table-filter__list">
        <li
          class="al-table-filter__list-item"
          :class="{ 'is-active': filterValue === undefined || filterValue === null }"
          @click="handleSelect(null)"
        >
          {{ t('el.table.clearFilter') }}
        </li>
        <li
          class="al-table-filter__list-item"
          v-for="filter in filters"
          :label="filter.value"
          :key="filter.value"
          :class="{ 'is-active': isActive(filter) }"
          @click="handleSelect(filter.value)"
        >
          {{ filter.text }}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popper from '@utils/vue-popper';
import { PopupManager } from '@utils/popup';
import Locale from '@mixins/locale';
import Clickoutside from '@utils/clickoutside';
import Dropdown from './dropdown';
import ElCheckbox from 'ale-ui/packages/checkbox';
import ElCheckboxGroup from 'ale-ui/packages/checkbox-group';
import ElScrollbar from 'ale-ui/packages/scrollbar';

export default {
  name: 'ElTableFilterPanel',

  mixins: [Popper, Locale],

  directives: {
    Clickoutside
  },

  components: {
    ElCheckbox,
    ElCheckboxGroup,
    ElScrollbar
  },

  props: {
    placement: {
      type: String,
      default: 'bottom-end'
    }
  },

  methods: {
    isActive(filter) {
      return filter.value === this.filterValue;
    },

    handleOutsideClick() {
      setTimeout(() => {
        this.showPopper = false;
      }, 16);
    },

    handleConfirm() {
      this.confirmFilter(this.filteredValue);
      this.handleOutsideClick();
    },

    handleReset() {
      this.filteredValue = [];
      this.confirmFilter(this.filteredValue);
      this.handleOutsideClick();
    },

    handleSelect(filterValue) {
      this.filterValue = filterValue;

      if (typeof filterValue !== 'undefined' && filterValue !== null) {
        this.confirmFilter(this.filteredValue);
      } else {
        this.confirmFilter([]);
      }

      this.handleOutsideClick();
    },

    confirmFilter(filteredValue) {
      this.table.store.commit('filterChange', {
        column: this.column,
        values: filteredValue
      });
      this.table.store.updateAllSelected();
    }
  },

  data() {
    return {
      table: null,
      cell: null,
      column: null
    };
  },

  computed: {
    filters() {
      return this.column && this.column.filters;
    },

    filterValue: {
      get() {
        return (this.column.filteredValue || [])[0];
      },
      set(value) {
        if (this.filteredValue) {
          if (typeof value !== 'undefined' && value !== null) {
            this.filteredValue.splice(0, 1, value);
          } else {
            this.filteredValue.splice(0, 1);
          }
        }
      }
    },

    filteredValue: {
      get() {
        if (this.column) {
          return this.column.filteredValue || [];
        }
        return [];
      },
      set(value) {
        if (this.column) {
          this.column.filteredValue = value;
        }
      }
    },

    multiple() {
      if (this.column) {
        return this.column.filterMultiple;
      }
      return true;
    }
  },

  mounted() {
    this.popperElm = this.$el;
    this.referenceElm = this.cell;
    this.table.bodyWrapper.addEventListener('scroll', () => {
      this.updatePopper();
    });

    this.$watch('showPopper', value => {
      if (this.column) this.column.filterOpened = value;
      if (value) {
        Dropdown.open(this);
      } else {
        Dropdown.close(this);
      }
    });
  },
  watch: {
    showPopper(val) {
      if (val === true && parseInt(this.popperJS._popper.style.zIndex, 10) < PopupManager.zIndex) {
        this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      }
    }
  }
};
</script>
