'use strict';

var main = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var locales;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						locales = new _lib2.default();
						_context.next = 4;
						return locales.fromFiles(sources);

					case 4:
						if (!compare) {
							_context.next = 8;
							break;
						}

						_context.next = 7;
						return locales.diffFiles(compare);

					case 7:
						locales = _context.sent;

					case 8:
						if (!exclude) {
							_context.next = 11;
							break;
						}

						_context.next = 11;
						return locales.excludeFiles(exclude);

					case 11:

						if (html) {
							console.log(locales.htmlReport(summary));
						} else {
							console.log(locales.terminalReport(summary));
						}

						process.exit(Number(Boolean(compare && locales.locales.length)));

						_context.next = 19;
						break;

					case 15:
						_context.prev = 15;
						_context.t0 = _context['catch'](0);

						console.error(_context.t0);
						process.exit(1);

					case 19:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 15]]);
	}));

	return function main() {
		return _ref.apply(this, arguments);
	};
}();

var _argueCli = require('argue-cli');

var Argue = _interopRequireWildcard(_argueCli);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _rc = require('rc');

var _rc2 = _interopRequireDefault(_rc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var sources = void 0;
var _Argue$options = Argue.options(["summary", "html"], [["exclude"], ["compare"]]);

var exclude = _Argue$options.exclude;
var compare = _Argue$options.compare;
var summary = _Argue$options.summary;
var html = _Argue$options.html;


var rcConfigs = (0, _rc2.default)('localer', {
	sources: [],
	exclude: [],
	compare: [],
	summary: false,
	html: false
});

sources = Argue.argv.length ? Argue.argv : rcConfigs.sources;
exclude = Array.isArray(exclude) && exclude.length ? exclude : rcConfigs.exclude;
compare = Array.isArray(compare) && compare.length ? compare : rcConfigs.compare;
summary = summary || rcConfigs.summary;
html = html || rcConfigs.html;

main();