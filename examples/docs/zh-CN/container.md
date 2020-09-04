## Container 布局容器

用于布局的容器组件，方便快速搭建页面的基本结构：

`<al-container>`：外层容器。当子元素中包含 `<al-header>` 或 `<al-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<al-header>`：顶栏容器。

`<al-aside>`：侧边栏容器。

`<al-main>`：主要区域容器。

`<al-footer>`：底栏容器。

:::tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`<al-container>` 的子元素只能是后四者，后四者的父元素也只能是 `<al-container>`。
:::

### 常见页面布局

:::demo

```html
<al-container>
  <al-header>Header</al-header>
  <al-main>Main</al-main>
</al-container>

<al-container>
  <al-header>Header</al-header>
  <al-main>Main</al-main>
  <al-footer>Footer</al-footer>
</al-container>

<al-container>
  <al-aside width="200px">Aside</al-aside>
  <al-main>Main</al-main>
</al-container>

<al-container>
  <al-header>Header</al-header>
  <al-container>
    <al-aside width="200px">Aside</al-aside>
    <al-main>Main</al-main>
  </al-container>
</al-container>

<al-container>
  <al-header>Header</al-header>
  <al-container>
    <al-aside width="200px">Aside</al-aside>
    <al-container>
      <al-main>Main</al-main>
      <al-footer>Footer</al-footer>
    </al-container>
  </al-container>
</al-container>

<al-container>
  <al-aside width="200px">Aside</al-aside>
  <al-container>
    <al-header>Header</al-header>
    <al-main>Main</al-main>
  </al-container>
</al-container>

<al-container>
  <al-aside width="200px">Aside</al-aside>
  <al-container>
    <al-header>Header</al-header>
    <al-main>Main</al-main>
    <al-footer>Footer</al-footer>
  </al-container>
</al-container>

<style>
  .al-header,
  .al-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .al-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .al-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .al-container {
    margin-bottom: 40px;
  }

  .al-container:nth-child(5) .al-aside,
  .al-container:nth-child(6) .al-aside {
    line-height: 260px;
  }

  .al-container:nth-child(7) .al-aside {
    line-height: 320px;
  }
</style>
```

:::

### 实例

:::demo

```html
<al-container style="height: 500px; border: 1px solid #eee">
  <al-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <al-menu :default-openeds="['1', '3']">
      <al-submenu index="1">
        <template slot="title"><i class="al-icon-message"></i>导航一</template>
        <al-menu-item-group>
          <template slot="title">分组一</template>
          <al-menu-item index="1-1">选项1</al-menu-item>
          <al-menu-item index="1-2">选项2</al-menu-item>
        </al-menu-item-group>
        <al-menu-item-group title="分组2">
          <al-menu-item index="1-3">选项3</al-menu-item>
        </al-menu-item-group>
        <al-submenu index="1-4">
          <template slot="title">选项4</template>
          <al-menu-item index="1-4-1">选项4-1</al-menu-item>
        </al-submenu>
      </al-submenu>
      <al-submenu index="2">
        <template slot="title"><i class="al-icon-menu"></i>导航二</template>
        <al-menu-item-group>
          <template slot="title">分组一</template>
          <al-menu-item index="2-1">选项1</al-menu-item>
          <al-menu-item index="2-2">选项2</al-menu-item>
        </al-menu-item-group>
        <al-menu-item-group title="分组2">
          <al-menu-item index="2-3">选项3</al-menu-item>
        </al-menu-item-group>
        <al-submenu index="2-4">
          <template slot="title">选项4</template>
          <al-menu-item index="2-4-1">选项4-1</al-menu-item>
        </al-submenu>
      </al-submenu>
      <al-submenu index="3">
        <template slot="title"><i class="al-icon-setting"></i>导航三</template>
        <al-menu-item-group>
          <template slot="title">分组一</template>
          <al-menu-item index="3-1">选项1</al-menu-item>
          <al-menu-item index="3-2">选项2</al-menu-item>
        </al-menu-item-group>
        <al-menu-item-group title="分组2">
          <al-menu-item index="3-3">选项3</al-menu-item>
        </al-menu-item-group>
        <al-submenu index="3-4">
          <template slot="title">选项4</template>
          <al-menu-item index="3-4-1">选项4-1</al-menu-item>
        </al-submenu>
      </al-submenu>
    </al-menu>
  </al-aside>

  <al-container>
    <al-header style="text-align: right; font-size: 12px">
      <al-dropdown>
        <i class="al-icon-setting" style="margin-right: 15px"></i>
        <al-dropdown-menu slot="dropdown">
          <al-dropdown-item>查看</al-dropdown-item>
          <al-dropdown-item>新增</al-dropdown-item>
          <al-dropdown-item>删除</al-dropdown-item>
        </al-dropdown-menu>
      </al-dropdown>
      <span>王小虎</span>
    </al-header>

    <al-main>
      <al-table :data="tableData">
        <al-table-column prop="date" label="日期" width="140"> </al-table-column>
        <al-table-column prop="name" label="姓名" width="120"> </al-table-column>
        <al-table-column prop="address" label="地址"> </al-table-column>
      </al-table>
    </al-main>
  </al-container>
</al-container>

<style>
  .al-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .al-aside {
    color: #333;
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      };
    }
  };
</script>
```

:::

### Container Attributes

| 参数      | 说明             | 类型   | 可选值                | 默认值                                                                 |
| --------- | ---------------- | ------ | --------------------- | ---------------------------------------------------------------------- |
| direction | 子元素的排列方向 | string | horizontal / vertical | 子元素中有 `al-header` 或 `al-footer` 时为 vertical，否则为 horizontal |

### Header Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 顶栏高度 | string | —      | 60px   |

### Aside Attributes

| 参数  | 说明       | 类型   | 可选值 | 默认值 |
| ----- | ---------- | ------ | ------ | ------ |
| width | 侧边栏宽度 | string | —      | 300px  |

### Footer Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 底栏高度 | string | —      | 60px   |
