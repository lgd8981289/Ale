import MessageBox from './src/main.js';
import AlMessageBox from './src/main.vue';

AlMessageBox.install = function(Vue) {
  Vue.component(AlMessageBox.name, AlMessageBox);
};

export { MessageBox, AlMessageBox };
