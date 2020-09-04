import { PluginObject } from './plugin';
import { AleUIComponent, AleUIComponentSize, AleUIHorizontalAlignment } from './component';

import { AlAlert } from './alert';
import { AlAside } from './aside';
import { AlAutocomplete } from './autocomplete';
import { AlBadge } from './badge';
import { AlBreadcrumb } from './breadcrumb';
import { AlBreadcrumbItem } from './breadcrumb-item';
import { AlButton } from './button';
import { AlButtonGroup } from './button-group';
import { AlCard } from './card';
import { AlCarousel } from './carousel';
import { AlCarouselItem } from './carousel-item';
import { AlCascader } from './cascader';
import { AlCheckbox } from './checkbox';
import { AlCheckboxButton } from './checkbox-button';
import { AlCheckboxGroup } from './checkbox-group';
import { AlCol } from './col';
import { AlCollapse } from './collapse';
import { AlCollapseItem } from './collapse-item';
import { AlColorPicker } from './color-picker';
import { AlContainer } from './container';
import { AlDatePicker } from './date-picker';
import { AlDialog } from './dialog';
import { AlDropdown } from './dropdown';
import { AlDropdownItem } from './dropdown-item';
import { AlDropdownMenu } from './dropdown-menu';
import { AlFooter } from './footer';
import { AlForm } from './form';
import { AlFormItem } from './form-item';
import { AlHeader } from './header';
import { AlInput } from './input';
import { AlInputNumber } from './input-number';
import { AlLoading } from './loading';
import { AlMain } from './main';
import { AlMenu } from './menu';
import { AlMenuItem } from './menu-item';
import { AlMenuItemGroup } from './menu-item-group';
import { AlMessage } from './message';
import { AlMessageBox } from './message-box';
import { AlNotification } from './notification';
import { AlOption } from './option';
import { AlOptionGroup } from './option-group';
import { AlPagination } from './pagination';
import { AlPopover } from './popover';
import { AlProgress } from './progress';
import { AlRate } from './rate';
import { AlRadio } from './radio';
import { AlRadioButton } from './radio-button';
import { AlRadioGroup } from './radio-group';
import { AlRow } from './row';
import { AlSelect } from './select';
import { AlSlider } from './slider';
import { AlStep } from './step';
import { AlSteps } from './steps';
import { AlSubmenu } from './submenu';
import { AlSwitch } from './switch';
import { AlTable } from './table';
import { AlTableColumn } from './table-column';
import { AlTag } from './tag';
import { AlTabs } from './tabs';
import { AlTabPane } from './tab-pane';
import { AlTimeline } from './timeline';
import { AlTimelineItem } from './timeline-item';
import { AlTimePicker } from './time-picker';
import { AlTimeSelect } from './time-select';
import { AlTooltip } from './tooltip';
import { AlTransfer } from './transfer';
import { AlTree, TreeData } from './tree';
import { AlUpload } from './upload';
import { AlLink } from './link';
import { AlDivider } from './divider';
import { AlIcon } from './icon';
import { AlCalendar } from './calendar';
import { AlImage } from './image';
import { AlBacktop } from './backtop';
import { AlInfiniteScroll } from './infinite-scroll';
import { AlPageHeader } from './page-header';
import { AlAvatar } from './avatar';
import { AlDrawer } from './drawer';
import { AlPopconfirm } from './popconfirm';

export interface InstallationOptions {
  locale: any;
  i18n: any;
  size: string;
}

/** The version of ale-ui */
export const version: string;

/**
 * Install all ale-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(AleUI)` to install.
 */
export function install(vue: typeof any, options: InstallationOptions): void;

/** AleUI component common definition */
export type Component = AleUIComponent;

/** Component size definition for button, input, etc */
export type ComponentSize = AleUIComponentSize;

/** Horizontal alignment */
export type HorizontalAlignment = AleUIHorizontalAlignment;

/** Show animation while loading data */
export const Loading: AlLoading;

/** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
export const Message: AlMessage;

/** A set of modal boxes simulating system message box, mainly for message prompt, success tips, error messages and query information */
export const MessageBox: AlMessageBox;

/** Displays a global notification message at the upper right corner of the page */
export const Notification: AlNotification;

// TS cannot merge imported class with namespace, so declare subclasses instead

/** Alert Component */
export class Alert extends AlAlert {}

/** Aside Component */
export class Aside extends AlAside {}

/** Autocomplete Component */
export class Autocomplete extends AlAutocomplete {}

/** Bagde Component */
export class Badge extends AlBadge {}

/** Breadcrumb Component */
export class Breadcrumb extends AlBreadcrumb {}

/** Breadcrumb Item Component */
export class BreadcrumbItem extends AlBreadcrumbItem {}

/** Button Component */
export class Button extends AlButton {}

