const { writeFileSync } = require('fs');
const { resolve } = require('path');
const options = require('./options');
const argv = process.argv.slice(2);

/**
 * Help message
 * @const
 */
const helpInfo = `
NODE-PASSGEN HELP

Usage: 
  node-passgen [--length <number>] [--numbers, -n] [--uppercase, -u] [--lowercase, -l] [--symbols, -s] [--help, -h]

Options:
  --numbers, -n       Use numbers
  --uppercase, -u     Use uppercase
  --lowercase, -l     Use lowercase
  --symbols, -s       Sse symbols
  --length            Password length
  --help, -h          Help
  
Set option usage: 
  node-passgen set-option [--option, -o <${without(Object.keys(options), ['length']).join('|')}>] <value>
  
Options:
  --option, -o        Option name
  
Get options:
  node-passgen get-options
`;

/**
 * Returns random number
 * @param {[Number, Number]} diapason [min, max]
 * @return {Number} Random number
 */
function random(diapason) {
  return Math.floor(diapason[0] + Math.random() * (diapason[1] + 1 - diapason[0]));
}

/**
 * Returns array without values
 * @param {Array} arr to filter
 * @param {Array} values Values Discarded values
 * @return {Array}
 */
function without(arr, values) {
  return arr.filter(item => values.includes(item) === false);
}

/**
 * Search values in array
 * @param {Array} arr Array to search
 * @param {Array} values Values to search
 * @return {Boolean} Returns true if arr has one of values
 */
function includes(arr, values) {
  return arr.some(item => values.includes(item));
}

/**
 * Get value from argv
 * @param {String} key Key of parameter
 * @return {*}
 */
function getArgValue(key) {
  const index = argv.findIndex(item => item === key) + 1;
  const value = argv[index > 0 ? index : null];
  return (!index || !value) ? null : value;
}

/**
 * Parse options and returns them. The function caches result
 * @param {Object} defaultOptions From options.json
 */
const getOption = ((defaultOptions) => {
  let parsedOptions = null;
  /**
   * @param {String} key Option key
   * @return {Object} Parsed options
   */
  return (key) => {
    if (parsedOptions) return parsedOptions[key];
    parsedOptions = {
      numbers: includes(argv, ['-n', '--number']) || defaultOptions.numbers.value,
      uppercase: includes(argv, ['-u', '--uppercase']) || defaultOptions.uppercase.value,
      lowercase: includes(argv, ['-l', '--lowercase']) || defaultOptions.lowercase.value,
      symbols: includes(argv, ['-s', '--symbols']) || defaultOptions.symbols.value,
      length: includes(argv, ['--length']) && Math.abs(getArgValue('--length')) || defaultOptions.length.value,
    };
    return parsedOptions[key];
  };
})(options);

function setOption(key, value) {
  const possibleKeys = Object.keys(options);
  const clonedOptions = Object.assign({}, options);
  const isBoolean = value => `${value}` === 'true' || `${value}` === 'false';
  const isNumber = value => !isNaN(parseInt(value));

  !includes(possibleKeys, [key]) && (
    console.error(`\nOption "${key}" doesn't exist`),
    console.info(helpInfo),
    process.exit(1)
  );

  clonedOptions[key].type === 'boolean' && !isBoolean(value) && (
    console.error(`\nInvalid "${key}" value. It must be boolean`),
    console.info(helpInfo),
    process.exit(1)
  );

  clonedOptions[key].type === 'number' && !isNumber(value) && (
    console.error(`\nInvalid "${key}" value. It must be number`),
    console.info(helpInfo),
    process.exit(1)
  );

  clonedOptions[key].value = clonedOptions[key].type === 'boolean' ? JSON.parse(value) : Math.abs(parseInt(value));
  writeFileSync(resolve('./options.json'), JSON.stringify(clonedOptions));
}

/**
 * Diapasones of UTF-8 chars
 * @const
 */
const charDiapasones = [
  getOption('numbers')   ? [[48, 57 ]] : null,
  getOption('uppercase') ? [[65, 90 ]] : null,
  getOption('lowercase') ? [[97, 122]] : null,
  getOption('symbols')   ? [[33, 47], [58, 64], [91, 96], [123, 126]] : null,
]
  .filter(Boolean);

/**
 * Generate password
 * @return {String}
 */
function passgen() {
  return Array(getOption('length')).fill().map(item => {
    const smb = charDiapasones[random([0, charDiapasones.length - 1])];
    return String.fromCharCode(random(smb[random([0, smb.length - 1])]));
  }).join('');
}

includes(argv, ['--help', '-h']) && (
  console.info(helpInfo),
  process.exit(0)
);

argv[0] === 'set-option' && (
  setOption(getArgValue('set-option'), getArgValue(getArgValue('set-option'))),
  process.exit(0)
);

argv[0] === 'get-options' && (
  console.info(Object.keys(options).map(key => `${key}=${getOption(key)}`).join('\n')),
  process.exit(0)
);

console.log(passgen());