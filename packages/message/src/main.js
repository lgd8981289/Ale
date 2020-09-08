import AlMessage from './message.vue';
import { createApp } from 'vue';
import { PopupManager } from '@utils/popup';
import { h } from 'vue';

let messageApp;
let instance;
let instances = [];
let messageApps = [];
let mountIds = [];
let seed = 1;
const TELEPORT_ID = 'al-message-mount-';

function createMountEle(id) {
  const teleportDiv = document.createElement('div');
  teleportDiv.setAttribute('id', TELEPORT_ID + id);
  document.body.append(teleportDiv);
}

const Message = function(options) {
  // TODO: if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  let userOnClose = options.onClose;
  let id = 'message_' + seed++;

  createMountEle(id);

  options.onClose = function() {
    Message.close(id, userOnClose);
  };
  messageApp = createApp({
    ...AlMessage,
    data: function() {
      return {
        ...AlMessage.data(),
        ...options
      };
    }
  });
  instance = messageApp.mount('#' + TELEPORT_ID + id);
  instance.id = id;
  if (instance.message && instance.message.__v_isVNode) {
    // instance.$slots.default = [instance.message];
    instance.message = null;
  }
  // instance.$mount();
  document.body.appendChild(instance.$el);
  let verticalOffset = options.offset || 20;
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instance.$el.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  messageApps.push(messageApp);
  mountIds.push(TELEPORT_ID + id);
  return instance;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return Message(options);
  };
});

Message.close = function(id, userOnClose) {
  let len = instances.length;
  let index = -1;
  let removedHeight;
  document.body.removeChild(document.getElementById(TELEPORT_ID + id));
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return;
  for (let i = index; i < len - 1; i++) {
    let dom = instances[i].$el;
    dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
  }
};

Message.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
    messageApps[i].unmount();
  }
};

export default Message;
