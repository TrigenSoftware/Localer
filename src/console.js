import * as Argue from 'argue-cli';
import Locales    from './lib';
import rc         from 'rc';

let sources, { exclude, compare, summary, html } = Argue.options([
	"summary", "html"
], [
	["exclude"],
	["compare"]
]);

const rcConfigs = rc('localer', {
	sources: [],
	exclude: [],
	compare: [],
	summary: false,
	html:    false
});

sources = Argue.argv.length ? Argue.argv : rcConfigs.sources;
exclude = Array.isArray(exclude) && exclude.length ? exclude : rcConfigs.exclude;
compare = Array.isArray(compare) && compare.length ? compare : rcConfigs.compare;
summary = summary || rcConfigs.summary;
html    = html    || rcConfigs.html;

main();
async function main() {

	try {

		let locales = new Locales();

		await locales.fromFiles(sources);

		if (compare) {
			locales = await locales.diffFiles(compare);
		}

		if (exclude) {
			await locales.excludeFiles(exclude);
		}

		if (html) {
			console.log(locales.htmlReport(summary));
		} else {
			console.log(locales.terminalReport(summary));
		}

		process.exit(Number(Boolean(compare && locales.locales.length)));

	} catch(err) {
		console.error(err);
		process.exit(1);
	}
}
