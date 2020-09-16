# Rollup base config

```json
{
  "scripts": {
    "build": "rollup -c",
    "prebuild": "rm -rf dist/*",
    "lint": "eslint 'src/**/*.ts'",
    "lint:fix": "npm run lint -- --fix",
    "prepublishOnly": "npm run build",
    "publish": "npm publish --registry=https://registry.npmjs.com/"
  },
  "devDependencies": {
    "@babel/core": "7.11.5",
    "@babel/preset-env": "7.11.5",
    "@rollup/plugin-json": "4.1.0",
    "@types/echarts": "4.6.5",
    "@typescript-eslint/eslint-plugin": "4.0.1",
    "@typescript-eslint/parser": "4.0.1",
    "babel-eslint": "10.1.0",
    "echarts": "4.9.0",
    "eslint": "7.8.1",
    "rollup": "2.26.9",
    "rollup-plugin-babel": "4.4.0",
    "rollup-plugin-terser": "7.0.1",
    "rollup-plugin-typescript2": "0.27.2",
    "typescript": "4.0.2"
  },
}
```

```bash
npm i -D --save-exact @babel/core @babel/preset-env @rollup/plugin-json @types/echarts @typescript-eslint/eslint-plugin @typescript-eslint/parser babel-eslint echarts eslint rollup rollup-plugin-babel rollup-plugin-terser rollup-plugin-typescript2 typescript
```
