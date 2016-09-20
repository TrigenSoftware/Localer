#!/usr/bin/env node

import './force-color';
import * as Argue from 'argue-cli';
import Locales    from './lib';
import FindRc     from 'find-rc';

let sources, transformers,
	{ exclude, compare, summary, html } = Argue.options([
		"summary", "html"
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
	html:         false
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
			console.log(locales.htmlReport(summary));
		} else {
			console.log(locales.terminalReport(summary));
		}

		process.exit(Number(Boolean(compare && locales.locales.length)));
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
}