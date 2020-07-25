const path = require('path');
const fs = require('fs');
const packagePath = path.resolve(process.cwd(), 'package.json');

if (!fs.existsSync(packagePath)) {
  console.log('Does`t get package.json from your project');
  return;
}

const packageJSON = require(packagePath);

const scriptsObject = {
  start: 'ideal-cli start',
  build: 'ideal-cli build',
  prestart: 'rimraf dist && ideal-cli dll',
  prebuild: 'rimraf dist && ideal-cli dll',
  'build-lib': 'ideal-cli build-lib',
  lint: 'eslint \'src/**/*.[jt]s?(x)\'',
  'lint-fix': 'npm run lint -- --fix',
  format: 'prettier \'src/**/*.[tj]s?(x)\' --check --write && npm run lint-fix',
  release: 'standard-version',
  analyze: 'webpack-bundle-analyzer analysis/stats.json'
}

function addScript(result, script) {
  if (!result.scripts[script]) {
    result.scripts[script] = scriptsObject[script];
  } else {
    console.log(`Ignore script: ${script}`);
  }
}

function updatePackage(options = {}) {
  const { isLibrary } = options;
  const { browserslist, husky, 'lint-staged': lintStaged } = packageJSON;
  let result = Object.assign({}, packageJSON);

  // update scripts
  const scriptsKeys = Object.keys(scriptsObject);
  let applyKeys = [];
  const commonKeys = ['lint', 'lint-fix', 'format', 'release', 'analyze'];
  if (isLibrary) {
    applyKeys = scriptsKeys.filter((script) => ['build-lib'].includes(script));
  } else {
    applyKeys = scriptsKeys.filter((script) => ['start', 'build', 'prestart', 'prebuild'].includes(script));
  }
  
  [...applyKeys, ...commonKeys].forEach((script) => {
    addScript(result, script);
  });

  // update browserslist
  if (!browserslist) {
    result.browserslist = [];
    result.browserslist.push(
      "> 1%",
      "not dead",
      "not op_mini all",
      "Firefox ESR",
      "Chrome >= 68",
      "IE 11",
      "Firefox >= 56",
      "Opera >= 48",
      "Safari >= 11"
    );
  } else {
    console.log('Ignore browserslist configuration');
  }

  // add hooks
  const hooks = {
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
    },
    "lint-staged": {
      "src/**/*.[jt]s?(x)": [
        "npm run format"
      ],
    }
  }

  if (!husky && !lintStaged) {
    result = Object.assign({}, result, {...hooks});
  }

  fs.writeFile(packagePath, JSON.stringify(result, null, 2), { encoding: 'utf8' }, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('package.json updated!');
  })
}

function addFile(src, target) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(target)) {
      resolve('existed');
    }
  
    fs.copyFile(src, target, (err) => {
      if (err) {
        reject(err);
      }
      resolve('done')
    })
  });
}

function addFileContainer(options = {}) {
  const { useTypeScript, isLibrary } = options;

  const addPrettier = new Promise((resolve) => {
    const src = path.resolve(__dirname, '..', 'files/.prettierrc');
    const target = path.resolve(process.cwd(), '.prettierrc');

    resolve(addFile(src, target));
  });

  const addProjectConfig = new Promise((resolve) => {
    const src = path.resolve(__dirname, '..', 'files/project.config.example.js');
    const target = path.resolve(process.cwd(), 'project.config.js');

    resolve(addFile(src, target));
  });

  const addLint = new Promise((resolve) => {
    let filename;
    if (isLibrary) {
      filename = 'files/.eslintrc.lib.json';
    } else if (useTypeScript) {
      filename = 'files/.eslintrc.react-ts.json';
    } else {
      filename = 'files/.eslintrc.react.json';
    }

    const src = path.resolve(__dirname, '..', filename);
    const target = path.resolve(process.cwd(), '.eslintrc.json');

    resolve(addFile(src, target));
  });

  const addTSConfig = new Promise((resolve) => {
    let filename;
    if (isLibrary) {
      filename = 'files/tsconfig.lib.json';
    } else if (useTypeScript) {
      filename = 'files/tsconfig.project.json';
    } else {
      resolve('done');
    }

    const src = path.resolve(__dirname, '..', filename);
    const target = path.resolve(process.cwd(), 'tsconfig.json');

    const srcBaseConfig = path.resolve(__dirname, '..', 'files/tsconfig.base.json');
    const targetBaseConfig = path.resolve(process.cwd(), 'tsconfig.base.json');

    resolve(Promise.all([addFile(src, target), addFile(srcBaseConfig, targetBaseConfig)]));
  });

  const addBabelrc = new Promise((resolve) => {
    if (isLibrary) {
      resolve('done');
    } else {
      const src = path.resolve(__dirname, '..', 'files/.babelrc');
      const target = path.resolve(process.cwd(), '.babelrc');
  
      resolve(addFile(src, target));
    }
  });

  Promise.all([addPrettier, addProjectConfig, addLint, addTSConfig, addBabelrc]).then((values) => {
    console.log('Files added: ', values.toString());
  }).catch((err) => {
    console.log(err);
  })
}

function init(options = {}) {
  addFileContainer(options);
  updatePackage(options);
}

module.exports = init;
