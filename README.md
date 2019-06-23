# node-passgen
[![version](https://img.shields.io/npm/v/node-passgen.svg?style=flat-square)](https://www.npmjs.com/package/node-passgen)
[![license](https://img.shields.io/github/license/vyushin/node-passgen.svg?style=flat-square)](https://github.com/vyushin/node-passgen/blob/master/LICENSE)

node-passgen is a CLI utility with zero dependencies to generate strong password

## Installation

###### NPM
`npm install -g node-passgen`

## Usage

```bash
node-passgen --length 24
# 1y5k[q0~F3y7:O0O429KEq
```

## Options

```bash
--numbers, -n       Use numbers
--uppercase, -u     Use uppercase
--lowercase, -l     Use lowercase
--symbols, -s       Sse symbols
--length            Password length
--help, -h          Help
```

## Settings

Set default node-passgen options:

```bash
node-passgen set-option numbers <true|false>
node-passgen set-option uppercase <true|false>
node-passgen set-option lowercase <true|false>
node-passgen set-option symbols <true|false>
node-passgen set-option length <number>
```

Show settings:

```bash
node-passgen get-options
```

## Help

```bash
node-passgen --help
```

## License
[MIT LICENSE](https://github.com/vyushin/node-passgen/blob/master/LICENSE)
