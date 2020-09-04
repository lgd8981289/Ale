<template>
  <section class="config" :key="displayName">
    <div class="config-label">
      <al-tooltip :content="displayName" placement="top">
        <span>{{ displayKeyName }}</span>
      </al-tooltip>
    </div>
    <div class="config-content">
      <theme-input v-if="isGlobal" :val="value" @change="onChange"></theme-input>
      <al-select
        size="medium"
        v-if="!isGlobal"
        v-model="value"
        class="select"
        @change="onSelectChange"
      >
        <al-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </al-option>
      </al-select>
    </div>
  </section>
</template>

<style>
.select {
  width: 100%;
}
</style>

<script>
import Mixin from './mixin';
import Input from './input';
import { getStyleDisplayName } from '../utils/utils.js';

export default {
  data() {
    return {
      options: [],
      value: ''
    };
  },
  components: {
    themeInput: Input
  },
  mixins: [Mixin],
  computed: {
    isGlobalInputValue() {
      return this.config.value.startsWith('$');
    }
  },
  methods: {
    onSelectChange(e) {
      this.onChange(e);
    },
    initSelectOption() {
      this.options = [];
      const golbalV = this.golbalValue.border;
      if (golbalV) {
        Object.keys(golbalV).forEach(font => {
          if (font.includes('border-radius')) {
            const size = golbalV[font];
            this.options.push({
              value: size.key,
              label: getStyleDisplayName(size)
            });
          }
        });
      }
    }
  },
  watch: {
    mergedValue: {
      immediate: true,
      handler(value) {
        this.initSelectOption();
        this.value = this.mergedValue;
      }
    }
  }
};
</script>
