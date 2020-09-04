import AlTableColumn from '../table/src/table-column';

/* istanbul ignore next */
AlTableColumn.install = function (Vue) {
  Vue.component(AlTableColumn.name, AlTableColumn);
};

export default AlTableColumn;
