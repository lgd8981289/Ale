import AlMenuItem from '@components/menu/src/menu-item';

/* istanbul ignore next */
AlMenuItem.install = function(Vue) {
  Vue.component(AlMenuItem.name, AlMenuItem);
};

export default AlMenuItem;
