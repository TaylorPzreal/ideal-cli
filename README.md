# fe-cli

前端工具集

## Features

* 支持构建工具（Webpack）
  * 支持本地开发
  * 支持生产构建
  * 支持公共库构建
* 支持代码格式化
* 支持pre hooks检查
* 支持版本升级

### Coming soon

- [ ] 支持单元测试（Jest）
- [ ] 支持DLL

## Usages

```bash
npm i fe-cli@latest -D -E

# 首先执行项目初始化配置操作
npx fe-cli init
```

```json
{
  "scripts": {
    "start": "fe-cli start",
    "build": "fe-cli build",
    "build-lib": "fe-cli build-lib"
  }
}
```

## browserslist example

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

## babelrc

If project uses __react__, you should config local ```.babelrc```:

```json
{
  "presets": [
    "react-app"
  ]
}
```

## lint

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

## version

> major.minor.patch

```bash
npm run release -- --first-release
npm run release -- --release-as (major|minor|patch)
```

[More Info](https://www.npmjs.com/package/standard-version)
