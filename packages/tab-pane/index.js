import AlTabPane from '../tabs/src/tab-pane.vue';

/* istanbul ignore next */
AlTabPane.install = function(Vue) {
  Vue.component(AlTabPane.name, AlTabPane);
};

export default AlTabPane;
