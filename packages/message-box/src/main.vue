<template>
  <transition name="msgbox-fade">
    <div
      class="al-message-box__wrapper"
      tabindex="-1"
      v-show="visible"
      @click.self="handleWrapperClick"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'dialog'"
    >
      <div class="al-message-box" :class="[customClass, center && 'al-message-box--center']">
        <div class="al-message-box__header" v-if="title !== null">
          <div class="al-message-box__title">
            <div :class="['al-message-box__status', icon]" v-if="icon && center"></div>
            <span>{{ title }}</span>
          </div>
          <button
            type="button"
            class="al-message-box__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')"
            @keydown.enter="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')"
          >
            <i class="al-message-box__close al-icon-close"></i>
          </button>
        </div>
        <div class="al-message-box__content">
          <div class="al-message-box__container">
            <div
              :class="['al-message-box__status', icon]"
              v-if="icon && !center && message !== ''"
            ></div>
            <div class="al-message-box__message" v-if="message !== ''">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
                <p v-else v-html="message"></p>
              </slot>
            </div>
          </div>
          <div class="al-message-box__input" v-show="showInput">
            <al-input
              v-model="inputValue"
              :type="inputType"
              @keydown.enter.native="handleInputEnter"
              :placeholder="inputPlaceholder"
              ref="input"
            ></al-input>
            <div
              class="al-message-box__errormsg"
              :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }"
            >
              {{ editorErrorMessage }}
            </div>
          </div>
        </div>
        <div class="al-message-box__btns">
          <al-button
            :loading="cancAlButtonLoading"
            :class="[cancAlButtonClasses]"
            v-if="showCancAlButton"
            :round="roundButton"
            size="small"
            @click.native="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
          >
            {{ cancelButtonText || t('al.messagebox.cancel') }}
          </al-button>
          <al-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[confirmButtonClasses]"
            v-show="showConfirmButton"
            :round="roundButton"
            size="small"
            @click.native="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
          >
            {{ confirmButtonText || t('al.messagebox.confirm') }}
          </al-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popup from '@utils/popup/index-msgbox';
import Locale from '@mixins/locale';
import AlInput from '@components/input';
import AlButton from '@components/button';
import { addClass, removeClass } from '@utils/dom';
import { t } from '@locale';
import Dialog from '@utils/aria-dialog';

let messageBox;
let typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

export default {
  name: 'AlMessageBox',
  mixins: [Popup, Locale],

  props: {
    modal: {
      default: true
    },
    center: {
      default: false,
      type: Boolean
    },
    roundButton: {
      default: false,
      type: Boolean
    }
  },

  components: {
    AlInput,
    AlButton
  },

  computed: {
    icon() {
      const { type, iconClass } = this;
      return iconClass || (type && typeMap[type] ? `al-icon-${typeMap[type]}` : '');
    },

    confirmButtonClasses() {
      return `al-button--primary ${this.confirmButtonClass}`;
    },
    cancAlButtonClasses() {
      return `${this.cancAlButtonClass}`;
    }
  },

  methods: {
    getSafeClose() {
      const currentId = this.uid;
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose();
        });
      };
    },
    doClose() {
      if (!this.visible) return;
      this.visible = false;
      this._closing = true;

      this.onClose && this.onClose();
      messageBox.closeDialog(); // 解绑
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200);
      }
      this.opened = false;
      this.doAfterClose();
      setTimeout(() => {
        if (this.action) this.callback(this.action, this);
      });
    },

    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel');
      }
    },

    handleInputEnter() {
      if (this.inputType !== 'textarea') {
        return this.handleAction('confirm');
      }
    },

    handleAction(action) {
      if (this.$msgType === 'prompt' && action === 'confirm' && !this.validate()) {
        return;
      }
      this.action = action;
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose();
        this.beforeClose(action, this, this.close);
      } else {
        this.doClose();
      }
    },

    validate() {
      if (this.$msgType === 'prompt') {
        const inputPattern = this.inputPattern;
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
          addClass(this.getInputElement(), 'invalid');
          return false;
        }
        const inputValidator = this.inputValidator;
        if (typeof inputValidator === 'function') {
          const validateResult = inputValidator(this.inputValue);
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
            addClass(this.getInputElement(), 'invalid');
            return false;
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult;
            addClass(this.getInputElement(), 'invalid');
            return false;
          }
        }
      }
      this.editorErrorMessage = '';
      removeClass(this.getInputElement(), 'invalid');
      return true;
    },
    getFirstFocus() {
      const btn = this.$el.querySelector('.al-message-box__btns .al-button');
      const title = this.$el.querySelector('.al-message-box__btns .al-message-box__title');
      return btn || title;
    },
    getInputElement() {
      const inputRefs = this.$refs.input.$refs;
      return inputRefs.input || inputRefs.textarea;
    },
    handleClose() {
      this.handleAction('close');
    }
  },

  watch: {
    inputValue: {
      immediate: true,
      handler(val) {
        this.$nextTick(_ => {
          if (this.$msgType === 'prompt' && val !== null) {
            this.validate();
          }
        });
      }
    },

    visible(val) {
      if (val) {
        this.uid++;
        if (this.$msgType === 'alert' || this.$msgType === 'confirm') {
          this.$nextTick(() => {
            this.$refs.confirm.$el.focus();
          });
        }
        this.focusAfterClosed = document.activeElement;
        messageBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus());
      }

      // prompt
      if (this.$msgType !== 'prompt') return;
      if (val) {
        setTimeout(() => {
          if (this.$refs.input && this.$refs.input.$el) {
            this.getInputElement().focus();
          }
        }, 500);
      } else {
        this.editorErrorMessage = '';
        removeClass(this.getInputElement(), 'invalid');
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.closeOnHashChange) {
        window.addEventListener('hashchange', this.close);
      }
    });
  },

  beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close);
    }
    setTimeout(() => {
      messageBox.closeDialog();
    });
  },

  data() {
    return {
      uid: 1,
      title: undefined,
      message: '',
      type: '',
      iconClass: '',
      customClass: '',
      showInput: false,
      inputValue: null,
      inputPlaceholder: '',
      inputType: 'text',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancAlButton: false,
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      confirmButtonLoading: false,
      cancAlButtonLoading: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancAlButtonClass: '',
      editorErrorMessage: null,
      callback: null,
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null,
      isOnComposition: false,
      distinguishCancelAndClose: false,
      closeOnPressEscape: true,
      closeOnClickModal: true,
      visible: false,
      lockScroll: true,
      showClose: true,
      modalFade: true,
      closeOnHashChange: true
    };
  }
};
</script>
