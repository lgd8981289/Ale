export default {
  inject: ['rootMenu'],
  computed: {
    indexPath() {
      const path = [this.index];
      let parent = this.$parent;
      while (parent.$options.name !== 'AlMenu') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    parentMenu() {
      let parent = this.$parent;
      console.log('test: 获取父元素 : ' + parent.$options.name);

      while (parent && ['AlMenu', 'AlSubmenu'].indexOf(parent.$options.name) === -1) {
        console.log(parent.$options.name);
        parent = parent.$parent;
      }
      return parent;
    },
    paddingStyle() {
      if (this.rootMenu.mode !== 'vertical') return {};

      let padding = 20;
      let parent = this.$parent;

      if (this.rootMenu.collapse) {
        padding = 20;
      } else {
        while (parent && parent.$options.name !== 'AlMenu') {
          if (parent.$options.name === 'AlSubmenu') {
            padding += 20;
          }
          parent = parent.$parent;
        }
      }
      return { paddingLeft: padding + 'px' };
    }
  }
};
