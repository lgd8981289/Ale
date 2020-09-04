<template>
  <div
    class="al-select"
    :class="[selectSize ? 'al-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose"
  >
    <div
      class="al-select__tags"
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
    >
      <span v-if="collapseTags && selected.length">
        <al-tag
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          type="info"
          @close="deleteTag($event, selected[0])"
          disable-transitions
        >
          <span class="al-select__tags-text">{{ selected[0].currentLabel }}</span>
        </al-tag>
        <al-tag
          v-if="selected.length > 1"
          :closable="false"
          :size="collapseTagSize"
          type="info"
          disable-transitions
        >
          <span class="al-select__tags-text">+ {{ selected.length - 1 }}</span>
        </al-tag>
      </span>
      <span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <al-tag
            v-for="item in selected"
            :key="getValueKey(item)"
            :closable="!selectDisabled"
            :size="collapseTagSize"
            :hit="item.hitState"
            type="info"
            @close="deleteTag($event, item)"
            disable-transitions
          >
            <span class="al-select__tags-text">{{ item.currentLabel }}</span>
          </al-tag>
        </transition-group>
      </span>

      <input
        type="text"
        class="al-select__input"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :autocomplete="autoComplete || autocomplete"
        @focus="handleFocus"
        @blur="softFocus = false"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        v-model="query"
        @input="debouncedQueryChange"
        v-if="filterable"
        :style="{
          'flex-grow': '1',
          width: inputLength / (inputWidth - 32) + '%',
          'max-width': inputWidth - 42 + 'px'
        }"
        ref="input"
      />
    </div>
    <al-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :autocomplete="autoComplete || autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : null"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.down.stop.prevent="navigateOptions('next')"
      @keydown.up.stop.prevent="navigateOptions('prev')"
      @keydown.enter.prevent="selectOption"
      @keydown.esc.stop.prevent="visible = false"
      @keydown.tab="visible = false"
      @paste="debouncedOnInputChange"
      @keyup="debouncedOnInputChange"
      @mouseenter="inputHovering = true"
      @mouseleave="inputHovering = false"
    >
      <template v-slot:prefix v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template v-slot:suffix>
        <i
          v-show="!showClose"
          :class="['al-select__caret', 'al-input__icon', 'al-icon-' + iconClass]"
        ></i>
        <i
          v-if="showClose"
          class="al-select__caret al-input__icon al-icon-circle-close"
          @click="handleClearClick"
        ></i>
      </template>
    </al-input>
    <transition name="al-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <al-select-menu
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="visible && emptyText !== false"
      >
        <al-scrollbar
          tag="ul"
          wrap-class="al-select-dropdown__wrap"
          view-class="al-select-dropdown__list"
          ref="scrollbar"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading"
        >
          <al-option :value="query" created v-if="showNewOption"> </al-option>
          <slot></slot>
        </al-scrollbar>
        <template
          v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0))"
        >
          <slot name="empty" v-if="$slots.empty"></slot>
          <p class="al-select-dropdown__empty" v-else>
            {{ emptyText }}
          </p>
        </template>
      </al-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
import { $alEmit, $alOn } from '@mixins/emitter';
import { getInject } from '@form/formInject';
import Focus from '@mixins/focus';
import Locale from '@mixins/locale';
import AlInput from '@components/input';
import AlOption from '@components/option';
import AlSelectMenu from './select-dropdown';
import AlTag from '@components/tag';
import AlScrollbar from '@components/scrollbar';
import { debounce } from 'throttle-debounce';
import Clickoutside from '@utils/clickoutside';
import { addResizeListener, removeResizeListener } from '@utils/resize-event';
import { t } from '@locale';
import scrollIntoView from '@utils/scroll-into-view';
import { getValueByPath, valueEquals, isIE, isEdge } from '@utils/util';
import NavigationMixin from '@mixins/navigation-mixin';
import { isKorean } from '@utils/shared';
import { defineComponent, ref, provide, inject } from 'vue';

function initInject() {
  let alFormItemFormChangeSymbol = inject('alFormItem-formChangeSymbol', Symbol());
  return {
    ...getInject(),
    alFormItemFormChangeSymbol
  };
}

