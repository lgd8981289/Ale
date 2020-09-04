<template>
  <div
    :class="[
      'al-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `al-color-picker--${colorSize}` : ''
    ]"
    v-clickoutside="hide"
  >
    <div class="al-color-picker__mask" v-if="colorDisabled"></div>
    <div class="al-color-picker__trigger" @click="handleTrigger">
      <span class="al-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="al-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span class="al-color-picker__empty al-icon-close" v-if="!value && !showPanelColor"></span>
      </span>
      <span
        class="al-color-picker__icon al-icon-arrow-down"
        v-show="value || showPanelColor"
      ></span>
    </div>
    <picker-dropdown
      ref="dropdown"
      :class="['al-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
      :colorList="colorList"
    >
    </picker-dropdown>
  </div>
</template>

<script>
// TODO: 后置
import Color from './color';
import PickerDropdown from './components/picker-dropdown.vue';
import Clickoutside from '@utils/clickoutside';
import { $alEmit } from '@mixins/emitter';
import { getInject } from '@form/formInject';
import { inject, nextTick } from 'vue';

function initInject() {
  const alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    alFormItemFormChangeSymbol,
    ...getInject()
  };
}

export default {
  name: 'ElColorPicker',

  emits: {
    'active-change': null,
    input: null,
    change: null
  },

  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array,
    colorList: Array
  },

  setup() {
    return {
      ...initInject()
    };
  },

  directives: { Clickoutside },

  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent';
      }

      return this.displayedRgb(this.color, this.showAlpha);
    },

    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },

    colorSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    },

    colorDisabled() {
      return this.disabled || (this.alForm || {}).disabled;
    }
  },

  watch: {
    value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true;
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return;
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);

      const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha);
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val);
      }
    }
  },

  methods: {
    handleTrigger() {
      if (this.colorDisabled) return;
      this.showPicker = !this.showPicker;
    },
    confirmValue(selection) {
      const value = selection || this.color.value;
      this.$emit('input', value);
      this.$emit('change', value);
      $alEmit(this.alFormItemFormChangeSymbol, value);
      this.showPicker = false;
    },
    clearValue() {
      this.$emit('input', null);
      this.$emit('change', null);
      if (this.value !== null) {
        $alEmit(this.alFormItemFormChangeSymbol, this.value);
      }
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
    },
    hide() {
      this.showPicker = false;
      this.resetColor();
    },
    async resetColor() {
      await nextTick();
      if (this.value) {
        this.color.fromString(this.value);
      } else {
        this.showPanelColor = false;
      }
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class');
      }

      const { r, g, b } = color.toRgb();
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`;
    }
  },

  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    this.popperElm = this.$refs.dropdown.$el;
  },

  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });

    return {
      color,
      showPicker: false,
      showPanelColor: false
    };
  },

  components: {
    PickerDropdown
  }
};
</script>
