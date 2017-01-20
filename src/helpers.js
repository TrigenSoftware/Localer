import Glob from 'glob';
import Fs   from 'fs';

export function asyncForEach(array, each, resolvedObject) {

	const _this = array;

	let i = 0;

	return new Promise((resolve, reject) => {

		if (!_this.length) {
			resolve(resolvedObject);
			return;
		}

		each(_this[i], i++).then(function next() {

			if (i >= _this.length) {
				return resolve(resolvedObject);
			}

			return each(_this[i], i++).then(next).catch(reject);
		}).catch(reject);
	});
}

export function pushUnique(array, element) {

	if (array.indexOf(element) != -1) {
		return element;
	}

	return array.push(element);
}

export function readFile(file) {
	return new Promise((resolve, reject) => {
		Fs.readFile(file, 'utf8', (err, data) => {

			if (err) {
				reject(err);
				return;
			}

			resolve(data);
		});
	});
}

export function glob(mask, inputIgnore = []) {

	const ignore = inputIgnore.slice();

	if (Array.isArray(mask)) {

		const masks = [],
			files   = [];

		mask.forEach((mask) => {

			if (mask.indexOf('!') == 0) {
				pushUnique(ignore, mask.replace('!', ''));
			} else {
				masks.push(mask);
			}
		});

		return Promise.all(
			masks.map(_ =>
				glob(_, ignore).then(_ =>
					_.forEach(_ => pushUnique(files, _))
				)
			)
		).then(() => files);
	}

	return new Promise((resolve, reject) => {
		Glob(mask, { ignore }, (err, files) => {

			if (err) {
				reject(err);
				return;
			}

			resolve(files);
		});
	});
}
