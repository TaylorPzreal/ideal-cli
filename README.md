# fe-cli

前端工具集

## Features

* 支持构建工具（Webpack）
* 支持代码格式化
* 支持pre hooks检查
* 支持单元测试（Jest）

## Usages

```bash
npm i fe-cli@latest -D
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
