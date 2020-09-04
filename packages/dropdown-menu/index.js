import AlDropdownMenu from './src/dropdown-menu';

/* istanbul ignore next */
AlDropdownMenu.install = function (Vue) {
  Vue.component(AlDropdownMenu.name, AlDropdownMenu);
};

export default AlDropdownMenu;
