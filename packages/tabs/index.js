import AlTabs from './src/tabs';

/* istanbul ignore next */
AlTabs.install = function(Vue) {
  Vue.component(AlTabs.name, AlTabs);
};

export default AlTabs;
