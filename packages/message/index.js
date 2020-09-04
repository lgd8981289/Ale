import AlMessage from './src/main.js';

AlMessage.install = function(Vue) {
  Vue.component(AlMessage.name, AlMessage);
};

export default AlMessage;
