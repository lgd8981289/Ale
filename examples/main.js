import { createApp, nextTick } from 'vue';
import Ale from '@main/index.js';
import App from './App.vue';
import routes from './route.config';
import { createRouter, createWebHashHistory } from 'vue-router';
import hljs from 'highlight.js';
import demoBlock from '@demo/components/demo-block';
import MainFooter from '@demo/components/footer';
import MainHeader from '@demo/components/header';
import SideNav from '@demo/components/side-nav';
import FooterNav from '@demo/components/footer-nav';
import title from './i18n/title';

import '@components/theme-chalk/src/index.scss';
import './demo-styles/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';
import icon from './icon.json';

const app = createApp(App);
app.use(Ale);
app.component('demo-block', demoBlock);
app.component('main-footer', MainFooter);
app.component('main-header', MainHeader);
app.component('side-nav', SideNav);
app.component('footer-nav', FooterNav);

app.config.globalProperties.$icon = icon; // Icon 列表页用

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.afterEach(route => {
  nextTick().then(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Ale';
  ga('send', 'event', 'PageView', route.name);
});
app.use(router);

app.mount('#app');
