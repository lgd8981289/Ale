<template>
  <transition name="al-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'al-message',
        type && !iconClass ? `al-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="al-message__content">{{ message }}</p>
        <p v-else v-html="message" class="al-message__content"></p>
      </slot>
      <i v-if="showClose" class="al-message__closeBtn al-icon-close" @click="close"></i>
    </div>
  </transition>
</template>

<script type="text/babel">
import { defineComponent } from 'vue';

const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

const AlMessage = defineComponent({
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    };
  },

  computed: {
    typeClass() {
      return this.type && !this.iconClass ? `al-message__icon al-icon-${typeMap[this.type]}` : '';
    },
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`
      };
    }
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    }
  },

  methods: {
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },

    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    }
  },
  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }
});

export default AlMessage;
</script>
