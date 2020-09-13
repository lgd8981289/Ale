import AlMenu from './src/menu';

/* istanbul ignore next */
AlMenu.install = function(Vue) {
  Vue.component(AlMenu.name, AlMenu);
};

export default AlMenu;
