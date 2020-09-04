import AlTooltip from './src/main';

/* istanbul ignore next */
AlTooltip.install = function (Vue) {
  Vue.component(AlTooltip.name, AlTooltip);
};

export default AlTooltip;
