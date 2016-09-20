'use strict';

var main = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var _locales$transformers, locales;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						locales = new _lib2.default();


						(_locales$transformers = locales.transformers).push.apply(_locales$transformers, _toConsumableArray(transformers));

						_context.next = 5;
						return locales.fromFiles(sources);

					case 5:
						if (!compare) {
							_context.next = 9;
							break;
						}

						_context.next = 8;
						return locales.diffFiles(compare);

					case 8:
						locales = _context.sent;

					case 9:
						if (!exclude) {
							_context.next = 12;
							break;
						}

						_context.next = 12;
						return locales.excludeFiles(exclude);

					case 12:

						if (html) {
							console.log(locales.htmlReport(summary));
						} else {
							console.log(locales.terminalReport(summary));
						}

						process.exit(Number(Boolean(compare && locales.locales.length)));

						_context.next = 20;
						break;

					case 16:
						_context.prev = 16;
						_context.t0 = _context['catch'](0);

						console.error(_context.t0);
						process.exit(1);

					case 20:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 16]]);
	}));

	return function main() {
		return _ref.apply(this, arguments);
	};
}();

var _argueCli = require('argue-cli');

var Argue = _interopRequireWildcard(_argueCli);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _findRc = require('find-rc');

var _findRc2 = _interopRequireDefault(_findRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var sources = void 0;var transformers = void 0;

var _Argue$options = Argue.options(["summary", "html"], [["exclude"], ["compare"]]);

var exclude = _Argue$options.exclude;
var compare = _Argue$options.compare;
var summary = _Argue$options.summary;
var html = _Argue$options.html;


var rcPath = (0, _findRc2.default)('localer');
var rcConfigs = {
	sources: [],
	transformers: [],
	exclude: [],
	compare: [],
	summary: false,
	html: false
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

main();