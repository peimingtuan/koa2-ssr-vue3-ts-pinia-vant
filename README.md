# 了解 SSR
## 什么是 SSR
   `服务器端渲染`（Server-Side Rendering）是指由服务端完成页面的 HTML 结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态与事件，成为完全可交互页面的过程。

   简单理解就是html是由服务端写出，可以动态改变页面内容，即所谓的动态页面。早年的 [php](https://baike.baidu.com/item/php/9337)、[asp](https://baike.baidu.com/item/asp/128906) 、[jsp](https://baike.baidu.com/item/jsp/141543) 这些 Server page 都是 SSR 的。
   
## 为什么使用 SSR
-   网页内容在服务器端渲染完成，一次性传输到浏览器，所以 `首屏加载速度非常快`；
-   `有利于SEO`，因为服务器返回的是一个完整的 html，在浏览器可以看到完整的 dom，对于爬虫、百度搜索等引擎就比较友好；

> `建议包管理器使用优先级：pnpm > yarn > npm > cnpm`


# 一、初始化项目

```shell
pnpm create vite koa2-ssr-vue3-ts-pinia -- --template vue-ts
```

# 二、修改客户端入口

1.  修改 `~/src/main.ts`

```ts
import { createSSRApp } from "vue";
import App from "./App.vue";

// 为了保证数据的互不干扰，每次请求需要导出一个新的实例
export const createApp = () => {
    const app = createSSRApp(App);
    return { app };
}
```

2.  新建 `~/src/entry-client.ts`

```ts
import { createApp } from "./main"

const { app } = createApp();

app.mount("#app");
```

3.  修改 `~/index.html` 的入口

```html
<!DOCTYPE html>
<html lang="en">

    ...

    <script type="module" src="/src/entry-client.ts"></script>

    ...

</html>
```

到这里你运行 `pnpm run dev` ，发现页面中还是可以正常显示，因为到目前只是做了一个文件的拆分，以及更换了 `createSSRApp` 方法；

# 三、创建开发服务器
## 使用 Koa2

1.  安装 `koa2`

```shell
pnpm i koa --save && pnpm i @types/koa --save-dev
```

2.  安装中间件 `koa-connect`

```shell
pnpm i koa-connect --save
```

3.  使用：新建 `~/server.js`

> 备注：因为该文件为 node 运行入口，所以用 js 即可，如果用 ts 文件，需单独使用 ts-node 等去运行，导致程序变复杂

```js
const Koa = require('koa');

(async () => {
    const app = new Koa();

    app.use(async (ctx) => {
        ctx.body = `<!DOCTYPE html>
      <html lang="en">
        <head><title>koa2 + vite + ts + vue3 + vue-router</title></head>
        <body>
          <h1 style="text-align: center;">使用 koa2 + vite + ts + vue3 + vue-router 集成前端 SSR 企业级项目</h1>
        </body>
      </html>`;
    });

    app.listen(9000, () => {
        console.log('server is listening in 9000');
    });
})();
```

4.  运行 `node server.js`

## 渲染替换成项目根目录下的 `index.html`

1. 修改 `server.js` 中的 `ctx.body` 返回的是 `index.html`

```js
 const fs = require('fs');
 const path = require('path');
 ​
 const Koa = require('koa');
 ​
 (async () => {
     const app = new Koa();
 ​
     // 获取 index.html
     const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
 ​
     app.use(async (ctx) => {
         ctx.body = template;
     });
 ​
     app.listen(9000, () => {
         console.log('server is listening in 9000');
     });
 })();
```
2. 运行 `node server.js`后， 我们就会看到返回的是空白内容的 `index.html` 了，但是我们需要返回的是 `vue 模板` ，那么我们只需要做个 `正则的替换`
3. 给 `index.html` 添加 `<!--app-html-->` 标记

```html
 <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" href="/favicon.ico" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>koa2 + vite + ts + vue3</title>
   </head>
   <body>
     <div id="app"><!--app-html--></div>
     <script type="module" src="/src/entry-client.ts"></script>
   </body>
 </html>
```
4. 修改 `server.js` 中的 `ctx.body`
```js
// other code ...

(async () => {
    const app = new Koa();

    // 获取index.html
    const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

    app.use(async (ctx) => {
        let vueTemplate = '<h1 style="text-align:center;">现在假装这是一个vue模板</h1>';

        // 替换 index.html 中的 <!--app-html--> 标记
        let html = template.replace('<!--app-html-->', vueTemplate);

        ctx.body = html;
    });

    app.listen(9000, () => {
        console.log('server is listening in 9000');
    });
})();
```
5. 运行 `node server.js`后，我们就会看到返回的 `变量 vueTemplate` 内容

那么到现在服务已正常启动了，但是我们试想一下，我们页面模板使用的是 vue，并且 vue 返回的是一个 `vue 实例模板`，所以我就要把这个 `vue 实例模板` 转换成 `可渲染的 html`，那么 `@vue/server-renderer` 就应运而生了

# 四、新增服务端入口
因为 vue 返回的是 `vue 实例模板` 而不是 `可渲染的 html` ，所以我们需要使用 `@vue/server-renderer` 进行转换

1. 安装 `@vue/server-renderer`
```shell
pnpm i @vue/server-renderer --save
```

2. 新建 `~/src/entry-server.ts`

```ts
import { createApp } from './main';
import { renderToString } from '@vue/server-renderer';

export const render = async () => {
  const { app } = createApp();
	
  // 注入vue ssr中的上下文对象
  const renderCtx: {modules?: string[]} = {}

  let renderedHtml = await renderToString(app, renderCtx)

  return { renderedHtml };
}
```

那么如何去使用 `entry-server.ts` 呢，到这里就需要 `vite` 了

# 五、注入 `vite`

1.  修改 `~/server.js`

```js
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const koaConnect = require('koa-connect')

const vite = require('vite')

;(async () => {
    const app = new Koa();

    // 创建 vite 服务
    const viteServer = await vite.createServer({
        root: process.cwd(),
        logLevel: 'error',
        server: {
        middlewareMode: true,
        },
    })
    
    // 注册 vite 的 Connect 实例作为中间件（注意：vite.middlewares 是一个 Connect 实例）
    app.use(koaConnect(viteServer.middlewares))

    app.use(async ctx => {
        try {
            // 1. 获取index.html
            let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

            // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
            template = await viteServer.transformIndexHtml(ctx.path, template)

            // 3. 加载服务器入口, vite.ssrLoadModule 将自动转换
            const { render } = await viteServer.ssrLoadModule('/src/entry-server.ts')

            //  4. 渲染应用的 HTML
            const { renderedHtml } = await render(ctx, {})

            const html = template.replace('<!--app-html-->', renderedHtml)

            ctx.type = 'text/html'
            ctx.body = html
        } catch (e) {
            viteServer && viteServer.ssrFixStacktrace(e)
            console.log(e.stack)
            ctx.throw(500, e.stack)
        }
    })

    app.listen(9000, () => {
        console.log('server is listening in 9000');
    });

})()
```

2.  运行 `node server.js` 就可以看到返回的 App.vue 模板中的内容了，
3.  并且我们 `右键查看显示网页源代码`，也会看到渲染的正常 html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>koa2 + vite + ts + vue3</title>
  </head>
  <body>
    <div id="app"><!--[--><img alt="Vue logo" src="/src/assets/logo.png"><!--[--><h1 data-v-469af010>Hello Vue 3 + TypeScript + Vite</h1><p data-v-469af010> Recommended IDE setup: <a href="<https://code.visualstudio.com/>" target="_blank" data-v-469af010>VSCode</a> + <a href="<https://github.com/johnsoncodehk/volar>" target="_blank" data-v-469af010>Volar</a></p><p data-v-469af010>See <code data-v-469af010>README.md</code> for more information.</p><p data-v-469af010><a href="<https://vitejs.dev/guide/features.html>" target="_blank" data-v-469af010> Vite Docs </a> | <a href="<https://v3.vuejs.org/>" target="_blank" data-v-469af010>Vue 3 Docs</a></p><button type="button" data-v-469af010>count is: 0</button><p data-v-469af010> Edit <code data-v-469af010>components/HelloWorld.vue</code> to test hot module replacement. </p><!--]--><!--]--></div>
    <script type="module" src="/src/entry-client.ts"></script>
  </body>
</html>
```

到这里我们就已经在 `开发环境` 已经正常的渲染了，但我们想一下，在 `生产环境` 我们应该怎么做呢，因为咱们不可能直接在 `生产环境` 运行使用 `vite` 吧！


所以咱们接下来处理如何在 `生产环境` 运行吧


# 六、添加开发环境

为了将 SSR 项目可以在生产环境运行，我们需要：
1. 正常构建生成一个 `客户端构建包`；
2. 再生成一个 SSR 构建，使其通过 `require()` 直接加载，这样便无需再使用 Vite 的 `ssrLoadModule`；
3. 修改 `package.json`
```json
...

{
"scripts": {
    // 开发环境
    "dev": "node server-dev.js",
    // 生产环境
    "server": "node server-prod.js",
    // 构建
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.js --outDir dist/server",
  },
}

...

```
4. 修改 `server.js` 为 `server-dev.js`
5.  运行 `pnpm run build` 构建包
6.  新增 `server-prod.js`
> 注意：为了处理静态资源，需要在此新增 `koa-send` 中间件： `pnpm i koa-send --save`
```js
const Koa = require('koa');
const sendFile = require('koa-send');

const path = require('path');
const fs = require('fs');

const resolve = (p) => path.resolve(__dirname, p);

const clientRoot = resolve('dist/client');
const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
const render = require('./dist/server/entry-server.js').render;
const manifest = require('./dist/client/ssr-manifest.json');

(async () => {
    const app = new Koa();

    app.use(async (ctx) => {
				
				// 请求的是静态资源
        if (ctx.path.startsWith('/assets')) {
            await sendFile(ctx, ctx.path, { root: clientRoot });
            return;
        }

        const [ appHtml ] = await render(ctx, manifest);

        const html = template
            .replace('<!--app-html-->', appHtml);

        ctx.type = 'text/html';
        ctx.body = html;
    });

    app.listen(8080, () => console.log('started server on http://localhost:8080'));
})();
```
到这里，我们在 `开发环境` 和 `生成环境` 已经都可以正常访问了，那么是不是就万事无忧了呢？

为了用户的更极致的用户体验，那么 `预加载` 就必须要安排了

# 七、预加载
我们知道 `vue 组件`在 html 中渲染时都是动态去生成的对应的 `js` 和 `css` 等；

那么我们要是在用户获取 `服务端模板` (也就是执行 `vite build` 后生成的 `dist/client` 目录) 的时候，直接在 html 中把对应的 `js` 和 `css` 文件预渲染了，这就是 `静态站点生成（SSG）` 的形式。

闲话少说，明白道理了之后，直接开干 ~

1. `生成预加载指令`：在 package.json 中的 `build:client` 添加 `--ssrManifest` 标志，运行后生成 `ssr-manifest.json`
```json
...

{
"scripts": {
    ...
    "build:client": "vite build --ssrManifest --outDir dist/client",
    ...
  },
}

...
```
2. 在 `entry-sercer.ts` 中添加解析生成的 `ssr-manifest.json` 方法

```ts
export const render = async (
    ctx: ParameterizedContext,
    manifest: Record<string, string[]>
): Promise<[string, string]> => {
    const { app } = createApp();
    console.log(ctx, manifest, '');

    const renderCtx: { modules?: string[] } = {};

    const renderedHtml = await renderToString(app, renderCtx);

    const preloadLinks = renderPreloadLinks(renderCtx.modules, manifest);

    return [renderedHtml, preloadLinks];
};

/**
 * 解析需要预加载的链接
 * @param modules
 * @param manifest
 * @returns string
 */
function renderPreloadLinks(
    modules: undefined | string[],
    manifest: Record<string, string[]>
): string {
    let links = '';
    const seen = new Set();
    if (modules === undefined) throw new Error();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
}

/**
 * 预加载的对应的地址
 * 下面的方法只针对了 js 和 css，如果需要处理其它文件，自行添加即可
 * @param file
 * @returns string
 */
function renderPreloadLink(file: string): string {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    } else {
        return '';
    }
}
```
3.  给 `index.html` 添加 `<!--preload-links-->` 标记
4.  改造 `server-prod.js`
```js

