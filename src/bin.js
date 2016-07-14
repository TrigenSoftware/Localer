#!/usr/bin/env node

import './force-color';
import * as Argue from 'argue-cli';
import * as Localer from './lib';

const { html, exclude, compare, summary } = Argue.options([
	"html", "summary"
], [
	["exclude"],
	["compare"]
]);

Localer.traverseGlob(Argue.argv)
.then((info) => {

	if (compare) {
		return Localer.diff(compare, info);
	}

	return Promise.resolve(info);
})
.then((info) => {

	if (exclude) {
		return Localer.exclude(exclude, info);
	}

	return Promise.resolve(info);
})
.then((info) => {

	if (html) {
		console.log(Localer.htmlReport(info, summary));
	} else {
		console.log(Localer.terminalReport(info, summary));
	}

})
.catch(console.error);