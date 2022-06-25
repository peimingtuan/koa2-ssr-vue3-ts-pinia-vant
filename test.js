// const fs = require('fs');
// const path = require('path');

const Koa = require('koa');

(async () => {
    const app = new Koa();

    // 获取index.html
    //const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

    app.use(async (ctx) => {
        // let vueTemplate = '<h1 style="text-align:center;">现在假装这是一个vue模板</h1>';
        //
        // // 替换 index.html 中的 <!--app-html--> 标记
        // let html = template.replace('<!--app-html-->', vueTemplate);
        //
        // ctx.body = html;
        ctx.body = `<!DOCTYPE html>
      <html lang="en">
        <head><title>koa2 + vite + ts + vue3 + vue-router</title></head>
        <body>
          <h1 style="text-align: center;">使用 koa2 + vite + ts + vue3 + vant+ router4 集成前端 SSR 企业级项目</h1>
        </body>
      </html>`;
    });

    app.listen(3000, () => {
        console.log('server is listening in 3000');
    });
})();