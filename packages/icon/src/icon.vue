<template>
  <i :class="'al-icon-' + name"></i>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AlIcon',

  props: {
    name: String
  }
});
</script>
