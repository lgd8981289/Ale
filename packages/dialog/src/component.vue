<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="al-dialog__wrapper" @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'al-dialog',
          { 'is-fullscreen': fullscreen, 'al-dialog--center': center },
          customClass
        ]"
        ref="dialog"
        :style="style"
      >
        <div class="al-dialog__header">
          <slot name="title">
            <span class="al-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="al-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <i class="al-dialog__close al-icon al-icon-close"></i>
          </button>
        </div>
        <div class="al-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="al-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from '@utils/popup';
import Migrating from '@mixins/migrating';
import { $alEmit } from '@mixins/emitter';
import { nextTick } from 'vue';

function initMitt() {
  const alSelectDropdownUpdatePopperSymbol = Symbol('alSelectDropdown-updatePopperSymbol');
  const alDropdownMenuUpdatePopperSymbol = Symbol('alDropdownMenu-updatePopperSymbol');
  return {
    alSelectDropdownUpdatePopperSymbol,
    alDropdownMenuUpdatePopperSymbol
  };
}

export default {
  name: 'AlDialog',

  mixins: [Popup, Migrating],

  emits: {
    open: null,
    'update:visible': null,
    close: null,
    opened: null,
    closed: null
  },

  props: {
    /**
     * Dialog 的标题，也可通过具名 slot （见下表）传入
     */
    title: {
      type: String,
      default: ''
    },

    /**
     * 是否需要遮罩层
     */
    modal: {
      type: Boolean,
      default: true
    },

    /**
     * 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
     */
    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    /**
     * Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
     */
    appendToBody: {
      type: Boolean,
      default: false
    },

    /**
     * 是否在 Dialog 出现时将 body 滚动锁定
     */
    lockScroll: {
      type: Boolean,
      default: true
    },

    /**
     * 是否可以通过点击 modal 关闭 Dialog
     */
    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    /**
     * 是否可以通过按下 ESC 关闭 Dialog
     */
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    /**
     * 是否显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true
    },

    /**
     * Dialog 的宽度
     */
    width: String,

    /**
     * 是否为全屏 Dialog
     */
    fullscreen: Boolean,

    /**
     * Dialog 的自定义类名
     */
    customClass: {
      type: String,
      default: ''
    },

    /**
     * Dialog CSS 中的 margin-top 值
     */
    top: {
      type: String,
      default: '15vh'
    },
    /**
     * 关闭前的回调，会暂停 Dialog 的关闭
     */
    beforeClose: Function,
    /**
     * 是否对头部和底部采用居中布局
     */
    center: {
      type: Boolean,
      default: false
    },
    /**
     * 关闭时销毁 Dialog 中的元素
     */
    destroyOnClose: Boolean
  },

  setup() {
    return {
      ...initMitt()
    };
  },

  data() {
    return {
      closed: false,
      key: 0
    };
  },

  watch: {
    // TODO: .sync 已弃用
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        nextTick().then(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          nextTick().then(() => {
            this.key++;
          });
        }
      }
    }
  },

  computed: {
    style() {
      let style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      $alEmit(this.alSelectDropdownUpdatePopperSymbol);
      $alEmit(this.alDropdownMenuUpdatePopperSymbol);
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
