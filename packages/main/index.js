import AlMain from './src/main';
AlMain.install = function(Vue) {
  Vue.component(AlMain.name, AlMain);
};
export default AlMain;
