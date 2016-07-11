#!/usr/bin/env node

import './force-color';
import * as Argue from 'argue-cli';
import * as Localer from './lib';

const { html, compare, summary } = Argue.options([
	"html", "summary"
], [
	"compare"
]);

Localer.traverseGlob(Argue.argv).then(info => {

	if (compare) {
		info = Localer.diff(info, compare);
	}

	if (html) {
		console.log(Localer.htmlReport(info, summary));
	} else {
		console.log(Localer.terminalReport(info, summary));
	}

}).catch(console.error);