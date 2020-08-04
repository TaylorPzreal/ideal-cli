# ideal-cli

Frontend cli

## 一、Features

* Support build（Webpack）
  * development
  * production
  * library
* code format
* pre hooks check
* standard version
* dll
* build analysis
* browser compatibility
* commit lint

### Coming soon

- [ ] Unit test（Jest）

## 二、Usages

```bash
npm i ideal-cli@latest -D -E

# First init configuration
npx ideal-cli init -h
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

* [code splitting](https://webpack.docschina.org/guides/code-splitting/)
* [lazy loading](https://webpack.docschina.org/guides/lazy-loading/)
* [tree shaking](https://webpack.docschina.org/guides/tree-shaking/)
* [Shimming](https://webpack.docschina.org/guides/shimming/)
* Cache
* Concurrency

## 五、Bundle analysis

```bash
npm run analyze
```

Analysis Website

* <http://webpack.github.io/analyse/>
* <https://webpack.jakoblind.no/optimize/>
