#!/usr/bin/env node
const { Command } = require('commander');
const webpackInit = require('../webpack');
const packageJSON = require('../package.json');
const init = require('../config');

const program = new Command();

program
  .version(packageJSON.version);

program
  .command('init')
  .description('Initialize configuration')
  .option('--useTypeScript', 'The main language is TypeScript')
  .option('--isLibrary', 'The project is a common library')
  .action((cmd) => {
    console.log('Initializing ... ');
    const { useTypeScript, isLibrary } = cmd;
    init({ useTypeScript, isLibrary });
  })

program
  .command('start')
  .description('Start for development web')
  .action(() => {
    console.log('Starting webserver ... ')
    webpackInit('start');
  })

program
  .command('build')
  .description('Build for production web')
  .action(() => {
    console.log('Building project ... ')
    webpackInit('build');
  })

program
  .command('build-lib')
  .description('Build for library')
  .action(() => {
    console.log('Building library ... ')
    webpackInit('build-lib');
  })

program
  .parse(process.argv);

