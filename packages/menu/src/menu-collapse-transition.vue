<script>
import { addClass, removeClass, hasClass } from '@utils/dom';
import { h, Transition } from 'vue';
export default {
  name: 'AlMenuCollapseTransition',
  functional: true,
  render() {
    const data = {
      props: {
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          el.style.opacity = 0.2;
        },

        enter(el) {
          addClass(el, 'al-opacity-transition');
          el.style.opacity = 1;
        },

        afterEnter(el) {
          removeClass(el, 'al-opacity-transition');
          el.style.opacity = '';
        },

        beforeLeave(el) {
          if (!el.dataset) el.dataset = {};

          if (hasClass(el, 'al-menu--collapse')) {
            removeClass(el, 'al-menu--collapse');
            el.dataset.oldOverflow = el.style.overflow;
            el.dataset.scrollWidth = el.clientWidth;
            addClass(el, 'al-menu--collapse');
          } else {
            addClass(el, 'al-menu--collapse');
            el.dataset.oldOverflow = el.style.overflow;
            el.dataset.scrollWidth = el.clientWidth;
            removeClass(el, 'al-menu--collapse');
          }

          el.style.width = el.scrollWidth + 'px';
          el.style.overflow = 'hidden';
        },

        leave(el) {
          addClass(el, 'horizontal-collapse-transition');
          el.style.width = el.dataset.scrollWidth + 'px';
        }
      }
    };
    // return h(Transition, data, this.$slots.default());
    return h('div', data, this.$slots.default());
  }
};
</script>
