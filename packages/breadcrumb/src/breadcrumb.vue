<template>
  <div
    ref="breadcrumb"
    class="al-breadcrumb"
    aria-label="Breadcrumb"
    role="navigation"
  >
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, provide, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'AlBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/',
    },
    separatorClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const breadcrumb = ref(null)

    provide('breadcrumb', props)

    onMounted(() => {
      const items = breadcrumb.value.querySelectorAll('.al-breadcrumb__item')
      if (items.length) {
        items[items.length - 1].setAttribute('aria-current', 'page')
      }
    })

    return {
      breadcrumb,
    }
  },
})
</script>
