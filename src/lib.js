import { pushUnique, asyncForEach, readFile, glob } from './helpers';
import * as Babylon from 'babylon';
import Traverse     from 'babel-traverse';
import CodeFrame    from 'babel-code-frame';
import Convert      from 'ansi-to-html';
import escapeHtml   from 'escape-html';
import Path         from 'path';
import 'colour';

const codeFrameOptions = {
	highlightCode: true
};

export default class Locales {

	/**
	 * Tagged literals.
	 * @type {Array<String>}
	 */
	tags = ['__', '__n'];

	/**
	 * Functions with one argument.
	 * @type {Array<String>}
	 */
	fns = ['__', '__n', '__mf', '__l', '__h'];

	/**
	 * Functions with few argument.
	 * @type {Array<String>}
	 */
	fns2 = ['__n'];

	/**
	 * ANSI to HTML instance.
	 * @type {Convert}
	 */
	convert = new Convert({
		fg: '#000',
		bg: '#FFF'
	});

	/**
	 * Babylon parser options.
	 * @type {Object}
	 */
	babylonOptions = {
		sourceType: 'module',
		plugins:    [
			'jsx',
			// "flow",
			'asyncFunctions',
			'classConstructorCall',
			'doExpressions',
			'trailingFunctionCommas',
			'objectRestSpread',
			'decorators',
			'classProperties',
			'exportExtensions',
			'exponentiationOperator',
			'asyncGenerators',
			'functionBind',
			'functionSent'
		]
	};

	/**
	 * Code transformers.
	 * @type {Array<Function>}
	 */
	transformers = [];

	/**
	 * Locales soruces.
	 * @type {Array<LocaleSources>}
	 */
	locales = [];

	/**
	 * Unused locales.
	 * @type {Array<String>}
	 */
	unused = [];

	/**
	 * Locales constructor.
	 *
	 * @param  {Array<LocaleSource>|Locales}  fromLocalesOrLocales
	 * @param  {Array<String>}                fromUnused
	 * @return {Locales}
	 */
	constructor(fromLocalesOrLocales = [], fromUnused = []) {

		if (fromLocalesOrLocales instanceof Locales) {
			this.from(fromLocalesOrLocales);
			return;
		}

		if (!Array.isArray(fromLocalesOrLocales) || !Array.isArray(fromUnused)) {
			throw new Error('Invalid arguments.');
		}

		const fromLocales = fromLocalesOrLocales,
			{ locales, unused } = this;

		fromLocales.forEach((localeSource) => {

			if (!(localeSource instanceof LocaleSource)) {
				throw new Error('Invalid locale source.');
			}

			locales.push(localeSource.copy());
		});

		fromUnused.forEach((localeString) => {

			if (typeof localeString != 'string') {
				throw new Error('Invalid locale string.');
			}

			unused.push(localeString);
		});
	}

	/**
	 * Import data from other instance.
	 *
	 * @param  {Locales} locales
	 * @return {this}
	 */
	from(locales) {

		if (!(locales instanceof Locales)) {
			throw new Error('Invalid locales.');
		}

		this.convert = locales.convert;

		this.tags = locales.tags.slice();
		this.fns = locales.fns.slice();
		this.fns2 = locales.fns2.slice();
		this.transformers = locales.transformers.slice();

		this.babylonOptions = {
			...locales.babylonOptions,
			plugins: locales.babylonOptions.plugins.slice()
		};

		this.locales = [];
		locales.locales.forEach((localeSource) => {

			if (!(localeSource instanceof LocaleSource)) {
				throw new Error('Invalid locale source.');
			}

			this.locales.push(localeSource.copy());
		});

		this.unused = [];
		locales.unused.forEach((localeString) => {

			if (typeof localeString != 'string') {
				throw new Error('Invalid locale string.');
			}

			this.unused.push(localeString);
		});

		return this;
	}

	/**
	 * Create copy of this.
	 *
	 * @return {Locales}
	 */
	copy() {
		return new Locales(this);
	}

