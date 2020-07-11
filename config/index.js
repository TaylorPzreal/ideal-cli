const path = require('path');
const fs = require('fs');

const packagePath = path.resolve(process.cwd() + '/package.json');
const packageJSON = require(packagePath);

console.log(packagePath, '=====');

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


function init() {
  updateLocalPackage();
}

module.exports = init;
