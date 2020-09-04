import AlBacktop from './src/main';

/* istanbul ignore next */
AlBacktop.install = function (Vue) {
  Vue.component(AlBacktop.name, AlBacktop);
};

export default AlBacktop;