	/**
	 * Collect locales from source code.
	 *
	 * @param  {String} code
	 * @param  {String} file
	 * @return {this}
	 */
	fromCode(sourceCode, file) {

		if (typeof sourceCode != 'string') {
			throw new Error('Invalid arguments.');
		}

		let extname = '.js';

		if (typeof file == 'string') {
			extname = Path.extname(file);
		}

		const { tags, fns, fns2, transformers, babylonOptions, locales } = this;

		const code = transformers.reduce((code, transform) =>
			transform(code, extname),
			sourceCode
		);

		Traverse(Babylon.parse(code, babylonOptions), {

			TaggedTemplateExpression(path) {

				const { node } = path;

				if (!~tags.indexOf(node.tag.name)) {
					return;
				}

				locales.push(new LocaleSource(
					file,
					code,
					node,
					node.tag.name,
					node.quasi.quasis.map(node => node.value.raw).join('%s')
				));
			},

			CallExpression(path) {

				const { node } = path,
					{ callee } = node;

				let name = '';

				if (callee.type == 'Identifier') {
					name = callee.name;
				} else
				if (callee.type == 'MemberExpression' && callee.property.type == 'Identifier') {
					name = callee.property.name;
				} else {
					return;
				}

				if (!~fns.indexOf(name)) {
					return;
				}

				const { arguments: [first, second] } = node;

				if (typeof first != 'undefined') {

					if (first.type == 'StringLiteral') {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name,
							first.value
						));

					} else
					if (first.type == 'TemplateLiteral') {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name
							// first.quasis.map(node => node.value.raw).join('%s')
						));
					} else {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name
						));
					}
				}

				if (typeof second != 'undefined' && ~fns2.indexOf(name)) {

					if (second.type == 'StringLiteral') {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name,
							second.value
						));

					} else
					if (second.type == 'TemplateLiteral') {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name
							// second.quasis.map(node => node.value.raw).join('%s')
						));
					} else {

						locales.push(new LocaleSource(
							file,
							code,
							node,
							name
						));
					}
				}
			}
		});

		return this;
	}

	/**
	 * Collect locales from JavaScript source files by glob pattern.
	 *
	 * @param  {String|Array<String>} maskOrMasks
	 * @return {Promise<this>}
	 */
	fromFiles(maskOrMasks) {

		let masks = [];

		if (typeof maskOrMasks == 'string') {
			masks = [maskOrMasks];
		} else
		if (Array.isArray(maskOrMasks)) {
			masks = maskOrMasks;
		} else {
			throw new Error('Invalid arguments.');
		}

		return glob(masks).then(files =>

			asyncForEach(files, file =>

				readFile(file).then(code =>
					this.fromCode(code, file)
				)
			)
		).then(() => this);
	}

	/**
	 * Exclude given locales from `locales` and `unused`.
	 *
	 * @param  {Array<String|LocaleSource>|Object<String,any>} arrayOrObjectToExlcude
	 * @return {this}
	 */
	exclude(arrayOrObjectToExlcude) {

		let exclude = [];

		if (Array.isArray(arrayOrObjectToExlcude)) {
			exclude = arrayOrObjectToExlcude
				.map((locale) => {

					if (locale instanceof LocaleSource) {
						return locale.string;
					} else
					if (typeof locale == 'string') {
						return locale;
					} else {
						throw new Error('Invalid locale to exclude.');
					}
				});
		} else
		if (typeof arrayOrObjectToExlcude == 'object' && arrayOrObjectToExlcude != null) {
			exclude = Object.keys(arrayOrObjectToExlcude);
		} else {
			throw new Error('Invalid arguments.');
		}

		this.locales = this.locales.filter(({ string }) =>
			!~exclude.indexOf(string)
		);

		this.unused = this.unused.filter(string =>
			!~exclude.indexOf(string)
		);

		return this;
	}

	/**
	 * Exclude locales getted from JSON files from `locales` and `unused`.
	 *
	 * @param  {String|Array<String>} maskOrMasks
	 * @return {Promise<this>}
	 */
	excludeFiles(maskOrMasks) {

		const cwd = process.cwd();

		let masks = [];

		if (typeof maskOrMasks == 'string') {
			masks = [maskOrMasks];
		} else
		if (Array.isArray(maskOrMasks)) {
			masks = maskOrMasks;
		} else {
			throw new Error('Invalid arguments.');
		}

		return glob(masks).then(files =>

			files.forEach(file =>
				this.exclude(
					require(Path.resolve(cwd, file))
				)
			)
		).then(() => this);
	}

	/**
	 * Get difference between locales parsed from JavaScript sources and locales.
	 *
	 * @param  {Array<String|LocaleSource>|Object<String,any>} arrayOrObjectBase
	 * @return {Locales}
	 */
	diff(arrayOrObjectBase) {

		let base = [];

		if (Array.isArray(arrayOrObjectBase)) {
			base = arrayOrObjectBase
				.map((locale) => {

					if (locale instanceof LocaleSource) {
						return locale.string;
					} else
					if (typeof locale == 'string') {
						return locale;
					} else {
						throw new Error('Invalid locale to exclude.');
					}
				});
		} else
		if (typeof arrayOrObjectBase == 'object' && arrayOrObjectBase != null) {
			base = Object.keys(arrayOrObjectBase);
		} else {
			throw new Error('Invalid arguments.');
		}

		const compareResult = new Locales(this),
			usedStrings     = [];

		compareResult.locales = compareResult.locales.filter(({ string }) => {

			if (typeof string == 'undefined') {
				return true;
			}

			usedStrings.push(string);

			return !~base.indexOf(string);
		});

		compareResult.unused = base.filter(string =>
			!~usedStrings.indexOf(string)
		);

		return compareResult;
	}

	/**
	 * Get difference between locales parsed from JavaScript sources and locales from JSON files.
	 *
	 * @param  {String|Array<String>} maskOrMasks
	 * @return {Promise<Locales>}
	 */
	diffFiles(maskOrMasks) {

		const cwd = process.cwd();

		let masks = [];

		if (typeof maskOrMasks == 'string') {
			masks = [maskOrMasks];
		} else
		if (Array.isArray(maskOrMasks)) {
			masks = maskOrMasks;
		} else {
			throw new Error('Invalid arguments.');
		}

		const base = [];

		return glob(masks).then(files =>

			files.forEach((file) => {

				const json = require(Path.resolve(cwd, file));

				if (Array.isArray(json)) {
					base.push(...json);
				} else {
					base.push(...Object.keys(json));
				}
			})
		).then(() => this.diff(base));
	}

	/**
	 * Generate report for terminal.
	 *
	 * @param  {Boolean} withSummary
	 * @return {String}
	 */
	terminalReport(withSummary = false, onlyStrings = false) {

		const { locales, unused } = this,
			added = [];

		let report      = '',
			currentFile = '';

		locales.forEach(({ file, string, fn, codeFrame }) => {

			let chunk = '';

			if (typeof string == 'string') {

				chunk += `${'String:'.yellow} ${string.green}\n\n`;

				if (withSummary) {
					pushUnique(added, string);
				}

			} else
			if (!onlyStrings) {
				chunk += `${'Function:'.yellow} ${fn.green}\n\n`;
			} else {
				return;
			}

			if (currentFile != file) {
				currentFile = file;
				chunk = `\n${'File:'.yellow} ${file.underline.cyan}\n\n${chunk}`;
			}

			report += `${chunk}${codeFrame}\n\n`;
		});

		if (withSummary && (added.length || unused.length)) {

			let summary = '\nSummary:\n\n'.yellow;

			if (added.length) {
				summary += `    ${'Added:'.yellow}\n        ${added.join('\n        ')}\n\n`;
			}

			if (unused.length) {
				summary += `    ${'Unused (maybe):'.yellow}\n        ${unused.join('\n        ')}\n\n`;
			}

			report = summary + report;
		}

		return report;
	}

	/**
	 * Generate report as html.
	 *
	 * @param  {Boolean} withSummary
	 * @return {String}
	 */
	htmlReport(withSummary = false, onlyStrings = false) {

		const { locales, unused } = this,
			added = [];

		let report      = '',
			currentFile = '';

		locales.forEach(({ file, string, fn, codeFrame }) => {

			let chunk = '';

			if (typeof string == 'string') {

				chunk += `<h3>String:&nbsp;<span>${string}</span></h2>`;

				if (withSummary) {
					pushUnique(added, string);
				}

			} else
			if (!onlyStrings) {
				chunk += `<h3>Function:&nbsp;<span>${fn}</span></h2>`;
			} else {
				return;
			}

			if (currentFile != file) {
				currentFile = file;
				chunk = `<br><h1>File:&nbsp;<span>${file}</span></h1>${chunk}`;
			}

			report += `${chunk}<pre>${escapeHtml(codeFrame.replace(/\t/g, '    '))}</pre>`;
			report += `<small>${file}</small><br>`;
		});

		if (withSummary && (added.length || unused.length)) {

			let summary = '<h1>Summary:</h1>';

			if (added.length) {
				summary += `<h3>Added:</h3><pre>${escapeHtml(added.join('\n'))}</pre><br>`;
			}

			if (unused.length) {
				summary += `<h3>Unused<sup>(maybe)</sup>:</h3><pre>${escapeHtml(unused.join('\n'))}</pre><br>`;
			}

			report = summary + report;
		}

		report = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
				<title>REPORT</title>
				<style>

					body {
						font-family: Arial, Calibri;
						overflow-x: hidden;
					}

					h1 {
						font-size: 1.5em;
					}

					h1 span {
						font-family: monospace;
						font-size: 1.4em;
						font-weight: normal;
						margin-left: .25em;
						text-decoration: underline;
					}

					h3 span {
						font-family: monospace;
						font-size: 1.45em;
						font-weight: normal;
						margin-left: .25em;
					}

					h3 sup {
						font-size: .7em;
					}

					pre {
						color: #000;
						padding: 1em .5em;
						border: 1px solid #000;
					}

					pre b {
						font-weight: normal;
					}

					small {
						font-family: monospace;
					}

				</style>
			</head>
			<body>
				${this.convert.toHtml(report)}
			</body>
		</html>`;

		return report;
	}
}

export class LocaleSource {

	/**
	 * Path to file.
	 * @type {String}
	 */
	file = null;

	/**
	 * Type of node.
	 * @type {String}
	 */
	type = null;

	/**
	 * Line of token.
	 * @type {Number}
	 */
	line = null;

	/**
	 * Column of token.
	 * @type {Number}
	 */
	column = null;

	/**
	 * Function name.
	 * @type {String}
	 */
	fn = null;

	/**
	 * Locale string.
	 * @type {String}
	 */
	string = null;

	/**
	 * Code frame.
	 * @type {String}
	 */
	codeFrame = null;

	/**
	 * LocaleSource constructor.
	 *
	 * @param  {String|LocaleSource} fileOrLocaleSource
	 * @param  {String}              code
	 * @param  {Node}                node
	 * @param  {String}              fn
	 * @param  {String}              string
	 * @return {LocaleSource}
	 */
	constructor(fileOrLocaleSource, code, node, fn, string) {

		if (fileOrLocaleSource instanceof LocaleSource) {
			this.from(fileOrLocaleSource);
			return;
		}

		const file = fileOrLocaleSource;

		if (typeof file != 'string' && typeof file != 'undefined') {
			throw new Error('File path must be a string');
		}

		if (typeof code != 'string') {
			throw new Error('Code must be setted');
		}

		if (typeof node != 'object' || typeof node.type != 'string') {
			throw new Error('Node be setted');
		}

		if (typeof fn != 'string') {
			throw new Error('Function name must be setted');
		}

		if (typeof string != 'string' && typeof string != 'undefined') {
			throw new Error('Locale string must be setted');
		}

		this.file = file;
		this.type = node.type;
		this.line = node.loc.start.line;
		this.column = node.loc.start.column + 1;
		this.fn = fn;
		this.string = string;

		this.codeFrame = CodeFrame(code, this.line, this.column, codeFrameOptions);
	}

	/**
	 * Import data from other instance.
	 *
	 * @param  {LocaleSource} localeSource
	 * @return {this}
	 */
	from(localeSource) {

		if (!(localeSource instanceof LocaleSource)) {
			throw new Error('Invalid locale source.');
		}

		this.file = localeSource.file;
		this.type = localeSource.type;
		this.line = localeSource.line;
		this.column = localeSource.column;
		this.fn = localeSource.fn;
		this.string = localeSource.string;
		this.codeFrame = localeSource.codeFrame;

		return this;
	}

	/**
	 * Create copy of this.
	 *
	 * @return {LocaleSource}
	 */
	copy() {
		return new LocaleSource(this);
	}
}
