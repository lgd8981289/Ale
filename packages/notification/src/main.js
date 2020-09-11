import Main from './main.vue';
import merge from '@utils/merge';
import { PopupManager } from '@utils/popup';
import { isVNode } from '@utils/vdom';
import { createApp } from 'vue';
// const NotificationConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;
let notificationApp;
let notificationApps = [];
let mountIds = [];

const MOUNT_ID = 'al-notification-mount-';

function createMountEle(id) {
  const teleportDiv = document.createElement('div');
  teleportDiv.setAttribute('id', MOUNT_ID + id);
  document.body.append(teleportDiv);
}

const Notification = function(options) {
  // if (Vue.prototype.$isServer) return;
  options = merge({}, options);
  const userOnClose = options.onClose;
  const id = 'notification_' + seed++;
  const position = options.position || 'top-right';

  createMountEle(id);

  options.onClose = function() {
    Notification.close(id, userOnClose);
  };

  notificationApp = createApp({
    ...Main,
    data: function() {
      return {
        ...Main.data(),
        ...options
      };
    }
  });
  instance = notificationApp.mount('#' + MOUNT_ID + id);

  // instance = new NotificationConstructor({
  //   data: options
  // });

  if (isVNode(options.message)) {
    instance.$slots.default = [options.message];
    options.message = 'REPLACED_BY_VNODE';
  }
  instance.id = id;
  // instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible = true;
  instance.dom = instance.$el;
  instance.dom.style.zIndex = PopupManager.nextZIndex();

  let verticalOffset = options.offset || 0;
  instances
    .filter(item => item.position === position)
    .forEach(item => {
      verticalOffset += item.$el.offsetHeight + 16;
    });
  verticalOffset += 16;
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
  notificationApps.push(notificationApp);
  mountIds.push(MOUNT_ID + id);
  return instance;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Notification[type] = options => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options
      };
    }
    options.type = type;
    return Notification(options);
  };
});

Notification.close = function(id, userOnClose) {
  let index = -1;
  const len = instances.length;
  document.body.removeChild(document.getElementById(MOUNT_ID + id));

  const instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i;
      return true;
    }
    return false;
  })[0];
  if (!instance) return;

  if (typeof userOnClose === 'function') {
    userOnClose(instance);
  }
  instances.splice(index, 1);

  if (len <= 1) return;
  const position = instance.position;
  const removedHeight = instance.dom.offsetHeight;
  for (let i = index; i < len - 1; i++) {
    if (instances[i].position === position) {
      instances[i].dom.style[instance.verticalProperty] =
        parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
    }
  }
};

Notification.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
    notificationApps[i].unmount();
  }
};

export default Notification;
