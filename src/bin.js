#!/usr/bin/env node

import './force-color';
import * as Argue from 'argue-cli';
import Locales    from './lib';
import FindRc     from 'find-rc';

let sources, transformers,
	{ exclude, compare, summary, html, strings } = Argue.options([
		"summary", "html", "strings"
	], [
		["exclude"],
		["compare"]
	]);

const rcPath    = FindRc('localer');
const rcConfigs = {
	sources:      [],
	transformers: [],
	exclude:      [],
	compare:      [],
	summary:      false,
	html:         false,
	strings:      false
};

if (rcPath) {
	Object.assign(rcConfigs, require(rcPath));
}

sources = Argue.argv.length ? Argue.argv : rcConfigs.sources;
transformers = rcConfigs.transformers;

exclude = Array.isArray(exclude) && exclude.length ? exclude : rcConfigs.exclude;
compare = Array.isArray(compare) && compare.length ? compare : rcConfigs.compare;
summary = summary || rcConfigs.summary;
html    = html    || rcConfigs.html;
strings = strings || rcConfigs.strings;

main();
function main() {

	let locales = new Locales();
	locales.transformers.push(...transformers);

	locales.fromFiles(sources)
	.then(() => {

		if (compare) {
			return locales.diffFiles(compare);
		}

		return locales;
	})
	.then((locales) => {

		if (exclude) {
			return locales.excludeFiles(exclude);
		}

		return locales;
	})
	.then((locales) => {

		if (html) {
			console.log(locales.htmlReport(summary, strings));
		} else {
			console.log(locales.terminalReport(summary, strings));
		}

		let allLocalesAreTranslated = locales.locales;

		if (strings) {
			allLocalesAreTranslated = allLocalesAreTranslated.filter(({string}) => string);
		}

		process.exit(Number(Boolean(compare && allLocalesAreTranslated.length)));
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
}