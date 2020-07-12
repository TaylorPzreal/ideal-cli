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
  .action((cmd) => {
    console.log('Starting webserver ... ')
    webpackInit('start');
  })

program
  .command('build')
  .description('Build for production web')
  .action((cmd) => {
    console.log('Building project ... ')
    webpackInit('build');
  })

program
  .command('build-lib')
  .description('Build for library')
  .action((cmd) => {
    console.log('Building library ... ')
    webpackInit('build-lib');
  })

program
  .command('lint')
  .description('Check code lint')
  .action((cmd) => {
    console.log('not support')
  })

program
  .command('format')
  .description('Format code')
  .action((cmd) => {
    console.log('not support')
  })

program
  .parse(process.argv);

