import AlButton from '@components/button/index';
import AlButtonGroup from '@components/button-group/index';
import AlAutocomplete from '@components/autocomplete/index';
import AlRow from '@components/row/index';
import AlCol from '@components/col/index';
import AlContainer from '@components/container/index';
import AlHeader from '@components/header/index';
import AlAside from '@components/aside/index';
import AlMain from '@components/main/index';
import AlFooter from '@components/footer/index';
import AlIcon from '@components/icon/index';
import AlLink from '@components/link/index';
import AlTag from '@components/tag/index';
import AlRadio from '@components/radio/index';
import AlRadioGroup from '@components/radio-group/index';
import AlRadioButton from '@components/radio-button/index';
import AlCheckbox from '@components/checkbox/index';
import AlCheckboxGroup from '@components/checkbox-group/index';
import AlCheckboxButton from '@components/checkbox-button/index';
import AlInput from '@components/input/index';
import AlInputNumber from '@components/input-number/index';
import AlScrollbar from '@components/scrollbar/index';
import AlSelect from '@components/select/index';
import AlOption from '@components/option/index';
import AlOptionGroup from '@components/option-group/index';
import AlAlert from '@components/alert/index';
import AlSwitch from '@components/switch/index';
import AlForm from '@components/form/index';
import AlFormItem from '@components/form-item/index';

// import AlTable from '@components/table/index';
// import AlTableColumn from '@components/table-column/index';
import AlPagination from '@components/pagination/index';
import { AlMessage, message } from '@components/message/index';
import { AlMessageBox, MessageBox } from '@components/message-box/index';
import AlDropdown from '@components/dropdown/index.js';
import AlDropdownMenu from '@components/dropdown-menu/index.js';
import AlDropdownItem from '@components/dropdown-item/index.js';
import AlPopover from '@components/popover/index.js';
import AlDialog from '@components/dialog/index.js';
import AlTolltip from '@components/tooltip/index.js';
import AlBacktop from '@components/backtop/index.js';
import popoverDirective from '@components/popover/src/directive.js';

const components = [
  AlAlert,
  AlButton,
  AlButtonGroup,
  AlAutocomplete,
  AlRow,
  AlCol,
  AlContainer,
  AlHeader,
  AlAside,
  AlMain,
  AlFooter,
  AlIcon,
  AlLink,
  AlTag,
  AlRadio,
  AlRadioGroup,
  AlRadioButton,
  AlCheckbox,
  AlCheckboxGroup,
  AlCheckboxButton,
  AlInput,
  AlInputNumber,
  AlScrollbar,
  AlSelect,
  AlOption,
  AlOptionGroup,
  AlSwitch,
  AlForm,
  AlFormItem,
  // AlTable,
  // AlTableColumn,
  AlPagination,
  AlMessage,
  AlMessageBox,
  AlDropdown,
  AlDropdownMenu,
  AlDropdownItem,
  AlDialog,
  AlTolltip,
  AlBacktop,
  AlPopover
];

const install = function(app, opts = {}) {
  components.forEach(component => {
    app.component(component.name, component);
  });

  // TODO: 之后进行优化，可以通过 app.config.globalProperties 进行修正
  // Vue.prototype.$ELEMENT = {
  //   size: opts.size || '',
  //   zIndex: opts.zIndex || 2000
  // };
  Ale.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  app.config.globalProperties.$message = message;
  app.config.globalProperties.$msgbox = MessageBox;
  app.config.globalProperties.$alert = MessageBox.alert;
  app.config.globalProperties.$confirm = MessageBox.confirm;
  app.config.globalProperties.$prompt = MessageBox.prompt;

  app.directive('popover', popoverDirective);
};

let Ale = {
  name: 'Ale',
  version: '0.1.0',
  install,
  AlAlert,
  AlButton,
  AlButtonGroup,
  AlAutocomplete,
  AlRow,
  AlCol,
  AlContainer,
  AlHeader,
  AlAside,
  AlMain,
  AlFooter,
  AlIcon,
  AlLink,
  AlTag,
  AlRadio,
  AlRadioGroup,
  AlRadioButton,
  AlCheckbox,
  AlCheckboxGroup,
  AlCheckboxButton,
  AlInput,
  AlInputNumber,
  AlScrollbar,
  AlSelect,
  AlOption,
  AlOptionGroup,
  AlSwitch,
  AlForm,
  AlFormItem,
  // AlTable,
  // AlTableColumn,
  AlPagination,
  AlDropdown,
  AlDropdownMenu,
  AlDropdownItem,
  AlDialog,
  AlTolltip,
  AlBacktop,
  AlPopover,
  message
};

window.Ale = Ale;

export default Ale;
