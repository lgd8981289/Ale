import AlDialog from './src/component';

/* istanbul ignore next */
AlDialog.install = function (Vue) {
  Vue.component(AlDialog.name, AlDialog);
};

export default AlDialog;
