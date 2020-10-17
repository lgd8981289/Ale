<template>
  <span class="al-breadcrumb__item">
    <span
      ref="link"
      :class="['al-breadcrumb__inner', to ? 'is-link' : '']"
      role="link"
    >
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="al-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="al-breadcrumb__separator" role="presentation">{{ separator }}</span>
  </span>
</template>

<script>
import { defineComponent, inject, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'AlBreadcrumbItem',
  props: {
    to: {
      type: [String, Object],
      default: '',
    },
    replace: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const link = ref(null)
    const parent = inject('breadcrumb')

    onMounted(() => {
      link.value.setAttribute('role', 'link')
      link.value.addEventListener('click', () => {
        if (!props.to) return
        const router = useRouter()
        if (!router) return
        props.replace ? router.replace(props.to) : router.push(props.to)
      })
    })

    return {
      link,
      separator: parent.separator,
      separatorClass: parent.separatorClass,
    }
  },
})
</script>
