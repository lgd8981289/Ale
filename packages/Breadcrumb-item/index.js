import BreadcrumbItem from './src/breadcrumb-item.vue'

BreadcrumbItem.install = function (Vue) {
  Vue.component(BreadcrumbItem.name, BreadcrumbItem);
};

export default BreadcrumbItem;