/** Button Group Component */
export class ButtonGroup extends AlButtonGroup {}

/** Card Component */
export class Card extends AlCard {}

/** Cascader Component */
export class Cascader extends AlCascader {}

/** Carousel Component */
export class Carousel extends AlCarousel {}

/** Carousel Item Component */
export class CarouselItem extends AlCarouselItem {}

/** Checkbox Component */
export class Checkbox extends AlCheckbox {}

/** Checkbox Button Component */
export class CheckboxButton extends AlCheckboxButton {}

/** Checkbox Group Component */
export class CheckboxGroup extends AlCheckboxGroup {}

/** Colunm Layout Component */
export class Col extends AlCol {}

/** Collapse Component */
export class Collapse extends AlCollapse {}

/** Collapse Item Component */
export class CollapseItem extends AlCollapseItem {}

/** Color Picker Component */
export class ColorPicker extends AlColorPicker {}

/** Container Component */
export class Container extends AlContainer {}

/** Date Picker Component */
export class DatePicker extends AlDatePicker {}

/** Dialog Component */
export class Dialog extends AlDialog {}

/** Dropdown Component */
export class Dropdown extends AlDropdown {}

/** Dropdown Item Component */
export class DropdownItem extends AlDropdownItem {}

/** Dropdown Menu Component */
export class DropdownMenu extends AlDropdownMenu {}

/** Footer Component */
export class Footer extends AlFooter {}

/** Form Component */
export class Form extends AlForm {}

/** Form Item Component */
export class FormItem extends AlFormItem {}

/** Header Component */
export class Header extends AlHeader {}

/** Input Component */
export class Input extends AlInput {}

/** Input Number Component */
export class InputNumber extends AlInputNumber {}

/** Main Component */
export class Main extends AlMain {}

/** Menu that provides navigation for your website */
export class Menu extends AlMenu {}

/** Menu Item Component */
export class MenuItem extends AlMenuItem {}

/** Menu Item Group Component */
export class MenuItemGroup extends AlMenuItemGroup {}

/** Dropdown Select Option Component */
export class Option extends AlOption {}

/** Dropdown Select Option Group Component */
export class OptionGroup extends AlOptionGroup {}

/** Pagination Component */
export class Pagination extends AlPagination {}

/** Popover Component */
export class Popover extends AlPopover {}

/** Progress Component */
export class Progress extends AlProgress {}

/** Rate Component */
export class Rate extends AlRate {}

/** Radio Component */
export class Radio extends AlRadio {}

/** Radio Button Component */
export class RadioButton extends AlRadioButton {}

/** Radio Group Component */
export class RadioGroup extends AlRadioGroup {}

/** Row Layout Component */
export class Row extends AlRow {}

/** Dropdown Select Component */
export class Select extends AlSelect {}

/** Slider Component */
export class Slider extends AlSlider {}

/** Step Component */
export class Step extends AlStep {}

/** Steps Component */
export class Steps extends AlSteps {}

/** Submenu Component */
export class Submenu extends AlSubmenu {}

/** Switch Component */
export class Switch extends AlSwitch {}

/** Table Component */
export class Table extends AlTable {}

/** Table Column Component */
export class TableColumn extends AlTableColumn {}

/** Tabs Component */
export class Tabs extends AlTabs {}

/** Tab Pane Component */
export class TabPane extends AlTabPane {}

/** Tag Component */
export class Tag extends AlTag {}

/** Timeline Component */
export class Timeline extends AlTimeline {}

/** Timeline Item Component */
export class TimelineItem extends AlTimelineItem {}

/** TimePicker Component */
export class TimePicker extends AlTimePicker {}

/** TimeSelect Component */
export class TimeSelect extends AlTimeSelect {}

/** Tooltip Component */
export class Tooltip extends AlTooltip {}

/** Transfer Component */
export class Transfer extends AlTransfer {}

/** Tree Component */
export class Tree<K = any, D = TreeData> extends AlTree<K, D> {}

/** Upload Component */
export class Upload extends AlUpload {}

/** Divider Component */
export class Divider extends AlDivider {}

/** Link Component */
export class Link extends AlLink {}

/** Image Component */
export class Image extends AlImage {}

/** Icon Component */
export class Icon extends AlIcon {}

/** Calendar Component */
export class Calendar extends AlCalendar {}

/** Backtop Component */
export class Backtop extends AlBacktop {}

/** InfiniteScroll Directive */
export const InfiniteScroll: PluginObject<AlInfiniteScroll>;

/** PageHeader Component */
export class PageHeader extends AlPageHeader {}

/** Avatar Component */
export class Avatar extends AlAvatar {}

/** Drawer Component */
export class Drawer extends AlDrawer {}

/** Popconfirm Component */
export class Popconfirm extends AlPopconfirm {}