...

(async () => {
    const app = new Koa();

    app.use(async (ctx) => {
				
	...

        const [appHtml, preloadLinks] = await render(ctx, manifest);

        const html = template
            .replace('<!--preload-links-->', preloadLinks)
            .replace('<!--app-html-->', appHtml);

        // do something
    });

    app.listen(8080, () => console.log('started server on http://localhost:8080'));
})();
```
5. 运行 `pnpm run build && pnpm run serve` 就可正常显示了

到这里基本的渲染就完成了，因为我们是需要在浏览器上渲染的，所以 `路由 vue-router` 就必不可少了

# 八、集成 vue-router
1. 安装 vue-router
```shell
pnpm i vue-router --save
```
2.  新增对应的路由页面 `index.vue` 、 `login.vue` 、 `user.vue`
3.  新增 `src/router/index.ts`
```ts
import {
    createRouter as createVueRouter,
    createMemoryHistory,
    createWebHistory,
    Router
} from 'vue-router';

export const createRouter = (type: 'client' | 'server'): Router =>
    createVueRouter({
        history: type === 'client' ? createWebHistory() : createMemoryHistory(),

        routes: [
            {
                path: '/',
                name: 'index',
                meta: {
                    title: '首页',
                    keepAlive: true,
                    requireAuth: true
                },
                component: () => import('@/pages/index.vue')
            },
        ]
    });
