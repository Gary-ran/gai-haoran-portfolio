# 盖皓然个人网站

这是个人简历与作品集网站的完整源代码。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址即可预览。

## 构建检查

```bash
npm run build
```

## 上传 GitHub

1. 在 GitHub 新建一个空仓库。
2. 将本项目解压后的文件上传到仓库根目录。
3. 不要上传 `node_modules`、`.next`、`dist` 等本地生成目录。
4. 将 GitHub 仓库连接到支持 Node.js/React 项目的托管服务完成上线。

> GitHub Pages 只托管纯静态文件，不能直接运行本项目的服务端构建；建议通过支持 GitHub 自动部署的平台发布。
