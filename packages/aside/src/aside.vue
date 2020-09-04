<template>
  <aside class="al-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
import { defineComponent } from 'vue';
const AlAside = defineComponent({
  name: 'AlAside',

  componentName: 'AlAside',

  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
});
export default AlAside;
</script>
