// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js
// @ts-ignore
import { addResizeListener, removeResizeListener } from '@utils/resize-event';
// @ts-ignore
import scrollbarWidth from '@utils/scrollbar-width';
// @ts-ignore
import { toObject } from '@utils/util';
import Bar from './bar';
import { defineComponent, ref, h } from 'vue';
import { nextTick } from 'vue';

function initData() {
  let sizeWidth = ref('0');
  let sizeHeight = ref('0');
  let moveX = ref(0);
  let moveY = ref(0);
  return {
    sizeWidth,
    sizeHeight,
    moveX,
    moveY
  };
}

/* istanbul ignore next */
export default defineComponent({
  name: 'AlScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  setup(props, { slots }) {
    let data = initData();

    let gutter = scrollbarWidth();
    let style = props.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(props.wrapStyle)) {
        style = toObject(props.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof props.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }

    return {
      ...data,
      gutter,
      style,
      slots
    };
  },

  render() {
    const view = h(
      this.tag,
      {
        class: ['al-scrollbar__view', this.viewClass],
        style: this.viewStyle,
        ref: 'resize'
      },
      this.slots.default()
    );

    const wrap = h(
      'div',
      {
        ref: 'wrap',
        style: this.style,
        onScroll: this.handleScroll,
        class: [
          this.wrapClass,
          'al-scrollbar__wrap',
          this.gutter ? '' : 'al-scrollbar__wrap--hidden-default'
        ]
      },
      view
    );

    let nodes;

    if (!this.native) {
      nodes = [
        wrap,
        h(Bar, { move: this.moveX, size: this.sizeWidth }),
        h(Bar, { vertical: true, move: this.moveY, size: this.sizeHeight })
      ];
    } else {
      nodes = h(
        'div',
        {
          ref: 'wrap',
          class: [this.wrapClass, 'al-scrollbar__wrap'],
          style: this.style
        },
        view
      );
    }
    return h('div', { class: 'al-scrollbar' }, nodes);
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },
    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
    }
  },

  mounted() {
    if (this.native) return;
    nextTick().then(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
});