function initMitt() {
  const alSelectDropdownDestroyPopperSymbol = Symbol('alSelectDropdown-destroyPopper');
  const alSelectDropdownUpdatePopperSymbol = Symbol('alSelectDropdown-updatePopper');
  const alOptionQueryChangeSymbol = Symbol('alOption-queryChange');
  const alOptionGroupQueryChangeSymbol = Symbol('alOptionGroup-queryChange');
  const alSelectHandleOptionClickSymbol = Symbol('alSelect-handleOptionClick');
  const alSelectSetSelectedSymbol = Symbol('alSelect-setSelected');

  provide('alSelectDropdown-destroyPopper', alSelectDropdownDestroyPopperSymbol);
  provide('alSelectDropdown-updatePopper', alSelectDropdownUpdatePopperSymbol);
  provide('alOption-queryChange', alOptionQueryChangeSymbol);
  provide('alOptionGroup-queryChange', alOptionGroupQueryChangeSymbol);
  provide('alSelect-handleOptionClick', alSelectHandleOptionClickSymbol);
  provide('alSelect-setSelected', alSelectSetSelectedSymbol);

  return {
    alSelectDropdownDestroyPopperSymbol,
    alSelectDropdownUpdatePopperSymbol,
    alOptionQueryChangeSymbol,
    alOptionGroupQueryChangeSymbol,
    alSelectHandleOptionClickSymbol,
    alSelectSetSelectedSymbol
  };
}

function initData(props) {
  let options = ref([]);
  let cachedOptions = ref([]);
  let createdLabel = ref(null);
  let createdSelected = ref(false);
  let selected = props.multiple ? ref([]) : ref({});
  let inputLength = ref(20);
  let inputWidth = ref(0);
  let initialInputHeight = ref(0);
  let cachedPlaceHolder = ref('');
  let optionsCount = ref(0);
  let filteredOptionsCount = ref(0);
  let visible = ref(false);
  let softFocus = ref(false);
  let selectedLabel = ref('');
  let hoverIndex = ref(-1);
  let query = ref('');
  let previousQuery = ref(null);
  let inputHovering = ref(false);
  let currentPlaceholder = ref('');
  let menuVisibleOnFocus = ref(false);
  let isOnComposition = ref(false);
  let isSilentBlur = ref(false);
  return {
    options,
    cachedOptions,
    createdLabel,
    createdSelected,
    selected,
    inputLength,
    inputWidth,
    initialInputHeight,
    cachedPlaceHolder,
    optionsCount,
    filteredOptionsCount,
    visible,
    softFocus,
    selectedLabel,
    hoverIndex,
    query,
    previousQuery,
    inputHovering,
    currentPlaceholder,
    menuVisibleOnFocus,
    isOnComposition,
    isSilentBlur
  };
}

