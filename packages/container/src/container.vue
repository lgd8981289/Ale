<template>
  <section class="al-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'AlContainer',
  componentName: 'AlContainer',
  props: {
    /**
     * 子元素的布局方向
     * horizontal（默认值）
     * vertical
     */
    direction: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    let isVertical = computed(() => {
      if (props.direction === 'vertical') {
        return true;
      } else if (props.direction === 'horizontal') {
        return false;
      }
      // 如果子元素包含 header 或者 footer 那么就设置 vertical 方向
      return slots && slots.default().length > 0
        ? slots.default().some(vnode => {
            const tag = vnode.type && vnode.type.name;
            return tag === 'AlHeader' || tag === 'AlFooter';
          })
        : false;
    });
    return {
      isVertical
    };
  }
});
</script>
