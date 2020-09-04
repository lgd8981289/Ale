## Button 按钮

常用的操作按钮。

### 基础用法

基础的按钮用法。

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 Button 的样式。

```html
<al-row>
  <al-button>默认按钮</al-button>
  <al-button type="primary">主要按钮</al-button>
  <al-button type="success">成功按钮</al-button>
  <al-button type="info">信息按钮</al-button>
  <al-button type="warning">警告按钮</al-button>
  <al-button type="danger">危险按钮</al-button>
</al-row>

<al-row>
  <al-button plain>朴素按钮</al-button>
  <al-button type="primary" plain>主要按钮</al-button>
  <al-button type="success" plain>成功按钮</al-button>
  <al-button type="info" plain>信息按钮</al-button>
  <al-button type="warning" plain>警告按钮</al-button>
  <al-button type="danger" plain>危险按钮</al-button>
</al-row>

<al-row>
  <al-button round>圆角按钮</al-button>
  <al-button type="primary" round>主要按钮</al-button>
  <al-button type="success" round>成功按钮</al-button>
  <al-button type="info" round>信息按钮</al-button>
  <al-button type="warning" round>警告按钮</al-button>
  <al-button type="danger" round>危险按钮</al-button>
</al-row>

<al-row>
  <al-button icon="al-icon-search" circle></al-button>
  <al-button type="primary" icon="al-icon-edit" circle></al-button>
  <al-button type="success" icon="al-icon-check" circle></al-button>
  <al-button type="info" icon="al-icon-message" circle></al-button>
  <al-button type="warning" icon="al-icon-star-off" circle></al-button>
  <al-button type="danger" icon="al-icon-delete" circle></al-button>
</al-row>
```

:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```html
<al-row>
  <al-button disabled>默认按钮</al-button>
  <al-button type="primary" disabled>主要按钮</al-button>
  <al-button type="success" disabled>成功按钮</al-button>
  <al-button type="info" disabled>信息按钮</al-button>
  <al-button type="warning" disabled>警告按钮</al-button>
  <al-button type="danger" disabled>危险按钮</al-button>
</al-row>

<al-row>
  <al-button plain disabled>朴素按钮</al-button>
  <al-button type="primary" plain disabled>主要按钮</al-button>
  <al-button type="success" plain disabled>成功按钮</al-button>
  <al-button type="info" plain disabled>信息按钮</al-button>
  <al-button type="warning" plain disabled>警告按钮</al-button>
  <al-button type="danger" plain disabled>危险按钮</al-button>
</al-row>
```

:::

### 文字按钮

没有边框和背景色的按钮。

:::demo

```html
<al-button type="text">文字按钮</al-button> <al-button type="text" disabled>文字按钮</al-button>
```

:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```html
<al-button type="primary" icon="al-icon-edit"></al-button>
<al-button type="primary" icon="al-icon-share"></al-button>
<al-button type="primary" icon="al-icon-delete"></al-button>
<al-button type="primary" icon="al-icon-search">搜索</al-button>
<al-button type="primary">上传<i class="al-icon-upload al-icon--right"></i></al-button>
```

:::

### 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`<al-button-group>`标签来嵌套你的按钮。

```html
<al-button-group>
  <al-button type="primary" icon="al-icon-arrow-left">上一页</al-button>
  <al-button type="primary">下一页<i class="al-icon-arrow-right al-icon--right"></i></al-button>
</al-button-group>
<al-button-group>
  <al-button type="primary" icon="al-icon-edit"></al-button>
  <al-button type="primary" icon="al-icon-share"></al-button>
  <al-button type="primary" icon="al-icon-delete"></al-button>
</al-button-group>
```

:::

### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。

```html
<al-button type="primary" :loading="true">加载中</al-button>
```

:::

### 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<al-row>
  <al-button>默认按钮</al-button>
  <al-button size="medium">中等按钮</al-button>
  <al-button size="small">小型按钮</al-button>
  <al-button size="mini">超小按钮</al-button>
</al-row>
<al-row>
  <al-button round>默认按钮</al-button>
  <al-button size="medium" round>中等按钮</al-button>
  <al-button size="small" round>小型按钮</al-button>
  <al-button size="mini" round>超小按钮</al-button>
</al-row>
```

:::

### Attributes

| 参数        | 说明           | 类型    | 可选值                                             | 默认值 |
| ----------- | -------------- | ------- | -------------------------------------------------- | ------ |
| size        | 尺寸           | string  | medium / small / mini                              | —      |
| type        | 类型           | string  | primary / success / warning / danger / info / text | —      |
| plain       | 是否朴素按钮   | boolean | —                                                  | false  |
| round       | 是否圆角按钮   | boolean | —                                                  | false  |
| circle      | 是否圆形按钮   | boolean | —                                                  | false  |
| loading     | 是否加载中状态 | boolean | —                                                  | false  |
| disabled    | 是否禁用状态   | boolean | —                                                  | false  |
| icon        | 图标类名       | string  | —                                                  | —      |
| autofocus   | 是否默认聚焦   | boolean | —                                                  | false  |
| native-type | 原生 type 属性 | string  | button / submit / reset                            | button |
