<template>
  <footer class="al-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script type="text/babel">
export default {
  name: 'AlFooter',

  componentName: 'AlFooter',

  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
};
</script>
