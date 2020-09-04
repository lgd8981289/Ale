<template>
  <div
    class="al-table"
    :class="[
      {
        'al-table--fit': fit,
        'al-table--striped': stripe,
        'al-table--border': border || isGroup,
        'al-table--hidden': isHidden,
        'al-table--group': isGroup,
        'al-table--fluid-height': maxHeight,
        'al-table--scrollable-x': layout.scrollX,
        'al-table--scrollable-y': layout.scrollY,
        'al-table--enable-row-hover': !store.states.isComplex,
        'al-table--enable-row-transition':
          (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
      },
      tableSize ? `al-table--${tableSize}` : ''
    ]"
    @mouseleave="handleMouseLeave($event)"
  >
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div
      v-if="showHeader"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="al-table__header-wrapper"
      ref="headerWrapper"
    >
      <table-header
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      >
      </table-header>
    </div>
    <div
      class="al-table__body-wrapper"
      ref="bodyWrapper"
      :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
      :style="[bodyHeight]"
    >
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
          width: bodyWidth
        }"
      >
      </table-body>
      <div
        v-if="!data || data.length === 0"
        class="al-table__empty-block"
        ref="emptyBlock"
        :style="emptyBlockStyle"
      >
        <span class="al-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div v-if="$slots.append" class="al-table__append-wrapper" ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="data && data.length > 0"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="al-table__footer-wrapper"
      ref="footerWrapper"
    >
      <table-footer
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      >
      </table-footer>
    </div>
    <div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="al-table__fixed"
      ref="fixedWrapper"
      :style="[
        {
          width: layout.fixedWidth ? layout.fixedWidth + 'px' : ''
        },
        fixedHeight
      ]"
    >
      <div v-if="showHeader" class="al-table__fixed-header-wrapper" ref="fixedHeaderWrapper">
        <table-header
          ref="fixedTableHeader"
          fixed="left"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></table-header>
      </div>
      <div
        class="al-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[
          {
            top: layout.headerHeight + 'px'
          },
          fixedBodyHeight
        ]"
      >
        <table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth
          }"
        >
        </table-body>
        <div
          v-if="$slots.append"
          class="al-table__append-gutter"
          :style="{ height: layout.appendHeight + 'px' }"
        ></div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="al-table__fixed-footer-wrapper"
        ref="fixedFooterWrapper"
      >
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="al-table__fixed-right"
      ref="rightFixedWrapper"
      :style="[
        {
          width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
          right: layout.scrollY
            ? (border ? layout.gutterWidth : layout.gutterWidth || 0) + 'px'
            : ''
        },
        fixedHeight
      ]"
    >
      <div v-if="showHeader" class="al-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper">
        <table-header
          ref="rightFixedTableHeader"
          fixed="right"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></table-header>
      </div>
      <div
        class="al-table__fixed-body-wrapper"
        ref="rightFixedBodyWrapper"
        :style="[
          {
            top: layout.headerHeight + 'px'
          },
          fixedBodyHeight
        ]"
      >
        <table-body
          fixed="right"
          :store="store"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth
          }"
        >
        </table-body>
        <div
          v-if="$slots.append"
          class="al-table__append-gutter"
          :style="{ height: layout.appendHeight + 'px' }"
        ></div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="al-table__fixed-footer-wrapper"
        ref="rightFixedFooterWrapper"
      >
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      class="al-table__fixed-right-patch"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight + 'px'
      }"
    ></div>
    <div class="al-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
import AlCheckbox from '@components/checkbox';
import { debounce, throttle } from 'throttle-debounce';
import { addResizeListener, removeResizeListener } from '@utils/resize-event';
import Mousewheel from '@directives/mousewheel';
import Locale from '@mixins/locale';
import Migrating from '@mixins/migrating';
import { createStore, mapStates } from './store/helper';
import TableLayout from './table-layout';
import TableBody from './table-body';
import TableHeader from './table-header';
import TableFooter from './table-footer';
import { parseHeight } from './util';

let tableIdSeed = 1;

