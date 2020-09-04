<template>
  <transition name="al-alert-fade">
    <div
      :class="['al-alert', typeClass, center ? 'is-center' : '', 'is-' + effect]"
      role="alert"
      v-show="state.visible"
    >
      <i :class="[iconClass, isBigIcon]" class="al-alert__icon" v-if="showIcon"></i>
      <div class="al-alert__content">
        <span :class="[isBoldTitle]" class="al-alert__title" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="al-alert__description" v-if="$slots.default && !description">
          <slot></slot>
        </p>
        <p class="al-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <i
          :class="{ 'is-customed': closeText !== '', 'al-icon-close': closeText === '' }"
          @click="close()"
          class="al-alert__closebtn"
          v-show="closable"
          >{{ closeText }}</i
        >
      </div>
    </div>
  </transition>
</template>

<script>
import { reactive } from 'vue';
import { defineComponent } from 'vue';

const AlAlert = defineComponent({
  name: 'AlAlert',
  props: {
    /**
     * 	标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * 辅助性文字。也可通过默认 slot 传入
     */
    description: {
      type: String,
      default: ''
    },
    /**
     * 	主题
     */
    type: {
      type: String,
      default: 'info'
    },
    /**
     * 是否可关闭
     */
    closable: {
      type: Boolean,
      default: true
    },
    /**
     * 关闭按钮自定义文本
     */
    closeText: {
      type: String,
      default: ''
    },
    /**
     * 是否显示图标
     */
    showIcon: Boolean,
    /**
     * 文字是否居中
     */
    center: Boolean,
    /**
     * 选择提供的主题
     */
    effect: {
      type: String,
      default: 'light',
      validator: function(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    }
  },
  emits: {
    close: null
  },
  setup(props, { emit }) {
    const state = reactive({ visible: true });
    let close = event => {
      state.visible = false;
      emit('close', event);
    };
    return {
      state,
      close
    };
  },
  computed: {
    typeClass() {
      return `al-alert--${this.type}`;
    },
    iconClass() {
      const types = {
        success: 'al-icon-success',
        warning: 'al-icon-warning',
        error: 'al-icon-error'
      };
      return types[this.type] || 'al-icon-info';
    },

    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : '';
    },

    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : '';
    }
  }
});

export default AlAlert;
</script>
