const path = require('path');
const fs = require('fs');

const packagePath = path.resolve(process.cwd() + '/package.json');
const packageJSON = require(packagePath);

// TODO: check errors
function updateLocalPackage() {
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

  if (!scripts['build-lib']) {
    packageJSON.scripts['build-lib'] = 'fe-cli build-lib'
  } else {
    console.log('Ignore scripts build-lib');
  }

  if (!scripts['lint']) {
    packageJSON.scripts['lint'] = 'eslint \'src/**/*.[jt]s?x\''
  } else {
    console.log('Ignore scripts lint');
  }

  if (!scripts['lint-fix']) {
    packageJSON.scripts['lint-fix'] = 'npm run lint -- --fix'
  } else {
    console.log('Ignore scripts lint');
  }

  if (!scripts['format']) {
    packageJSON.scripts['format'] = 'prettier \'src/**/*.[tj]s?(x)\' && npm run lint-fix'
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

function addPrettier() {
  const src = path.resolve(__dirname, '..', 'lint/.prettierrc');
  const target = path.resolve(process.cwd(), '.prettierrc');

  console.log(src, target);

  if (fs.existsSync(target)) {
    return;
  }

  fs.copyFile(src, target, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Added prettier');
  })
}

function init() {
  addPrettier();
  updateLocalPackage();
}

module.exports = init;