const AlSelect = defineComponent({
  mixins: [Locale, Focus('reference'), NavigationMixin],

  name: 'AlSelect',

  componentName: 'AlSelect',

  components: {
    AlInput,
    AlSelectMenu,
    AlOption,
    AlTag,
    AlScrollbar
  },

  directives: { Clickoutside },

  provide() {
    return {
      select: this
    };
  },

  props: {
    id: String,
    /**
     * select input 的 name 属性
     */
    name: String,
    /**
     * 绑定值
     */
    modelValue: {
      type: [String, Number, Boolean, Array],
      required: true
    },
    /**
     * select input 的 autocomplete 属性
     */
    autocomplete: {
      type: String,
      default: 'off'
    },
    /**
     * TODO: 同时保留
     */
    autoComplete: {
      type: String,
      default: 'off'
    },
    /**
     * 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
     */
    automaticDropdown: Boolean,
    /**
     * 输入框尺寸
     */
    size: {
      type: String
    },
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 是否可以清空选项
     */
    clearable: Boolean,
    /**
     * 是否可搜索
     */
    filterable: Boolean,
    /**
     * 是否允许用户创建新条目，需配合 filterable 使用
     */
    allowCreate: Boolean,
    /**
     * 是否正在从远程获取数据
     */
    loading: Boolean,
    /**
     * Select 下拉框的类名
     */
    popperClass: String,
    /**
     * 是否为远程搜索
     */
    remote: Boolean,
    /**
     * 远程加载时显示的文字
     */
    loadingText: String,
    /**
     * 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置
     */
    // TODO: 国际化
    noMatchText: {
      type: String,
      default: '无匹配数据'
    },
    /**
     * 选项为空时显示的文字，也可以使用slot="empty"设置
     */
    // TODO: 国际化
    noDataText: {
      type: String,
      default: '无匹配数据'
    },
    /**
     * 远程搜索方法
     */
    remoteMethod: Function,
    /**
     * 自定义搜索方法
     */
    filterMethod: Function,
    /**
     * 是否多选
     */
    multiple: Boolean,
    /**
     * 多选时用户最多可以选择的项目数，为 0 则不限制
     */
    multipleLimit: {
      type: Number,
      default: 0
    },
    /**
     * 占位符
     */
    placeholder: {
      type: String,
      default() {
        return t('al.select.placeholder');
      }
    },
    /**
     * 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
     */
    defaultFirstOption: Boolean,
    /**
     * 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
     */
    reserveKeyword: Boolean,
    /**
     * 作为 value 唯一标识的键名，绑定值为对象类型时必填
     */
    valueKey: {
      type: String,
      default: 'value'
    },
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags: Boolean,
    /**
     * 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
     */
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },

  emits: {
    'update:modelValue': null,
    'visible-change': null,
    'remove-tag': null,
    change: null,
    focus: null,
    blur: null,
    clear: null
  },

  setup(props, { slots }) {
    initMitt();

    return {
      ...initInject(),
      ...initData(props),
      ...initMitt()
    };
  },

  computed: {
    _alFormItemSize() {
      return (this.alFormItem || {}).alFormItemSize;
    },

    readonly() {
      return !this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible);
    },

    showClose() {
      let hasValue = this.multiple
        ? Array.isArray(this.modelValue) && this.modelValue.length > 0
        : this.modelValue !== undefined && this.modelValue !== null && this.modelValue !== '';
      let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
      return criteria;
    },

    iconClass() {
      return this.remote && this.filterable
        ? ''
        : this.visible
        ? 'arrow-up is-reverse'
        : 'arrow-up';
    },

    debounce() {
      return this.remote ? 300 : 0;
    },

    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('al.select.loading');
      } else {
        if (this.remote && this.query === '' && this.options.length === 0) return false;
        if (
          this.filterable &&
          this.query &&
          this.options.length > 0 &&
          this.filteredOptionsCount === 0
        ) {
          return this.noMatchText || this.t('al.select.noMatch');
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t('al.select.noData');
        }
      }
      return null;
    },

    showNewOption() {
      let hasExistingOption = this.options
        .filter(option => !option.created)
        .some(option => option.currentLabel === this.query);
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
    },

    selectSize() {
      return this.size || this._alFormItemSize || (window.Ale.$ELEMENT || {}).size;
    },

    selectDisabled() {
      return this.disabled || (this.alForm || {}).disabled;
    },

    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small';
    }
  },

  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },
    modelValue(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight();
        if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
          this.currentPlaceholder = '';
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = '';
          this.handleQueryChange(this.query);
        }
      }
      this.setSelected();
      if (this.filterable && !this.multiple) {
        this.inputLength = 20;
      }
      if (!valueEquals(val, oldVal)) {
        // TODO: this.dispatch('AlFormItem', 'al.form.change', val);
        $alEmit(this.alFormItemFormChangeSymbol, val);
      }
    },
    visible(val) {
      if (!val) {
        // TODO: this.broadcast(this.emitter, 'AlSelectDropdown', 'destroyPopper');
        $alEmit(this.alSelectDropdownDestroyPopperSymbol);
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.query = '';
        this.previousQuery = null;
        this.selectedLabel = '';
        this.inputLength = 20;
        this.menuVisibleOnFocus = false;
        this.resetHoverIndex();
        this.$nextTick(() => {
          if (this.$refs.input && this.$refs.input.value === '' && this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate && this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel;
            } else {
              this.selectedLabel = this.selected.currentLabel;
            }
            if (this.filterable) this.query = this.selectedLabel;
          }
          if (this.filterable) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
      } else {
        // TODO: this.broadcast(this.emitter, 'AlSelectDropdown', 'updatePopper');
        $alEmit(this.alSelectDropdownUpdatePopperSymbol, this.visible);
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel;
          this.handleQueryChange(this.query);
          if (this.multiple) {
            this.$refs.input.focus();
          } else {
            if (!this.remote) {
              // TODO: this.broadcast(this.emitter, 'AlOption', 'queryChange', '');
              // TODO: this.broadcast(this.emitter, 'AlOptionGroup', 'queryChange');
              $alEmit(this.alOptionQueryChangeSymbol);
              $alEmit(this.alOptionGroupQueryChangeSymbol);
            }
            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel;
              this.selectedLabel = '';
            }
          }
        }
      }
      this.$emit('visible-change', val);
    },
    options() {
      if (this.$isServer) return;
      this.$nextTick(() => {
        // TODO: this.broadcast(this.emitter, 'AlSelectDropdown', 'updatePopper');
        $alEmit(this.alSelectDropdownUpdatePopperSymbol, this.visible);
      });
      if (this.multiple) {
        this.resetInputHeight();
      }
      let inputs = this.$el.querySelectorAll('input');
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }
      if (
        this.defaultFirstOption &&
        (this.filterable || this.remote) &&
        this.filteredOptionsCount
      ) {
        this.checkDefaultFirstOption();
      }
    }
  },

  methods: {
    handleComposition(event) {
      const text = event.target.value;
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.$nextTick(_ => this.handleQueryChange(text));
      } else {
        const lastCharacter = text[text.length - 1] || '';
        this.isOnComposition = !isKorean(lastCharacter);
      }
    },
    handleQueryChange(val) {
      if (this.previousQuery === val || this.isOnComposition) return;
      if (
        this.previousQuery === null &&
        (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')
      ) {
        this.previousQuery = val;
        return;
      }
      this.previousQuery = val;
      this.$nextTick(() => {
        if (this.visible) {
          // TODO: this.broadcast(this.emitter, 'AlSelectDropdown', 'updatePopper');
          $alEmit(this.alSelectDropdown);
        }
      });
      this.hoverIndex = -1;
      if (this.multiple && this.filterable) {
        this.$nextTick(() => {
          const length = this.$refs.input.value.length * 15 + 20;
          this.inputLength = this.collapseTags ? Math.min(50, length) : length;
          this.managePlaceholder();
          this.resetInputHeight();
        });
      }
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.hoverIndex = -1;
        this.remoteMethod(val);
      } else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val);
        // TODO: this.broadcast(this.emitter, 'AlOptionGroup', 'queryChange');
        $alEmit(this.alOptionGroupQueryChangeSymbol);
      } else {
        this.filteredOptionsCount = this.optionsCount;
        // TODO: this.broadcast(this.emitter, 'AlOption', 'queryChange', val);
        $alEmit(this.alOptionQueryChangeSymbol, val);
        // TODO: this.broadcast(this.emitter, 'AlOptionGroup', 'queryChange');
        $alEmit(this.alOptionGroupQueryChangeSymbol);
      }
      if (
        this.defaultFirstOption &&
        (this.filterable || this.remote) &&
        this.filteredOptionsCount
      ) {
        this.checkDefaultFirstOption();
      }
    },

    scrollToOption(option) {
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector('.al-select-dropdown__wrap');
        scrollIntoView(menu, target);
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
    },

    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected));
    },

    emitChange(val) {
      if (!valueEquals(this.modelValue, val)) {
        this.$emit('change', val);
      }
    },

    getOption(value) {
      let option;
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]';
      const isUndefined =
        Object.prototype.toString.call(value).toLowerCase() === '[object undefined]';

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) ===
            getValueByPath(value, this.valueKey)
          : cachedOption.value === value;
        if (isEqual) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      const label = !isObject && !isNull && !isUndefined ? value : '';
      let newOption = {
        value: value,
        currentLabel: label,
        hitState: false
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },

    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.modelValue);
        if (option.created) {
          this.createdLabel = option.currentLabel;
          this.createdSelected = true;
        } else {
          this.createdSelected = false;
        }
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        if (this.filterable) this.query = this.selectedLabel;
        return;
      }
      let result = [];
      if (Array.isArray(this.modelValue)) {
        this.modelValue.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          this.visible = true;
          if (this.filterable) {
            this.menuVisibleOnFocus = true;
          }
        }
        this.$emit('focus', event);
      } else {
        this.softFocus = false;
      }
    },

    blur() {
      this.visible = false;
      this.$refs.reference.blur();
    },

    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false;
        } else {
          this.$emit('blur', event);
        }
      }, 50);
      this.softFocus = false;
    },

    handleClearClick(event) {
      this.deleteSelected(event);
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    handleClose() {
      this.visible = false;
    },

    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) return;
      const option = this.selected[this.selected.length - 1];
      if (!option) return;

      if (hit === true || hit === false) {
        option.hitState = hit;
        return hit;
      }

      option.hitState = !option.hitState;
      return option.hitState;
    },

    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.modelValue.slice();
        value.pop();
        this.$emit('update:modelValue', value);
        this.emitChange(value);
      }
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },

    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },

    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const sizeInMap = this.initialInputHeight || 40;
        input.style.height =
          this.selected.length === 0
            ? sizeInMap + 'px'
            : Math.max(
                tags ? tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0) : 0,
                sizeInMap
              ) + 'px';
        if (this.visible && this.emptyText !== false) {
          // TODO: this.broadcast(this.emitter, 'AlSelectDropdown', 'updatePopper');
          $alEmit(this.alSelectDropdownUpdatePopperSymbol, this.visible);
        }
      });
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(
              null,
              this.selected.map(item => this.options.indexOf(item))
            );
          } else {
            this.hoverIndex = -1;
          }
        }
      }, 300);
    },

    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        const value = (this.modelValue || []).slice();
        const optionIndex = this.getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value);
        }
        this.$emit('update:modelValue', value);
        this.emitChange(value);
        if (option.created) {
          this.query = '';
          this.handleQueryChange('');
          this.inputLength = 20;
        }
        if (this.filterable) this.$refs.input.focus();
      } else {
        this.$emit('update:modelValue', option.value);
        this.emitChange(option.value);
        this.visible = false;
      }
      this.isSilentBlur = byClick;
      this.setSoftFocus();
      if (this.visible) return;
      this.$nextTick(() => {
        this.scrollToOption(option);
      });
    },

    setSoftFocus() {
      this.softFocus = true;
      const input = this.$refs.input || this.$refs.reference;
      if (input) {
        input.focus();
      }
    },

    getValueIndex(arr = [], value) {
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      if (!isObject) {
        return arr.indexOf(value);
      } else {
        const valueKey = this.valueKey;
        let index = -1;
        arr.some((item, i) => {
          if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
    },

    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false;
        } else {
          this.visible = !this.visible;
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus();
        }
      }
    },

    selectOption() {
      if (!this.visible) {
        this.toggleMenu();
      } else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      }
    },

    deleteSelected(event) {
      event.stopPropagation();
      const value = this.multiple ? [] : '';
      this.$emit('update:modelValue', value);
      this.emitChange(value);
      this.visible = false;
      this.$emit('clear');
    },

    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1 && !this.selectDisabled) {
        const value = this.modelValue.slice();
        value.splice(index, 1);
        this.$emit('update:modelValue', value);
        this.emitChange(value);
        this.$emit('remove-tag', tag.value);
      }
      event.stopPropagation();
    },

    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel;
        this.handleQueryChange(this.query);
      }
    },

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        this.options.splice(index, 1);
      }
    },

    resetInputWidth() {
      // TODO: 临时方案
      // this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      this.inputWidth = this.$refs.reference
        ? this.$refs.reference.$el.getBoundingClientRect().width
        : window.Ale.$ELEMENT;
    },

    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },

    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      // highlight the created option
      let hasCreated = false;
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true;
          this.hoverIndex = i;
          break;
        }
      }
      if (hasCreated) return;
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i];
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i;
            break;
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = i;
            break;
          }
        }
      }
    },

    getValueKey(item) {
      if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
        return item.value;
      } else {
        return getValueByPath(item.value, this.valueKey);
      }
    }
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    if (this.multiple && !Array.isArray(this.modelValue)) {
      this.$emit('update:modelValue', []);
    }
    if (!this.multiple && Array.isArray(this.modelValue)) {
      this.$emit('update:modelValue', '');
    }

    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange();
    });

    this.debouncedQueryChange = debounce(this.debounce, e => {
      this.handleQueryChange(e.target.value);
    });

    $alOn(this.alSelectHandleOptionClickSymbol, this.handleOptionSelect);
    $alOn(this.alSelectSetSelectedSymbol, this.setSelected);
  },

  mounted() {
    if (this.multiple && Array.isArray(this.modelValue) && this.modelValue.length > 0) {
      this.currentPlaceholder = '';
    }

    addResizeListener(this.$el, this.handleResize);

    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    if (this.remote && this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setSelected();
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  }
});

export default AlSelect;
</script>
