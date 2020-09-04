<script>
import { getInject } from '@form/formInject';
import { defineComponent, h, ref, watch } from 'vue';

function render(props, slots, formInject, computedWidth) {
  const defaultSlots = slots.default();
  if (!defaultSlots) return null;
  if (props.isAutoWidth) {
    const autoLabelWidth = formInject.alForm.autoLabelWidth;
    const style = {};
    if (autoLabelWidth && autoLabelWidth !== 'auto') {
      const marginLeft = parseInt(autoLabelWidth, 10) - computedWidth.value;
      if (marginLeft) {
        style.marginLeft = marginLeft + 'px';
      }
    }
    // TODO: jsx
    // return (
    //   <div class="al-form-item__label-wrap" style={style}>
    //     {slots}
    //   </div>
    // );
    return h(
      'div',
      {
        class: 'al-form-item__label-wrap',
        style: style
      },
      defaultSlots
    );
  } else {
    return () => defaultSlots[0];
  }
}
const AlLabelWrap = defineComponent({
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },

  setup(props, { slots }) {
    const formInject = getInject();
    const computedWidth = ref(0);
    watch(computedWidth, (val, oldVal) => {
      if (props.updateAll) {
        formInject.alForm.registerLabelWidth(val, oldVal);
        formInject.alFormItem.updateComputedLabelWidth(val);
      }
    });

    return render(props, slots, formInject, computedWidth);
  },

  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth();
        } else if (action === 'remove') {
          this.alForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }
  },

  // watch: {
  //   computedWidth(val, oldVal) {
  //     if (this.updateAll) {
  //       this.alForm.registerLabelWidth(val, oldVal);
  //       this.alFormItem.updateComputedLabelWidth(val);
  //     }
  //   }
  // },

  mounted() {
    this.updateLabelWidth('update');
  },

  updated() {
    this.updateLabelWidth('update');
  },

  beforeDestroy() {
    this.updateLabelWidth('remove');
  }
});

export default AlLabelWrap;
</script>
