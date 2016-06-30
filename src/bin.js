#!/usr/bin/env node

import './force-color';
import * as Argue from 'argue-cli';
import * as Localer from './lib';

const { html, compare, plain } = Argue.options([
	"html", "plain"
], [
	"compare"
]);

Localer.traverseGlob(Argue.argv).then(info => {
	
	if (compare) {
		info = Localer.diff(info, compare);
	}

	if (html) {
		console.log(Localer.htmlReport(info, plain));
	} else {
		console.log(Localer.terminalReport(info, plain));
	}

}).catch(console.error);