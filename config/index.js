const path = require('path');
const fs = require('fs');
const { resolve } = require('path');

const packagePath = path.resolve(process.cwd() + '/package.json');
const packageJSON = require(packagePath);

// TODO: check errors
function updateLocalPackage(options = {}) {
  const { isLibrary } = options;
  const { scripts, browserslist } = packageJSON;

  if (!scripts.start) {
    packageJSON.scripts.start = 'fe-cli start';
  } else {
    console.log('Ignore scripts start');
  }

  if (!scripts.build) {
    packageJSON.scripts.build = 'fe-cli build';
  } else {
    console.log('Ignore scripts build');
  }

  if (isLibrary && !scripts['build-lib']) {
    packageJSON.scripts['build-lib'] = 'fe-cli build-lib'
  } else {
    console.log('Ignore scripts build-lib');
  }

  if (!scripts['lint']) {
    packageJSON.scripts['lint'] = 'eslint \'src/**/*.[jt]s?(x)\''
  } else {
    console.log('Ignore scripts lint');
  }

  if (!scripts['lint-fix']) {
    packageJSON.scripts['lint-fix'] = 'npm run lint -- --fix'
  } else {
    console.log('Ignore scripts lint');
  }

  if (!scripts['format']) {
    packageJSON.scripts['format'] = 'prettier \'src/**/*.[tj]s?(x)\' --check --write && npm run lint-fix'
  } else {
    console.log('Ignore scripts lint');
  }

  if (!browserslist) {
    packageJSON.browserslist = [];
    packageJSON.browserslist.push(
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

  fs.writeFile(packagePath, JSON.stringify(packageJSON, null, 2), { encoding: 'utf8' }, (err) => {
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
      resolve('done');
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
    const src = path.resolve(__dirname, '..', 'lint/.prettierrc');
    const target = path.resolve(process.cwd(), '.prettierrc');

    resolve(addFile(src, target));
  });

  const addProjectConfig = new Promise((resolve) => {
    const src = path.resolve(__dirname, '..', 'project.config.example.js');
    const target = path.resolve(process.cwd(), 'project.config.js');

    resolve(addFile(src, target));
  });

  const addLint = new Promise((resolve) => {
    let filename;
    if (isLibrary) {
      filename = 'lint/lib/.eslintrc.json';
    } else if (useTypeScript) {
      filename = 'lint/react-ts/.eslintrc.json';
    } else {
      filename = 'lint/react/.eslintrc.json';
    }

    const src = path.resolve(__dirname, '..', filename);
    const target = path.resolve(process.cwd(), '.eslintrc.json');

    resolve(addFile(src, target));
  });

  const addTSConfig = new Promise((resolve) => {
    let filename;
    if (isLibrary) {
      filename = 'typescript/lib/tsconfig.json';
    } else {
      filename = 'typescript/react/tsconfig.json';
    }

    const src = path.resolve(__dirname, '..', filename);
    const target = path.resolve(process.cwd(), 'tsconfig.json');

    resolve(addFile(src, target));
  });

  Promise.all([addPrettier, addProjectConfig, addLint, addTSConfig]).then((values) => {
    console.log('Files added: ', values.toString());
  }).catch((err) => {
    console.log(err);
  })
}

function init(options = {}) {
  addFileContainer(options);
  updateLocalPackage(options);
}

module.exports = init;