```
4. 修改入口文件 `src/enter-client.ts`
```ts
import { createApp } from './main';

import { createRouter } from './router';
const router = createRouter('client');

const { app } = createApp();

app.use(router);

router.isReady().then(() => {
    app.mount('#app', true);
});
```
5. 修改入口文件 `src/enter-server.ts`
```ts
...
import { createRouter } from './router'
const router = createRouter('client');

export const render = async (
    ctx: ParameterizedContext,
    manifest: Record<string, string[]>
): Promise<[string, string]> => {
    const { app } = createApp();

    // 路由注册
    const router = createRouter('server');
    app.use(router);
    await router.push(ctx.path);
    await router.isReady();

    ...
};

...
```
6. 运行 `pnpm run build && pnpm run serve` 就可正常显示了

# 九、集成 pinia
1. 安装
```shell
pnpm i pinia --save
```
2. 新建 `src/store/user.ts`
```ts
import { defineStore } from 'pinia';

export default defineStore('user', {
    state: () => {
        return {
            name: '张三',
            age: 20
        };
    },
    actions: {
        updateName(name: string) {
            this.name = name;
        },
        updateAge(age: number) {
            this.age = age;
        }
    }
});

```
3. 新建 `src/store/index.ts`
```ts
import { createPinia } from 'pinia';
import useUserStore from './user';

