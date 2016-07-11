import { readFile, glob }   from './helpers';
import { extname, resolve } from 'path';
import * as Babylon from 'babylon';
import Traverse     from 'babel-traverse';
import CodeFrame    from 'babel-code-frame';
import transformers from './transformers';
import Convert      from 'ansi-to-html';
import escapeHtml   from 'escape-html';
import 'colour';

const tags = ['__', '__n'];
const fns  = ['__', '__n', '__mf', '__l', '__h'];

const convert = new Convert({
	fg: '#000',
	bg: '#FFF'
});

const code_frame_options = {
	highlightCode: true
};

const babylon_options = {
	sourceType: "module",
	plugins: [
		"jsx",
		// "flow",
		"asyncFunctions",
		"classConstructorCall",
		"doExpressions",
		"trailingFunctionCommas",
		"objectRestSpread",
		"decorators",
		"classProperties",
		"exportExtensions",
		"exponentiationOperator",
		"asyncGenerators",
		"functionBind",
		"functionSent"
	]
};

function getPosition(code, start) {

	var line = 1;

	for (var i = 0, col = 0, ch = code[0], len = code.length; i < len; ch = code[++i], ++col) {

		if (ch == "\n") {
			line++;
			col = 0;
		}

		if (i == start) {
			return { line, col };
		}
	}

	return {};
}

/**
 * Collect locales from file.
 * 
 * @param  {String} file 
 * @param  {Array}  info
 * @return {Array<Object>}
 */
export function traverseFile(file, info = []) {
	return readFile(file).then((code) => {

		var ext = extname(file);

		code = transformers.reduce((code, transform) => transform(code, ext), code);

		Traverse(Babylon.parse(code, babylon_options), {

			TaggedTemplateExpression(path) {

				var { node } = path;

				if (!~tags.indexOf(node.tag.name)) {
					return;
				}

				var position = getPosition(code, node.start);

				info.push({
					string:    node.quasi.quasis.map(node => node.value.raw).join('%s'),
					fn:        node.tag.name,
					type:      "TaggedTemplateExpression",
					codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
					file, ...position
				});
			},

			CallExpression(path) {

				var { node }   = path,
					{ callee } = node,
					name;

				if (callee.type == "Identifier") {
					name = callee.name;
				} else 
				if (callee.type == "MemberExpression" && callee.property.type == "Identifier") {
					name = callee.property.name;
				} else {
					return;
				}

				if (!~fns.indexOf(name)) {
					return;
				}

				var { arguments: [first, second] } = node;

				if (typeof first != "undefined") {

					if (first.type == "StringLiteral") {

						var position = getPosition(code, node.start);

						info.push({
							string:    first.value,
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});

					} else 
					if (first.type == "TemplateLiteral") {

						var position = getPosition(code, node.start);

						info.push({
							string:    first.quasis.map(node => node.value.raw).join('%s'),
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});
					} else {

						var position = getPosition(code, node.start);
						
						info.push({
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});
					}
				}

				if (typeof second != "undefined") {

					if (second.type == "StringLiteral") {

						var position = getPosition(code, node.start);

						info.push({
							string:    second.value,
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});

					} else 
					if (second.type == "TemplateLiteral") {

						var position = getPosition(code, node.start);

						info.push({
							string:    second.quasis.map(node => node.value.raw).join('%s'),
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});
					} else {

						var position = getPosition(code, node.start);
						
						info.push({
							fn:        name,
							type:      "CallExpression",
							codeFrame: CodeFrame(code, position.line, position.col, code_frame_options),
							file, ...position
						});
					}
				}
			}
		});

		return Promise.resolve(info);
	});
}

/**
 * Collect locales from files by glob pattern.
 * 
 * @param  {Array<String>} masks
 * @param  {Array}  info
 * @return {Array<Object>}
 */
export function traverseGlob(masks, info = []) {

	if (!Array.isArray(masks)) {
		masks = [masks];
	}

	return masks.asyncForEach(mask => 

		glob(mask).then(files => 

			files.asyncForEach(file => 
				traverseFile(file, info)
			)
		)

	).then(() => Promise.resolve(info));
}

/**
 * Generate report for terminal.
 * 
 * @param  {Array<Object>|Object{added:Array<Object>, unused:Array<String>}} info
 * @param  {Boolean} withSummary
 * @return {String} 
 */
export function terminalReport(info, withSummary = false) {

	var report      = "", 
		currentFile = "",
		added       = [],
		unused      = [];

	if (!Array.isArray(info)) {
		unused  = info.unused;
		info    = info.added;
	}

	info.forEach(({ file, string, fn, codeFrame }) => {

		if (currentFile != file) {
			currentFile = file;
			report += `\n${'File:'.yellow} ${file.underline.cyan}\n\n`;
		}

		if (typeof string == "string") {

			report += `${'String:'.yellow} ${string.green}\n\n`;

			if (withSummary) {
				added.pushUnique(string);
			}

		} else {
			report += `${'Function:'.yellow} ${fn.green}\n\n`;
		}

		report += `${codeFrame}\n\n`;
	});

	if (withSummary && (added.length || unused.length)) {

		var summary = "\nSummary:\n\n";

		if (added.length) {
			summary += `Added:\n\n${added.join("\n")}\n\n`;
		}

		if (unused.length) {
			summary += `Unused:\n\n${unused.join("\n")}\n\n`;
		}

		report = summary + report;
	}

	return report;
}

/**
 * Generate report as html.
 * 
 * @param  {Array<Object>|Object{added:Array<Object>, unused:Array<String>}} info
 * @param  {Boolean} withSummary
 * @return {String} 
 */
export function htmlReport(info, withSummary = false) {

	var report      = "",
		currentFile = "",
		added       = [],
		unused     = [];

	if (!Array.isArray(info)) {
		unused = info.unused;
		info    = info.added;
	}

	info.forEach(({ file, string, fn, codeFrame }) => {

		if (currentFile != file) {
			currentFile = file;
			report += `<br><h1>File:&nbsp;<span>${file}</span></h1>`;
		}

		if (typeof string == "string") {

			report += `<h3>String:&nbsp;<span>${string}</span></h2>`;

			if (withSummary) {
				added.pushUnique(string);
			}

		} else {
			report += `<h3>Function:&nbsp;<span>${fn}</span></h2>`;
		}

		report += `<pre>${escapeHtml(codeFrame.replace(/\t/g, "    "))}</pre>`;
		report += `<small>${file}</small><br>`;
	});

	if (withSummary && (added.length || unused.length)) {

		var summary = "<h1>Summary:</h1>";

		if (added.length) {
			summary += `<h3>Added:</h3><pre>${escapeHtml(added.join("\n"))}</pre><br>`;
		}

		if (unused.length) {
			summary += `<h3>Unused<sup>(maybe)</sup>:</h3><pre>${escapeHtml(unused.join("\n"))}</pre><br>`;
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
			${convert.toHtml(report)}
		</body>
	</html>`;

	return report;
}

/**
 * Show difference info.
 * 
 * @param  {Array<Object>} info
 * @param  {String}        pathToJson
 * @return {Object{added:Array<Object>, unused:Array<String>}}
 */
export function diff(info, pathToJson) {

	var base = require(resolve(process.cwd(), pathToJson)),
		strs = [],
		added, unused;

	added = info.filter(({ string }) => {

		if (typeof string == "undefined") {
			return true;
		}

		strs.push(string);

		if (base.hasOwnProperty(string)) {
			return false;
		}

		return true;
	});

	unused = Object.keys(base).filter((string) => {

		if (~strs.indexOf(string)) {
			return false;
		}

		return true;

	});

	return { added, unused };
}