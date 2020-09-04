import AlAlert from './src/alert.vue';

AlAlert.install = function (Vue) {
  Vue.component(AlAlert.name, AlAlert);
};

export default AlAlert;