const AlTable = {
  name: 'AlTable',

  mixins: [Locale, Migrating],

  directives: {
    Mousewheel
  },

  props: {
    /**
     * 显示的数据
     */
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * Table 的尺寸
     */
    size: String,

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    /**
     * 列的宽度是否自撑开
     */
    fit: {
      type: Boolean,
      default: true
    },
    /**
     * 是否为斑马纹 table
     */
    stripe: Boolean,
    /**
     * 是否带有纵向边框
     */
    border: Boolean,

    /**
     * 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
     */
    rowKey: [String, Function],

    context: {},
    /**
     * 是否显示表头
     */
    showHeader: {
      type: Boolean,
      default: true
    },

    /**
     * 是否在表尾显示合计行
     */
    showSummary: Boolean,
    /**
     * 合计行第一列的文本
     */
    sumText: String,
    /**
     * 自定义的合计计算方法
     */
    summaryMethod: Function,
    /**
     * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
     */
    rowClassName: [String, Function],
    /**
     * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
     */
    rowStyle: [Object, Function],
    /**
     * 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
     */
    cellClassName: [String, Function],
    /**
     * 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
     */
    cellStyle: [Object, Function],
    /**
     * 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
     */
    headerRowClassName: [String, Function],
    /**
     * 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
     */
    headerRowStyle: [Object, Function],
    /**
     * 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
     */
    headerCellClassName: [String, Function],
    /**
     * 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
     */
    headerCellStyle: [Object, Function],
    /**
     * 是否高亮当前行
     */
    highlightCurrentRow: Boolean,

    /**
     * 当前行的 key，只写属性
     */
    currentRowKey: [String, Number],

    /**
     * 空数据时显示的文本内容，也可以通过 slot="empty" 设置
     */
    emptyText: String,

    /**
     * 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
     */
    expandRowKeys: Array,

    /**
     * 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
     */
    defaultExpandAll: Boolean,

    /**
     * 默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序
     */
    defaultSort: Object,

    /**
     * 	tooltip effect 属性
     */
    tooltipEffect: String,

    /**
     * 合并行或列的计算方法
     */
    spanMethod: Function,

    /**
     * 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行
     */
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },

    /**
     * 展示树形数据时，树节点的缩进
     */
    indent: {
      type: Number,
      default: 16
    },

    /**
     * 渲染嵌套数据的配置选项
     */
    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children'
        };
      }
    },

    /**
     * 是否懒加载子节点数据
     */
    lazy: Boolean,

    /**
     * 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
     */
    load: Function
  },

  components: {
    TableHeader,
    TableFooter,
    TableBody,
    AlCheckbox
  },

  methods: {
    getMigratingConfig() {
      return {
        events: {
          expand: 'expand is renamed to expand-change'
        }
      };
    },

    setCurrentRow(row) {
      this.store.commit('setCurrentRow', row);
    },

    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected, false);
      this.store.updateAllSelected();
    },

    toggleRowExpansion(row, expanded) {
      this.store.toggleRowExpansionAdapter(row, expanded);
    },

    clearSelection() {
      this.store.clearSelection();
    },

    clearFilter(columnKeys) {
      this.store.clearFilter(columnKeys);
    },

    clearSort() {
      this.store.clearSort();
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
      if (this.hoverState) this.hoverState = null;
    },

    updateScrollY() {
      const changed = this.layout.updateScrollY();
      if (changed) {
        this.layout.notifyObservers('scrollable');
        this.layout.updateColumnsWidth();
      }
    },

    handleFixedMousewheel(event, data) {
      const bodyWrapper = this.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (
          data.pixelY > 0 &&
          bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop
        ) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    },

    handleHeaderFooterMousewheel(event, data) {
      const { pixelX, pixelY } = data;
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        this.bodyWrapper.scrollLeft += data.pixelX / 5;
      }
    },

    // TODO 使用 CSS transform
    syncPostion: throttle(20, function() {
      const { scrollLeft, scrollTop, offsetWidth, scrollWidth } = this.bodyWrapper;
      const { headerWrapper, footerWrapper, fixedBodyWrapper, rightFixedBodyWrapper } = this.$refs;
      if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
      if (footerWrapper) footerWrapper.scrollLeft = scrollLeft;
      if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop;
      if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop;
      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
      if (scrollLeft >= maxScrollLeftPosition) {
        this.scrollPosition = 'right';
      } else if (scrollLeft === 0) {
        this.scrollPosition = 'left';
      } else {
        this.scrollPosition = 'middle';
      }
    }),

    bindEvents() {
      this.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true });
      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener);
      }
    },

    unbindEvents() {
      this.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true });
      if (this.fit) {
        removeResizeListener(this.$el, this.resizeListener);
      }
    },

    resizeListener() {
      if (!this.$ready) return;
      let shouldUpdateLayout = false;
      const el = this.$el;
      const { width: oldWidth, height: oldHeight } = this.resizeState;

      const width = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }

      const height = el.offsetHeight;
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width;
        this.resizeState.height = height;
        this.doLayout();
      }
    },

    doLayout() {
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight();
      }
      this.layout.updateColumnsWidth();
    },

    sort(prop, order) {
      this.store.commit('sort', { prop, order });
    },

    toggleAllSelection() {
      this.store.commit('toggleAllSelection');
    }
  },

  computed: {
    tableSize() {
      return this.size || (window.Ale.$ELEMENT || {}).size;
    },

    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },

    shouldUpdateHeight() {
      return (
        this.height ||
        this.maxHeight ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0
      );
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout;
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
    },

    bodyHeight() {
      const { headerHeight = 0, bodyHeight, footerHeight = 0 } = this.layout;
      if (this.height) {
        return {
          height: bodyHeight ? bodyHeight + 'px' : ''
        };
      } else if (this.maxHeight) {
        const maxHeight = parseHeight(this.maxHeight);
        if (typeof maxHeight === 'number') {
          return {
            'max-height': maxHeight - footerHeight - (this.showHeader ? headerHeight : 0) + 'px'
          };
        }
      }
      return {};
    },

    fixedBodyHeight() {
      if (this.height) {
        return {
          height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
        };
      } else if (this.maxHeight) {
        let maxHeight = parseHeight(this.maxHeight);
        if (typeof maxHeight === 'number') {
          maxHeight = this.layout.scrollX ? maxHeight - this.layout.gutterWidth : maxHeight;
          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }
          maxHeight -= this.layout.footerHeight;
          return {
            'max-height': maxHeight + 'px'
          };
        }
      }
      return {};
    },

    fixedHeight() {
      if (this.maxHeight) {
        if (this.showSummary) {
          return {
            bottom: 0
          };
        }
        return {
          bottom: this.layout.scrollX && this.data.length ? this.layout.gutterWidth + 'px' : ''
        };
      } else {
        if (this.showSummary) {
          return {
            height: this.layout.tableHeight ? this.layout.tableHeight + 'px' : ''
          };
        }
        return {
          height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
        };
      }
    },

    emptyBlockStyle() {
      if (this.data && this.data.length) return null;
      let height = '100%';
      if (this.layout.appendHeight) {
        height = `calc(100% - ${this.layout.appendHeight}px)`;
      }
      return {
        width: this.bodyWidth,
        height
      };
    },

    ...mapStates({
      selection: 'selection',
      columns: 'columns',
      tableData: 'data',
      fixedColumns: 'fixedColumns',
      rightFixedColumns: 'rightFixedColumns'
    })
  },

  watch: {
    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value);
      }
    },

    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value);
      }
    },

    currentRowKey: {
      immediate: true,
      handler(value) {
        if (!this.rowKey) return;
        this.store.setCurrentRowKey(value);
      }
    },

    data: {
      immediate: true,
      handler(value) {
        this.store.commit('setData', value);
      }
    },

    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.store.setExpandRowKeysAdapter(newVal);
        }
      }
    }
  },

  created() {
    this.tableId = 'al-table_' + tableIdSeed++;
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },

  mounted() {
    this.bindEvents();
    this.store.updateColumns();
    this.doLayout();

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };

    // init filters
    this.store.states.columns.forEach(column => {
      if (column.filteredValue && column.filteredValue.length) {
        this.store.commit('filterChange', {
          column,
          values: column.filteredValue,
          silent: true
        });
      }
    });

    this.$ready = true;
  },

  destroyed() {
    this.unbindEvents();
  },

  data() {
    const { hasChildren = 'hasChildren', children = 'children' } = this.treeProps;
    this.store = createStore(this, {
      rowKey: this.rowKey,
      defaultExpandAll: this.defaultExpandAll,
      selectOnIndeterminate: this.selectOnIndeterminate,
      // TreeTable 的相关配置
      indent: this.indent,
      lazy: this.lazy,
      lazyColumnIdentifier: hasChildren,
      childrenColumnName: children
    });
    const layout = new TableLayout({
      store: this.store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader
    });
    return {
      layout,
      isHidden: false,
      renderExpanded: null,
      resizeProxyVisible: false,
      resizeState: {
        width: null,
        height: null
      },
      // 是否拥有多级表头
      isGroup: false,
      scrollPosition: 'left'
    };
  }
};

export default AlTable;
</script>
