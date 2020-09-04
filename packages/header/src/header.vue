<template>
  <header class="al-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AlHeader',

  componentName: 'AlHeader',

  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
});
</script>
