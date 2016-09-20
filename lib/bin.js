#!/usr/bin/env node
'use strict';

require('./force-color');

var _argueCli = require('argue-cli');

var Argue = _interopRequireWildcard(_argueCli);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _findRc = require('find-rc');

var _findRc2 = _interopRequireDefault(_findRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sources = void 0;var transformers = void 0;

var _Argue$options = Argue.options(["summary", "html", "strings"], [["exclude"], ["compare"]]);

var exclude = _Argue$options.exclude;
var compare = _Argue$options.compare;
var summary = _Argue$options.summary;
var html = _Argue$options.html;
var strings = _Argue$options.strings;


var rcPath = (0, _findRc2.default)('localer');
var rcConfigs = {
	sources: [],
	transformers: [],
	exclude: [],
	compare: [],
	summary: false,
	html: false,
	strings: false
};

if (rcPath) {
	Object.assign(rcConfigs, require(rcPath));
}

sources = Argue.argv.length ? Argue.argv : rcConfigs.sources;
transformers = rcConfigs.transformers;

exclude = Array.isArray(exclude) && exclude.length ? exclude : rcConfigs.exclude;
compare = Array.isArray(compare) && compare.length ? compare : rcConfigs.compare;
summary = summary || rcConfigs.summary;
html = html || rcConfigs.html;
strings = strings || rcConfigs.strings;

main();
function main() {
	var _locales$transformers;

	var locales = new _lib2.default();
	(_locales$transformers = locales.transformers).push.apply(_locales$transformers, _toConsumableArray(transformers));

	locales.fromFiles(sources).then(function () {

		if (compare) {
			return locales.diffFiles(compare);
		}

		return locales;
	}).then(function (locales) {

		if (exclude) {
			return locales.excludeFiles(exclude);
		}

		return locales;
	}).then(function (locales) {

		if (html) {
			console.log(locales.htmlReport(summary, strings));
		} else {
			console.log(locales.terminalReport(summary, strings));
		}

		process.exit(Number(Boolean(compare && locales.locales.length)));
	}).catch(function (err) {
		console.error(err);
		process.exit(1);
	});
}