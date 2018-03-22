const fs = require('fs-extra');
const regex = require('../src/runtime/props.js');

fs.outputFileSync('./lib/runtime/props.js', `module.exports = ${regex}`);