export default () => {
    const pinia = createPinia();

    useUserStore(pinia);

    return pinia;
};

```
4. 新建 `UsePinia.vue` 使用，并且在 `views/index.vue` 中引入
```ts
<template>
    <h2>欢迎使用vite+vue3+ts+pinia+vue-router4</h2>
    <div>{{ userStore.name }}的年龄： {{ userStore.age }}</div
    ><br />
    <button @click="addAge">点击给{{ userStore.name }}的年龄增加一岁</button>
    <br />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import useUserStore from '@/store/user';
    export default defineComponent({
        name: 'UsePinia',
        setup() {
            const userStore = useUserStore();

            const addAge = () => {
                userStore.updateAge(++userStore.age);
            };
            return {
                userStore,
                addAge
            };
        }
    });
</script>

```
5. 注入 `pinia` ：修改 `src/entry-client.ts`
```ts
...

import createStore from '@/store';
const pinia = createStore();

const { app } = createApp();

app.use(router);
app.use(pinia);

// 初始化 pini
// 注意：__INITIAL_STATE__需要在 src/types/shims-global.d.ts中定义
if (window.__INITIAL_STATE__) {
    pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
}

...
```
6. 修改 `src/entry-server.ts`
```ts
...

import createStore from '@/store';

export const render = () => {
    ...
    // pinia
    const pinia = createStore();
    app.use(pinia);
    const state = JSON.stringify(pinia.state.value);

    ...

    return [renderedHtml, state, preloadLinks];

}
...
```
7. 修改 `server-dev.js` 和 `server-prod.js`
```js
...

const [renderedHtml, state, preloadLinks] = await render(ctx, {});

const html = template
     .replace('<!--app-html-->', renderedHtml)
     .replace('<!--pinia-state-->', state);
    // server-prod.js
    .replace('<!--preload-links-->', preloadLinks)

...
```
8. 给 `index.html` 添加 `<!--pinia-state-->` 标记
```html
<script>
    window.__INITIAL_STATE__ = '<!--pinia-state-->';
</script>
```
9. 运行 `pnpm run dev` 就可正常显示了

> 备注：`集成 pinia` 这块由于注入较为`复杂且方法不一`，暂时不做详细讲解，如果大家有需要，后面会出详细解析！
# 最后
> 友情提示：目前 Vite 的 SSR 支持还处于试验阶段，可能会遇到一些未知 bug ，所以在公司的生产环境请谨慎使用，个人项目中可以滥用哟 ~