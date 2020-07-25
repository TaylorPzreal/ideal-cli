# ideal-cli

前端工具集

## 一、Features

* 支持构建工具（Webpack）
  * 支持本地开发
  * 支持生产构建
  * 支持公共库构建
* 支持代码格式化
* 支持pre hooks检查
* 支持版本升级
* 支持DLL
* 支持构建分析
* 支持浏览器兼容

### Coming soon

- [ ] 支持单元测试（Jest）

## 二、Usages

```bash
npm i ideal-cli@latest -D -E

# 首先执行项目初始化配置操作
npx ideal-cli init
```

## 三、Configurations

### 1. package.json

```json
{
  "scripts": {
    "start": "ideal-cli start",
    "build": "ideal-cli build",
    "build-lib": "ideal-cli build-lib"
  }
}
```

### 2. browserslist

Add configuration to ```package.json```

```json
{
  "browserslist": [
    "> 1%",
    "not dead",
    "not op_mini all",
    "Firefox ESR",
    "Chrome >= 68",
    "IE 11",
    "Firefox >= 56",
    "Opera >= 48",
    "Safari >= 11"
  ]
}
```

### 3. babelrc

If project uses __react__, you should config local ```.babelrc```:

```json
{
  "presets": [
    "react-app"
  ]
}
```

### 4. lint

```bash
npx eslint --init
```

```json
{
  "lint": "eslint 'src/**/*.[tj]s?(x)'",
  "lint-fix": "npm run lint -- --fix",
  "format": "prettier 'src/**/*.[tj]s?(x)' --check --write && npm run lint-fix"
}
```

### 5. version

> major.minor.patch

```bash
npm run release -- --first-release
npm run release -- --release-as (major|minor|patch)
```

[More Info](https://www.npmjs.com/package/standard-version)

### 6. Dll

Config __package.json__

```json
{
  "scripts": {
    "prestart": "rimraf dist && ideal-cli dll",
    "prebuild": "rimraf dist && ideal-cli dll"
  }
}
```

Config your __index.html__.

```html
<body>
  <!-- contents -->

  <!-- Inject DLL -->
  <script src="%INJECT_DLL%"></script>
</body>
```

Config your __project.config.js__.

```js
{
  dllVendors: ['react', 'react-dom']
}
```

## 四、Optimization

* [代码分离](https://webpack.docschina.org/guides/code-splitting/)
* [懒加载](https://webpack.docschina.org/guides/lazy-loading/)
* [摇树优化](https://webpack.docschina.org/guides/tree-shaking/)
* [Shimming 预置依赖](https://webpack.docschina.org/guides/shimming/)
* 缓存
* 并发

## 五、Bundle analysis

```bash
npm run analyze
```

Analysis Website

* <http://webpack.github.io/analyse/>
* <https://webpack.jakoblind.no/optimize/>
