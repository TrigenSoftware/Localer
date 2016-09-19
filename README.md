[![NPM](https://nodei.co/npm/localer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/localer/)

# Localer
Locales collector from js sources.


# Global usage

```
localer [...glob patterns to js source] [--html to generate html] [--summary to show list of added and unused locales] [--compare [...glob patterns to json] to show difference] [--exclude [...glob patterns to json] to exclude locales]
```

# Examples

For example, you have this code:

```js
const translate = __`Translate me!`; 
const withoutTranslation = __`Without translation`; 
```

and JSON file with translations:

```json
{
	"Translate me!": "Переведи меня!",
	"Unused translation": "Неиспользованный перевод"
}
```

If you execute next command:

```bash
localer main.js --summary --compare ru.json
```

you'll get:

```bash

Summary:

Added:

Without translation

Unused (maybe):

Unused translation


File: main.js

String: Without translation

  1 | const translate = __`Translate me!`; 
> 2 | const withoutTranslation = __`Without translation`;
    |                            ^

```


# API

## `class Locales(Array<LocaleSource>|Locales  fromLocalesOrLocales, Array<String> fromUnused)`

### Properties:

#### `Array<String> tags = ['__', '__n']`

Tagged literals.

#### `Array<String> fns = ['__', '__n', '__mf', '__l', '__h']`

Functions with one argument.

#### `Array<String> fns2 = ['__n']`

Functions with few argument.

#### `Convert convert`

ANSI to HTML instance.

#### `Object babylonOptions`

Babylon parser options.

#### `Array<Function> transformers = []`

Code transformers.

#### `Array<LocaleSource> locales = []`

Locales soruces.

#### `Array<String> unused = []`

Unused locales.

### Methods:

#### `void from(Locales locales)`

Import data from other instance.

#### `Locales copy()`

Create copy of this.

#### `Locales fromCode(String code, String file)`

Collect locales from source code. 

#### `Promise<Locales> fromFiles(String maskOrMasks)`

Collect locales from JavaScript source files by glob pattern.

#### `Locales exclude(Array<String|LocaleSource>|Object<String,any> arrayOrObjectToExlcude)`

Exclude given locales from `locales` and `unused`.

#### `Promise<Locales> excludeFiles(String|Array<String> maskOrMasks)`

Exclude locales getted from JSON files from `locales` and `unused`.

#### `Locales diff(Array<String|LocaleSource>|Object<String,any> arrayOrObjectBase)`

Get difference between locales parsed from JavaScript sources and locales.

#### `Promise<Locales> diffFiles(String|Array<String> maskOrMasks)`

Get difference between locales parsed from JavaScript sources and locales from JSON files.

#### `String terminalReport(Boolean withSummary = false)`

Generate report for terminal.

#### `String htmlReport(Boolean withSummary = false)`

Generate report as html.

## `class LocaleSource(String|LocaleSource fileOrLocaleSource, String code, Node node, String fn, String string)`

### Properties:

#### `String file`

Path to file.

#### `String type`

Type of node.

#### `Number line`

Line of token.

#### `Number column`

Column of token.

#### `String fn`

Function name.

#### `String string`

Locale string.

#### `String codeFrame`

Code frame.

### Methods:

#### `void from(LocaleSource localeSource)`

Import data from other instance.

#### `LocaleSource copy()`

Create copy of this.
