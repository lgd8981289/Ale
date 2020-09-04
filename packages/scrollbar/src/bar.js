// @ts-ignore
import { on, off } from '@utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';
import { defineComponent, h, computed } from 'vue';

/* istanbul ignore next */
export default defineComponent({
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  setup(props) {
    let bar = computed(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal']);

    function clickTrackHandler(e) {
      const offset = Math.abs(
        e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]
      );
      const thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / this.$el[this.bar.offset];

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100;
    }

    return () =>
      h(
        'div',
        {
          class: ['al-scrollbar__bar', 'is-' + bar.value.key],
          onMousedown: clickTrackHandler
        },
        h('div', {
          class: 'al-scrollbar__thumb',
          ref: 'thumb',
          onMousedown: clickTrackHandler,
          style: renderThumbStyle({ size: props.size, move: props.move, bar })
        })
      );
  },

  computed: {
    wrap() {
      return this.$parent.wrap;
    }
  },

  methods: {
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.startDrag(e);
      this[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const offset =
        (this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1;
      const thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / this.$el[this.bar.offset];

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100;
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
});
