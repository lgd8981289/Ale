## Icon 图标

提供了一套常用的图标集合。

### 使用方法

直接通过设置类名为 `al-icon-iconName` 来使用即可。例如：

:::demo

```html
<i class="al-icon-edit"></i>
<i class="al-icon-share"></i>
<i class="al-icon-delete"></i>
<al-button type="primary" icon="al-icon-search">搜索</al-button>
```

:::

### 图标集合

<ul class="icon-list">
  <li v-for="name in $icon" :key="name">
    <span>
      <i :class="'al-icon-' + name"></i>
      <span class="icon-name">{{'al-icon-' + name}}</span>
    </span>
  </li>
</ul>
