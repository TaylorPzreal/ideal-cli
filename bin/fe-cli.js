#!/usr/bin/env node
const { Command } = require('commander');
const webpackInit = require('../webpack');


const program = new Command();

program
  .version('0.1.0');

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

  })

program
  .command('format')
  .description('Format code')
  .action(() => {

  })

program
  .parse(process.argv);


console.log(process.argv)
