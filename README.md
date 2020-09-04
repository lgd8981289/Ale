# （wip）Element-UI 3 (Ale-UI) for vue3
这是一个基于 element-ui 修改的，支持 Vue 3 的组件库，你可以叫它 element3，也可以叫它 Ale （爱了）。

## 提交

- 请注意代码规范（项目内嵌了 prettier）。

- 提交前请先拉取代码，以免产生不必要的冲突

- 提交规范：`key: value`。比如：重构了 button 按钮 -> ` refactor: refactor button` 

- `key` 可选 ：

  ```
  feat：新功能（feature）
  fix：修补bug
  docs：文档（documentation）
  style： 格式（不影响代码运行的变动）
  refactor：重构（即不是新增功能，也不是修改bug的代码变动）
  test：增加测试
  chore：构建过程或辅助工具的变动
  release: 发布
  ```

## 已移植组件

\- Layout 布局

\- Container 布局容器

\- Color 色彩

\- Typography 字体

\- Border 边框

\- Icon 图标

\- Button 按钮

\- Link 文字链接

\- Radio 单选框

\- Checkbox 多选框

\- Input 输入框

\- InputNumber 计数器

\- Select 选择器

\- Switch 开关

\- Form 表单

\- Tag 标签

\- Pagination 分页

## 变化

组件的前缀进行了修改：`el  ->  al`

即：`el-button   ->  al-button`

## 运行与打包

`npm run dev`

`npm run build`

## 更新计划（0.2.0）

- 表格：table
- 警告：Alert
- 消息提示：Message
- 弹框：MessageBox
- 通知：Notification
- 对话框：Dialog
- 导航组件：NavMenu
- 标签页：Tabs
- 面包屑：Breadcrumb