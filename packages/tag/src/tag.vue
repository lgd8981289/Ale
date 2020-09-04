<template>
  <span
    :class="[
      'al-tag',
      type ? `al-tag--${type}` : '',
      tagSize ? `al-tag--${tagSize}` : '',
      effect ? `al-tag--${effect}` : '',
      hit && 'is-hit'
    ]"
    @click="handleClick"
    :style="[color ? `backgroundColor: ${color}` : '']"
  >
    <span v-if="$slots.default">
      <slot></slot>
    </span>
    <i @click="handleClose" class="al-tag__close al-icon-close" v-if="closable"></i>
  </span>
</template>
<script>
import { defineComponent } from 'vue';

const AlTag = defineComponent({
  name: 'AlTag',
  props: {
    /* 标签文本 */
    text: String,

    /* 是否可关闭 */
    closable: {
      type: Boolean,
      default: false
    },

    /* 样式类型
     * success/info/warning/danger
     */
    type: {
      type: String,
      default: 'success'
    },

    /* 是否有边框描边 */
    hit: {
      type: Boolean,
      default: false
    },

    /* 是否禁用渐变动画 -- 暂不支持 */
    // disableTransitions: {
    //   type: Boolean,
    //   default: false
    // },

    /* 背景色 */
    color: String,

    /* 尺寸
     * medium / small / mini
     */
    size: String,

    /*
     * 主题
     * dark / light / plain
     */
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1;
      }
    }
  },
  setup(props, { emit }) {
    let handleClose = (event) => {
      event.stopPropagation();
      emit('close', event);
    };
    let handleClick = (event) => {
      emit('click', event);
    };
    return {
      handleClose,
      handleClick
    };
  },
  computed: {
    tagSize() {
      return this.size || (window.Ale.$ELEMENT || {}).size;
    }
  }
});

export default AlTag;
</script>
