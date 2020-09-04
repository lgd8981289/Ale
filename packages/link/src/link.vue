<template>
  <a
    :class="[
      'al-link',
      type ? `al-link--${type}` : '',
      disabled && 'is-disabled',
      underline && !disabled && 'is-underline'
    ]"
    :href="disabled ? null : href"
    v-bind="$attrs"
    @click="handleClick"
  >
    <i :class="icon" v-if="icon"></i>

    <span v-if="$slots.default" class="al-link--inner">
      <slot></slot>
    </span>

    <template v-if="$slots.icon"><slot v-if="$slots.icon" name="icon"></slot></template>
  </a>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AlLink',
  props: {
    /** 按钮类型
     * default（默认值）
     * primary
     * success
     * warning
     * danger
     * info
     */
    type: {
      type: String,
      default: 'default'
    },
    /**
     * 是否加下划线
     */
    underline: {
      type: Boolean,
      default: true
    },
    /**
     * 是否禁用链接
     */
    disabled: Boolean,
    /**
     * 外部样式表 href
     */
    href: String,
    /**
     * 链接图标，接受元素图标组件的图标名
     */
    icon: String
  },
  setup(props, { emit }) {
    let handleClick = event => {
      if (!props.disabled) {
        if (!props.href) {
          emit('click', event);
        }
      }
    };
    return {
      handleClick
    };
  }
});
</script>
