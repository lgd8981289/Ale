<style lang="scss">
.component-preview {
  padding-right: 10px;
  &:last-of-type {
    padding-bottom: 20px;
  }
  h4 {
    font-size: 20px;
    margin: 40px 0 20px;
    color: #909399;
  }
  .demo-item {
    margin-top: 10px;
    margin-right: 40px;
  }

  .demo-line {
    margin: 15px 0;
  }

  .al-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .al-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .al-avatar:not(:last-child) {
    margin-right: 20px;
  }

  .avatar-demo {
    display: flex;
    align-items: center;
  }
}
</style>
<template>
  <div class="component-preview">
    <h4>Button</h4>
    <al-row class="demo-line">
      <al-button>Default</al-button>
      <al-button type="primary">Primary</al-button>
      <al-button type="success">Success</al-button>
      <al-button type="info">Info</al-button>
      <al-button type="warning">Warning</al-button>
      <al-button type="danger">Danger</al-button>
    </al-row>
    <al-row class="demo-line">
      <al-button plain>Plain</al-button>
      <al-button type="primary" plain>Primary</al-button>
      <al-button type="success" plain>Success</al-button>
      <al-button type="info" plain>Info</al-button>
      <al-button type="warning" plain>Warning</al-button>
      <al-button type="danger" plain>Danger</al-button>
    </al-row>
    <al-row class="demo-line">
      <al-button round>Round</al-button>
      <al-button type="primary" round>Primary</al-button>
      <al-button type="success" round>Success</al-button>
      <al-button type="info" round>Info</al-button>
      <al-button type="warning" round>Warning</al-button>
      <al-button type="danger" round>Danger</al-button>
    </al-row>
    <al-row class="demo-line">
      <al-button icon="al-icon-search" circle></al-button>
      <al-button type="primary" icon="al-icon-edit" circle></al-button>
      <al-button type="success" icon="al-icon-check" circle></al-button>
      <al-button type="info" icon="al-icon-message" circle></al-button>
      <al-button type="warning" icon="al-icon-star-off" circle></al-button>
      <al-button type="danger" icon="al-icon-delete" circle></al-button>
    </al-row>
    <al-row class="demo-line">
      <al-button>Default</al-button>
      <al-button size="medium">Medium</al-button>
      <al-button size="small">Small</al-button>
      <al-button size="mini">Mini</al-button>
    </al-row>
    <h4>Radio</h4>
    <al-row class="demo-line">
      <al-radio v-model="radio" label="1">Option A</al-radio>
      <al-radio v-model="radio" label="2">Option B</al-radio>
    </al-row>
    <al-row class="demo-line">
      <al-radio-group v-model="radio1">
        <al-radio-button label="New York"></al-radio-button>
        <al-radio-button label="Washington"></al-radio-button>
        <al-radio-button label="Los Angeles"></al-radio-button>
        <al-radio-button label="Chicago"></al-radio-button>
      </al-radio-group>
    </al-row>
    <al-row class="demo-line">
      <al-radio v-model="radio2" label="1" border>Option A</al-radio>
      <al-radio v-model="radio2" label="2" border>Option B</al-radio>
    </al-row>
    <h4>Checkbox</h4>
    <al-row class="demo-line">
      <al-checkbox v-model="checked">Option</al-checkbox>
    </al-row>
    <al-row class="demo-line">
      <al-checkbox-group v-model="checked1">
        <al-checkbox-button
          v-for="city in ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']"
          :label="city"
          :key="city"
          >{{ city }}</al-checkbox-button
        >
      </al-checkbox-group>
    </al-row>
    <al-row class="demo-line">
      <al-checkbox v-model="checked2" label="Option1" border></al-checkbox>
    </al-row>
    <h4>Input</h4>
    <al-row style="width: 180px">
      <al-input placeholder="Please input" v-model="input"></al-input>
    </al-row>
    <h4>InputNumber</h4>
    <al-row>
      <al-input-number v-model="inputNumber" :min="1" :max="10"></al-input-number>
    </al-row>
    <h4>Select</h4>
    <al-row>
      <al-select v-model="selectValue" placeholder="Select">
        <al-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></al-option>
      </al-select>
    </al-row>
    <h4>Cascader</h4>
    <al-row>
      <al-cascader :options="cascadeOptions" v-model="cascaderValue"></al-cascader>
    </al-row>
    <h4>Switch</h4>
    <al-row>
      <al-switch v-model="switchValue"></al-switch>
      <al-switch
        style="margin-left: 40px"
        v-model="switchValue"
        active-text="Pay by month"
        inactive-text="Pay by year"
      >
      </al-switch>
    </al-row>
    <h4>Slider</h4>
    <al-row style="width: 380px">
      <al-slider v-model="slider"></al-slider>
    </al-row>
    <h4>DatePicker</h4>
    <al-row>
      <al-date-picker v-model="datePicker" type="date"></al-date-picker>
    </al-row>
    <h4>Rate</h4>
    <al-row>
      <al-rate class="demo-line" v-model="rate"></al-rate>
      <al-rate
        class="demo-line"
        v-model="rate"
        show-score
        text-color="#ff9900"
        score-template="{value} points"
      >
      </al-rate>
    </al-row>
    <h4>Transfer</h4>
    <al-row>
      <al-transfer v-model="transfer" filterable :data="transferData">
        <al-button class="transfer-footer" slot="left-footer" size="small">Operation</al-button>
        <al-button class="transfer-footer" slot="right-footer" size="small">Operation</al-button>
      </al-transfer>
    </al-row>
    <h4>Table</h4>
    <al-row>
      <al-table :data="tableData" style="width: 70%">
        <al-table-column prop="date" label="Date" width="180"></al-table-column>
        <al-table-column prop="name" label="Name" width="180"></al-table-column>
        <al-table-column prop="address" label="Address"></al-table-column>
      </al-table>
    </al-row>
    <h4>Tag</h4>
    <al-row>
      <al-tag class="demo-item" closable>Tag One</al-tag>
      <al-tag class="demo-item" closable type="success">Tag Two</al-tag>
      <al-tag class="demo-item" closable type="info">Tag Three</al-tag>
      <al-tag class="demo-item" closable type="warning">Tag Four</al-tag>
      <al-tag class="demo-item" closable type="danger">Tag Five</al-tag>
    </al-row>
    <h4>Progress</h4>
    <al-row style="width: 380px">
      <al-progress :percentage="20"></al-progress>
      <al-progress :percentage="60" status="exception"></al-progress>
      <al-progress :percentage="100" status="success"></al-progress>
    </al-row>
    <h4>Tree</h4>
    <al-row style="width: 380px">
      <al-tree :data="treeData" :props="defaultTreeProps"></al-tree>
    </al-row>
    <h4>Pagination</h4>
    <al-row>
      <al-pagination layout="prev, pager, next" :total="1000"></al-pagination>
    </al-row>
    <h4>Badge</h4>
    <al-row>
      <al-badge :value="12" class="demo-item">
        <al-button size="small">comments</al-button>
      </al-badge>
      <al-badge :value="3" class="demo-item">
        <al-button size="small">replies</al-button>
      </al-badge>
      <al-badge :value="1" class="demo-item" type="primary">
        <al-button size="small">comments</al-button>
      </al-badge>
      <al-badge :value="2" class="demo-item" type="warning">
        <al-button size="small">replies</al-button>
      </al-badge>
    </al-row>
    <h4>Alert</h4>
    <al-row style="width: 380px">
      <al-alert class="demo-item" title="success alert" type="success" show-icon></al-alert>
      <al-alert
        class="demo-item"
        title="info alert"
        type="info"
        close-text="Gotcha"
        show-icon
      ></al-alert>
      <al-alert class="demo-item" title="warning alert" type="warning" show-icon></al-alert>
      <al-alert
        class="demo-item"
        title="error alert"
        type="error"
        description="more text description"
        show-icon
      >
      </al-alert>
    </al-row>
    <h4>Loading</h4>
    <al-row>
      <al-table :data="tableData" style="width: 90%" v-loading="true">
        <al-table-column prop="date" label="Date" width="180"></al-table-column>
        <al-table-column prop="name" label="Name" width="180"></al-table-column>
        <al-table-column prop="address" label="Address"></al-table-column>
      </al-table>
    </al-row>
    <h4>Message</h4>
    <al-row>
      <div
        role="alert"
        class="demo-item al-message al-message--success al-message-fade-leave-active al-message-fade-leave-to"
        style="top: 0; left: 0; width: 100px; opacity: 1; position: relative; transform: none"
      >
        <i class="al-message__icon al-icon-success"></i>
        <p class="al-message__content">Congrats, this is a success message.</p>
        <!---->
      </div>
      <div
        role="alert"
        class="demo-item al-message al-message--warning al-message-fade-leave-active al-message-fade-leave-to"
        style="top: 0; left: 0; width: 100px; opacity: 1; position: relative; transform: none"
      >
        <i class="al-message__icon al-icon-warning"></i>
        <p class="al-message__content">Warning, this is a warning message.</p>
        <!---->
      </div>
      <div
        role="alert"
        class="demo-item al-message al-message--info al-message-fade-leave-active al-message-fade-leave-to"
        style="top: 0; left: 0; width: 100px; opacity: 1; position: relative; transform: none"
      >
        <i class="al-message__icon al-icon-info"></i>
        <p class="al-message__content">This is a message.</p>
        <!---->
      </div>
      <div
        role="alert"
        class="demo-item al-message al-message--error is-closable al-message-fade-leave-active al-message-fade-leave-to"
        style="top: 0; left: 0; width: 100px; opacity: 1; position: relative; transform: none"
      >
        <i class="al-message__icon al-icon-error"></i>
        <p class="al-message__content">Oops, this is a error message.</p>
        <i class="al-message__closeBtn al-icon-close"></i>
      </div>
    </al-row>
    <h4>MessageBox</h4>
    <al-row>
      <div class="al-message-box">
        <div class="al-message-box__header">
          <div class="al-message-box__title"><!----><span>Warning</span></div>
          <button type="button" aria-label="Close" class="al-message-box__headerbtn">
            <i class="al-message-box__close al-icon-close"></i>
          </button>
        </div>
        <div class="al-message-box__content">
          <div class="al-message-box__status al-icon-warning"></div>
          <div class="al-message-box__message">
            <p>This will permanently delete the file. Continue?</p>
          </div>
          <div class="al-message-box__input" style="display: none">
            <div class="al-input">
              <!----><input
                type="text"
                autocomplete="off"
                placeholder=""
                class="al-input__inner"
              /><!----><!----><!---->
            </div>
            <div class="al-message-box__errormsg" style="visibility: hidden"></div>
          </div>
        </div>
        <div class="al-message-box__btns">
          <button type="button" class="al-button al-button--default al-button--small">
            <!----><!----><span> Cancel </span></button
          ><button
            type="button"
            class="al-button al-button--default al-button--small al-button--primary"
          >
            <!----><!----><span> OK </span>
          </button>
        </div>
      </div>
    </al-row>
    <h4>Notification</h4>
    <al-row>
      <div role="alert" class="al-notification right" style="position: relative; left: 0">
        <!---->
        <div class="al-notification__group">
          <span class="al-notification__title">Notification</span>
          <div class="al-notification__content"><div>This is a message</div></div>
          <div class="al-notification__closeBtn al-icon-close"></div>
        </div>
      </div>
    </al-row>
    <h4>Menu</h4>
    <al-row>
      <al-menu :default-active="menu" class="al-menu-demo" mode="horizontal">
        <al-menu-item index="1">Processing Center</al-menu-item>
        <al-submenu index="2">
          <template slot="title">Workspace</template>
          <al-menu-item index="2-1">item one</al-menu-item>
          <al-menu-item index="2-2">item two</al-menu-item>
          <al-menu-item index="2-3">item three</al-menu-item>
          <al-submenu index="2-4">
            <template slot="title">item four</template>
            <al-menu-item index="2-4-1">item one</al-menu-item>
            <al-menu-item index="2-4-2">item two</al-menu-item>
            <al-menu-item index="2-4-3">item three</al-menu-item>
          </al-submenu>
        </al-submenu>
        <al-menu-item index="3" disabled>Info</al-menu-item>
        <al-menu-item index="4">
          <a href="https://www.ele.me" target="_blank">Orders</a>
        </al-menu-item>
      </al-menu>
      <al-menu default-active="2" class="demo-line">
        <al-submenu index="1">
          <template slot="title">
            <i class="al-icon-location"></i>
            <span>Navigator One</span>
          </template>
          <al-menu-item-group title="Group One">
            <al-menu-item index="1-1">item one</al-menu-item>
            <al-menu-item index="1-2">item one</al-menu-item>
          </al-menu-item-group>
          <al-menu-item-group title="Group Two">
            <al-menu-item index="1-3">item three</al-menu-item>
          </al-menu-item-group>
          <al-submenu index="1-4">
            <template slot="title">item four</template>
            <al-menu-item index="1-4-1">item one</al-menu-item>
          </al-submenu>
        </al-submenu>
        <al-menu-item index="2">
          <i class="al-icon-menu"></i>
          <span>Navigator Two</span>
        </al-menu-item>
        <al-menu-item index="3" disabled>
          <i class="al-icon-document"></i>
          <span>Navigator Three</span>
        </al-menu-item>
        <al-menu-item index="4">
          <i class="al-icon-setting"></i>
          <span>Navigator Four</span>
        </al-menu-item>
      </al-menu>
    </al-row>
    <h4>Tabs</h4>
    <al-row>
      <al-tabs v-model="tab" class="demo-item">
        <al-tab-pane label="User" name="first">User</al-tab-pane>
        <al-tab-pane label="Config" name="second">Config</al-tab-pane>
        <al-tab-pane label="Role" name="third">Role</al-tab-pane>
        <al-tab-pane label="Task" name="fourth">Task</al-tab-pane>
      </al-tabs>
      <al-tabs type="card" class="demo-item">
        <al-tab-pane label="User">User</al-tab-pane>
        <al-tab-pane label="Config">Config</al-tab-pane>
        <al-tab-pane label="Role">Role</al-tab-pane>
        <al-tab-pane label="Task">Task</al-tab-pane>
      </al-tabs>
    </al-row>
    <h4>Dialog</h4>
    <al-row>
      <div role="dialog" aria-modal="true" aria-label="Tips" class="al-dialog" style="margin: 0">
        <div class="al-dialog__header">
          <span class="al-dialog__title">Tips</span
          ><button type="button" aria-label="Close" class="al-dialog__headerbtn">
            <i class="al-dialog__close al-icon al-icon-close"></i>
          </button>
        </div>
        <div class="al-dialog__body"><span>This is a message</span></div>
        <div class="al-dialog__footer">
          <span class="dialog-footer"
            ><button type="button" class="al-button al-button--default">
              <!----><!----><span>Cancel</span>
            </button>
            <button type="button" class="al-button al-button--primary">
              <!----><!----><span>Confirm</span>
            </button></span
          >
        </div>
      </div>
    </al-row>
    <h4>Tooltip</h4>
    <al-row>
      <div
        role="tooltip"
        x-placement="top"
        class="al-tooltip__popper is-dark"
        style="position: relative; width: 40px; text-align: center"
      >
        Dark
        <div x-arrow="" class="popper__arrow"></div>
      </div>
      <div
        role="tooltip"
        x-placement="top"
        class="al-tooltip__popper is-light"
        style="margin-top: 10px; position: relative; width: 40px; text-align: center"
      >
        Light
        <div x-arrow="" class="popper__arrow"></div>
      </div>
    </al-row>
    <h4>Popover</h4>
    <al-row>
      <div
        role="tooltip"
        x-placement="top"
        id="al-popover-2936"
        aria-hidden="true"
        class="al-popover al-popper al-popover--plain"
        tabindex="0"
        style="width: 200px; position: relative"
      >
        <div class="al-popover__title">Title</div>
        this is content, this is content, this is content
        <div x-arrow="" class="popper__arrow"></div>
      </div>
    </al-row>
    <h4>Card</h4>
    <al-row>
      <al-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Card name</span>
        </div>
      </al-card>
    </al-row>
    <h4>Carousel</h4>
    <al-row>
      <al-carousel height="150px">
        <al-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </al-carousel-item>
      </al-carousel>
    </al-row>
    <h4>Collapse</h4>
    <al-row>
      <al-collapse v-model="collapse">
        <al-collapse-item title="Consistent" name="1">
          <div>
            Consistent with real life: in line with the process and logic of real life, and comply
            with languages and habits that the users are used to;
          </div>
        </al-collapse-item>
        <al-collapse-item title="Feedback" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their operations by style
            updates and interactive effects;
          </div>
        </al-collapse-item>
      </al-collapse>
    </al-row>
    <h4>Avatar</h4>
    <al-row class="demo-line avatar-demo">
      <al-avatar icon="al-icon-user-solid" />
      <al-avatar> avatar </al-avatar>
      <al-avatar shape="square" fit="contain" :src="avatarData.url"></al-avatar>
      <al-avatar size="large"> large </al-avatar>
      <al-avatar size="medium"> medium </al-avatar>
      <al-avatar size="small"> small </al-avatar>
    </al-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: '1',
      radio1: 'Washington',
      radio2: '1',
      checked: true,
      checked1: ['Shanghai'],
      checked2: true,
      input: 'Element',
      inputNumber: 1,
      selectOptions: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ],
      selectValue: '',
      cascadeOptions: [
        {
          value: 'guide',
          label: 'Guide',
          children: [
            {
              value: 'disciplines',
              label: 'Disciplines',
              children: [
                {
                  value: 'consistency',
                  label: 'Consistency'
                },
                {
                  value: 'feedback',
                  label: 'Feedback'
                }
              ]
            }
          ]
        },
        {
          value: 'resource',
          label: 'Resource',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'docs',
              label: 'Design Documentation'
            }
          ]
        }
      ],
      cascaderValue: [],
      switchValue: true,
      slider: 28,
      datePicker: '',
      rate: null,
      transferData: (() => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `Option ${i}`,
            disabled: i % 4 === 0
          });
        }
        return data;
      })(),
      transfer: [1, 4],
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }
      ],
      menu: '1',
      tab: 'first',
      collapse: ['1'],
      treeData: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: 'Level one 2',
          children: [
            {
              label: 'Level two 2-1',
              children: [
                {
                  label: 'Level three 2-1-1'
                }
              ]
            },
            {
              label: 'Level two 2-2',
              children: [
                {
                  label: 'Level three 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: 'Level one 3',
          children: [
            {
              label: 'Level two 3-1',
              children: [
                {
                  label: 'Level three 3-1-1'
                }
              ]
            },
            {
              label: 'Level two 3-2',
              children: [
                {
                  label: 'Level three 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      avatarData: {
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    };
  }
};
</script>
