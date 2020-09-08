import message from './src/main.js';
import AlMessage from './src/message.vue';

AlMessage.install = function(Vue) {
  Vue.component(AlMessage.name, AlMessage);
};

export { message, AlMessage };
