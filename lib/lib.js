'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LocaleSource = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _babylon = require('babylon');

var Babylon = _interopRequireWildcard(_babylon);

var _babelTraverse = require('babel-traverse');

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelCodeFrame = require('babel-code-frame');

var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var _ansiToHtml = require('ansi-to-html');

var _ansiToHtml2 = _interopRequireDefault(_ansiToHtml);

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

require('babel-polyfill');

require('colour');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var codeFrameOptions = {
	highlightCode: true
};

var Locales = function () {

	/**
  * Locales constructor.
  * 
  * @param  {Array<LocaleSource>|Locales}  fromLocalesOrLocales
  * @param  {Array<String>}                fromUnused
  * @return {Locales}
  */


	/**
  * Locales soruces.
  * @type {Array<LocaleSources>}
  */


	/**
  * Babylon parser options.
  * @type {Object}
  */


	/**
  * Functions with few argument.
  * @type {Array<String>}
  */


	/**
  * Tagged literals.
  * @type {Array<String>}
  */
	function Locales() {
		var fromLocalesOrLocales = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
		var fromUnused = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		_classCallCheck(this, Locales);

		this.tags = ['__', '__n'];
		this.fns = ['__', '__n', '__mf', '__l', '__h'];
		this.fns2 = ['__n'];
		this.convert = new _ansiToHtml2.default({
			fg: '#000',
			bg: '#FFF'
		});
		this.babylonOptions = {
			sourceType: "module",
			plugins: ["jsx",
			// "flow",
			"asyncFunctions", "classConstructorCall", "doExpressions", "trailingFunctionCommas", "objectRestSpread", "decorators", "classProperties", "exportExtensions", "exponentiationOperator", "asyncGenerators", "functionBind", "functionSent"]
		};
		this.transformers = [];
		this.locales = [];
		this.unused = [];


		if (fromLocalesOrLocales instanceof Locales) {
			this.from(fromLocalesOrLocales);
			return;
		}

		if (!Array.isArray(fromLocalesOrLocales) || !Array.isArray(fromUnused)) {
			throw new Error('Invalid arguments.');
		}

		var fromLocales = fromLocalesOrLocales;
		var locales = this.locales;
		var unused = this.unused;


		fromLocales.forEach(function (localeSource) {

			if (!(localeSource instanceof LocaleSource)) {
				throw new Error('Invalid locale source.');
			}

			locales.push(localeSource.copy());
		});

		fromUnused.forEach(function (localeString) {

			if (typeof localeString != 'string') {
				throw new Error('Invalid locale string.');
			}

			unused.push(localeString);
		});
	}

	/**
  * Import data from other instance.
  * 
  * @param {Locales} locales
  */


	/**
  * Unused locales.
  * @type {Array<String>}
  */


	/**
  * Code transformers.
  * @type {Array<Function>}
  */


	/**
  * ANSI to HTML instance.
  * @type {Convert}
  */


	/**
  * Functions with one argument.
  * @type {Array<String>}
  */


	_createClass(Locales, [{
		key: 'from',
		value: function from(locales) {
			var _this = this;

			if (!(locales instanceof Locales)) {
				throw new Error('Invalid locales.');
			}

			this.convert = locales.convert;

			this.tags = locales.tags.slice();
			this.fns = locales.fns.slice();
			this.fns2 = locales.fns2.slice();
			this.transformers = locales.transformers.slice();

			this.babylonOptions = _extends({}, locales.babylonOptions, {
				plugins: locales.babylonOptions.plugins.slice()
			});

			this.locales = [];
			locales.locales.forEach(function (localeSource) {

				if (!(localeSource instanceof LocaleSource)) {
					throw new Error('Invalid locale source.');
				}

				_this.locales.push(localeSource.copy());
			});

			this.unused = [];
			locales.unused.forEach(function (localeString) {

				if (typeof localeString != 'string') {
					throw new Error('Invalid locale string.');
				}

				_this.unused.push(localeString);
			});
		}

		/**
   * Create copy of this.
   * 
   * @return {Locales}
   */

	}, {
		key: 'copy',
		value: function copy() {
			return new Locales(this);
		}

		/**
   * Collect locales from source code.
   * 
   * @param  {String} code
   * @param  {String} file
   * @return {this}
   */

	}, {
		key: 'fromCode',
		value: function fromCode(sourceCode, file) {

			if (typeof sourceCode != 'string') {
				throw new Error('Invalid arguments.');
			}

			var extname = '.js';

			if (typeof file == 'string') {
				extname = _path2.default.extname(file);
			}

			var tags = this.tags;
			var fns = this.fns;
			var fns2 = this.fns2;
			var transformers = this.transformers;
			var babylonOptions = this.babylonOptions;
			var locales = this.locales;


			var code = transformers.reduce(function (code, transform) {
				return transform(code, extname);
			}, sourceCode);

			(0, _babelTraverse2.default)(Babylon.parse(code, babylonOptions), {
				TaggedTemplateExpression: function TaggedTemplateExpression(path) {
					var node = path.node;


					if (!~tags.indexOf(node.tag.name)) {
						return;
					}

					locales.push(new LocaleSource(file, code, node, node.tag.name, node.quasi.quasis.map(function (node) {
						return node.value.raw;
					}).join('%s')));
				},
				CallExpression: function CallExpression(path) {
					var node = path.node;
					var callee = node.callee;
					var name = void 0;

					if (callee.type == "Identifier") {
						name = callee.name;
					} else if (callee.type == "MemberExpression" && callee.property.type == "Identifier") {
						name = callee.property.name;
					} else {
						return;
					}

					if (!~fns.indexOf(name)) {
						return;
					}

					var _node$arguments = _slicedToArray(node.arguments, 2);

					var first = _node$arguments[0];
					var second = _node$arguments[1];


					if (typeof first != "undefined") {

						if (first.type == "StringLiteral") {

							locales.push(new LocaleSource(file, code, node, name, first.value));
						} else if (first.type == "TemplateLiteral") {

							locales.push(new LocaleSource(file, code, node, name
							// first.quasis.map(node => node.value.raw).join('%s')
							));
						} else {

							locales.push(new LocaleSource(file, code, node, name));
						}
					}

					if (typeof second != "undefined" && ~fns2.indexOf(name)) {

						if (second.type == "StringLiteral") {

							locales.push(new LocaleSource(file, code, node, name, second.value));
						} else if (second.type == "TemplateLiteral") {

							locales.push(new LocaleSource(file, code, node, name
							// second.quasis.map(node => node.value.raw).join('%s')
							));
						} else {

							locales.push(new LocaleSource(file, code, node, name));
						}
					}
				}
			});

			return this;
		}

		/**
   * Collect locales from JavaScript source files by glob pattern.
   * 
   * @param  {String|Array<String>} maskOrMasks
   * @return {Promise<this>}
   */

	}, {
		key: 'fromFiles',
		value: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(maskOrMasks) {
				var _this2 = this;

				var masks;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								masks = void 0;

								if (!(typeof maskOrMasks == 'string')) {
									_context3.next = 5;
									break;
								}

								masks = [maskOrMasks];
								_context3.next = 10;
								break;

							case 5:
								if (!Array.isArray(maskOrMasks)) {
									_context3.next = 9;
									break;
								}

								masks = maskOrMasks;
								_context3.next = 10;
								break;

							case 9:
								throw new Error('Invalid arguments.');

							case 10:
								_context3.next = 12;
								return (0, _helpers.asyncForEach)(masks, function () {
									var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(mask) {
										var files;
										return regeneratorRuntime.wrap(function _callee2$(_context2) {
											while (1) {
												switch (_context2.prev = _context2.next) {
													case 0:
														_context2.next = 2;
														return (0, _helpers.glob)(mask);

													case 2:
														files = _context2.sent;
														_context2.next = 5;
														return (0, _helpers.asyncForEach)(files, function () {
															var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file) {
																return regeneratorRuntime.wrap(function _callee$(_context) {
																	while (1) {
																		switch (_context.prev = _context.next) {
																			case 0:
																				_context.t0 = _this2;
																				_context.next = 3;
																				return (0, _helpers.readFile)(file);

																			case 3:
																				_context.t1 = _context.sent;
																				_context.t2 = file;
																				return _context.abrupt('return', _context.t0.fromCode.call(_context.t0, _context.t1, _context.t2));

																			case 6:
																			case 'end':
																				return _context.stop();
																		}
																	}
																}, _callee, _this2);
															}));

															return function (_x5) {
																return _ref3.apply(this, arguments);
															};
														}());

													case 5:
													case 'end':
														return _context2.stop();
												}
											}
										}, _callee2, _this2);
									}));

									return function (_x4) {
										return _ref2.apply(this, arguments);
									};
								}());

							case 12:
								return _context3.abrupt('return', this);

							case 13:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function fromFiles(_x3) {
				return _ref.apply(this, arguments);
			}

			return fromFiles;
		}()

		/**
   * Exclude given locales from `locales` and `unused`.
   * 
   * @param  {Array<String|LocaleSource>|Object<String,any>} arrayOrObjectToExlcude
   * @return {this}
   */

	}, {
		key: 'exclude',
		value: function exclude(arrayOrObjectToExlcude) {

			var exclude = [];

			if (Array.isArray(arrayOrObjectToExlcude)) {
				exclude = arrayOrObjectToExlcude.map(function (locale) {

					if (locale instanceof LocaleSource) {
						return locale.string;
					} else if (typeof locale == 'string') {
						return locale;
					} else {
						throw new Error('Invalid locale to exclude.');
					}
				});
			} else if ((typeof arrayOrObjectToExlcude === 'undefined' ? 'undefined' : _typeof(arrayOrObjectToExlcude)) == 'object' && arrayOrObjectToExlcude != null) {
				exclude = Object.keys(arrayOrObjectToExlcude);
			} else {
				throw new Error('Invalid arguments.');
			}

			this.locales = this.locales.filter(function (_ref4) {
				var string = _ref4.string;
				return !~exclude.indexOf(string);
			});

			this.unused = this.unused.filter(function (string) {
				return !~exclude.indexOf(string);
			});

			return this;
		}

		/**
   * Exclude locales getted from JSON files from `locales` and `unused`.
   * 
   * @param  {String|Array<String>} maskOrMasks
   * @return {Promise<this>}
   */

	}, {
		key: 'excludeFiles',
		value: function () {
			var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(maskOrMasks) {
				var _this3 = this;

				var cwd, masks;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								cwd = process.cwd(), masks = void 0;

								if (!(typeof maskOrMasks == 'string')) {
									_context5.next = 5;
									break;
								}

								masks = [maskOrMasks];
								_context5.next = 10;
								break;

							case 5:
								if (!Array.isArray(maskOrMasks)) {
									_context5.next = 9;
									break;
								}

								masks = maskOrMasks;
								_context5.next = 10;
								break;

							case 9:
								throw new Error('Invalid arguments.');

							case 10:
								_context5.next = 12;
								return (0, _helpers.asyncForEach)(masks, function () {
									var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(mask) {
										var files;
										return regeneratorRuntime.wrap(function _callee4$(_context4) {
											while (1) {
												switch (_context4.prev = _context4.next) {
													case 0:
														_context4.next = 2;
														return (0, _helpers.glob)(mask);

													case 2:
														files = _context4.sent;


														files.forEach(function (file) {
															return _this3.exclude(require(_path2.default.resolve(cwd, file)));
														});

													case 4:
													case 'end':
														return _context4.stop();
												}
											}
										}, _callee4, _this3);
									}));

									return function (_x7) {
										return _ref6.apply(this, arguments);
									};
								}());

							case 12:
								return _context5.abrupt('return', this);

							case 13:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function excludeFiles(_x6) {
				return _ref5.apply(this, arguments);
			}

			return excludeFiles;
		}()

		/**
   * Get difference between locales parsed from JavaScript sources and locales.
   * 
   * @param  {Array<String|LocaleSource>|Object<String,any>} arrayOrObjectBase
   * @return {Locales}
   */

	}, {
		key: 'diff',
		value: function diff(arrayOrObjectBase) {

			var base = [];

			if (Array.isArray(arrayOrObjectBase)) {
				base = arrayOrObjectBase.map(function (locale) {

					if (locale instanceof LocaleSource) {
						return locale.string;
					} else if (typeof locale == 'string') {
						return locale;
					} else {
						throw new Error('Invalid locale to exclude.');
					}
				});
			} else if ((typeof arrayOrObjectBase === 'undefined' ? 'undefined' : _typeof(arrayOrObjectBase)) == 'object' && arrayOrObjectBase != null) {
				base = Object.keys(arrayOrObjectBase);
			} else {
				throw new Error('Invalid arguments.');
			}

			var compareResult = new Locales(this),
			    usedStrings = [];

			compareResult.locales = compareResult.locales.filter(function (_ref7) {
				var string = _ref7.string;


				if (typeof string == "undefined") {
					return true;
				}

				usedStrings.push(string);

				return !~base.indexOf(string);
			});

			compareResult.unused = base.filter(function (string) {
				return !~usedStrings.indexOf(string);
			});

			return compareResult;
		}

		/**
   * Get difference between locales parsed from JavaScript sources and locales from JSON files.
   * 
   * @param  {String|Array<String>} maskOrMasks
   * @return {Promise<Locales>}
   */

	}, {
		key: 'diffFiles',
		value: function () {
			var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(maskOrMasks) {
				var _this4 = this;

				var cwd, masks, base;
				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								cwd = process.cwd(), masks = void 0;

								if (!(typeof maskOrMasks == 'string')) {
									_context7.next = 5;
									break;
								}

								masks = [maskOrMasks];
								_context7.next = 10;
								break;

							case 5:
								if (!Array.isArray(maskOrMasks)) {
									_context7.next = 9;
									break;
								}

								masks = maskOrMasks;
								_context7.next = 10;
								break;

							case 9:
								throw new Error('Invalid arguments.');

							case 10:
								base = [];
								_context7.next = 13;
								return (0, _helpers.asyncForEach)(masks, function () {
									var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(mask) {
										var files;
										return regeneratorRuntime.wrap(function _callee6$(_context6) {
											while (1) {
												switch (_context6.prev = _context6.next) {
													case 0:
														_context6.next = 2;
														return (0, _helpers.glob)(mask);

													case 2:
														files = _context6.sent;


														files.forEach(function (file) {

															var json = require(_path2.default.resolve(cwd, file));

															if (Array.isArray(json)) {
																base.push.apply(base, _toConsumableArray(json));
															} else {
																base.push.apply(base, _toConsumableArray(Object.keys(json)));
															}
														});

													case 4:
													case 'end':
														return _context6.stop();
												}
											}
										}, _callee6, _this4);
									}));

									return function (_x9) {
										return _ref9.apply(this, arguments);
									};
								}());

							case 13:
								return _context7.abrupt('return', this.diff(base));

							case 14:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function diffFiles(_x8) {
				return _ref8.apply(this, arguments);
			}

			return diffFiles;
		}()

		/**
   * Generate report for terminal.
   * 
   * @param  {Boolean} withSummary
   * @return {String} 
   */

	}, {
		key: 'terminalReport',
		value: function terminalReport() {
			var withSummary = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			var locales = this.locales;
			var unused = this.unused;
			var added = [];
			var report = "";
			var currentFile = "";

			locales.forEach(function (_ref10) {
				var file = _ref10.file;
				var string = _ref10.string;
				var fn = _ref10.fn;
				var codeFrame = _ref10.codeFrame;


				if (currentFile != file) {
					currentFile = file;
					report += '\n' + 'File:'.yellow + ' ' + file.underline.cyan + '\n\n';
				}

				if (typeof string == "string") {

					report += 'String:'.yellow + ' ' + string.green + '\n\n';

					if (withSummary) {
						(0, _helpers.pushUnique)(added, string);
					}
				} else {
					report += 'Function:'.yellow + ' ' + fn.green + '\n\n';
				}

				report += codeFrame + '\n\n';
			});

			if (withSummary && (added.length || unused.length)) {

				var summary = "\nSummary:\n\n";

				if (added.length) {
					summary += 'Added:\n\n' + added.join("\n") + '\n\n';
				}

				if (unused.length) {
					summary += 'Unused (maybe):\n\n' + unused.join("\n") + '\n\n';
				}

				report = summary + report;
			}

			return report;
		}

		/**
   * Generate report as html.
   * 
   * @param  {Boolean} withSummary
   * @return {String} 
   */

	}, {
		key: 'htmlReport',
		value: function htmlReport() {
			var withSummary = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			var locales = this.locales;
			var unused = this.unused;
			var added = [];
			var report = "";
			var currentFile = "";

			locales.forEach(function (_ref11) {
				var file = _ref11.file;
				var string = _ref11.string;
				var fn = _ref11.fn;
				var codeFrame = _ref11.codeFrame;


				if (currentFile != file) {
					currentFile = file;
					report += '<br><h1>File:&nbsp;<span>' + file + '</span></h1>';
				}

				if (typeof string == "string") {

					report += '<h3>String:&nbsp;<span>' + string + '</span></h2>';

					if (withSummary) {
						(0, _helpers.pushUnique)(added, string);
					}
				} else {
					report += '<h3>Function:&nbsp;<span>' + fn + '</span></h2>';
				}

				report += '<pre>' + (0, _escapeHtml2.default)(codeFrame.replace(/\t/g, "    ")) + '</pre>';
				report += '<small>' + file + '</small><br>';
			});

			if (withSummary && (added.length || unused.length)) {

				var summary = "<h1>Summary:</h1>";

				if (added.length) {
					summary += '<h3>Added:</h3><pre>' + (0, _escapeHtml2.default)(added.join("\n")) + '</pre><br>';
				}

				if (unused.length) {
					summary += '<h3>Unused<sup>(maybe)</sup>:</h3><pre>' + (0, _escapeHtml2.default)(unused.join("\n")) + '</pre><br>';
				}

				report = summary + report;
			}

			report = '\n\t\t<!DOCTYPE html>\n\t\t<html>\n\t\t    <head>\n\t\t        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n\t\t        <title>REPORT</title>\n\t\t        <style>\n\n\t\t\t\t\tbody {\n\t\t\t\t\t\tfont-family: Arial, Calibri;\n\t\t\t\t\t\toverflow-x: hidden;\n\t\t\t\t\t}\n\n\t\t\t\t\th1 {\n\t\t\t\t\t\tfont-size: 1.5em;\n\t\t\t\t\t}\n\n\t\t\t\t\th1 span {\n\t\t\t\t\t\tfont-family: monospace;\n\t\t\t\t\t\tfont-size: 1.4em;\n\t\t\t\t\t\tfont-weight: normal;\n\t\t\t\t\t\tmargin-left: .25em;\n\t\t\t\t\t\ttext-decoration: underline;\n\t\t\t\t\t}\n\n\t\t\t\t\th3 span {\n\t\t\t\t\t\tfont-family: monospace;\n\t\t\t\t\t\tfont-size: 1.45em;\n\t\t\t\t\t\tfont-weight: normal;\n\t\t\t\t\t\tmargin-left: .25em;\n\t\t\t\t\t}\n\n\t\t\t\t\th3 sup {\n\t\t\t\t\t\tfont-size: .7em;\n\t\t\t\t\t}\n\n\t\t\t\t\tpre {\n\t\t\t\t\t\tcolor: #000;\n\t\t\t\t\t\tpadding: 1em .5em;\n\t\t\t\t\t\tborder: 1px solid #000;\n\t\t\t\t\t}\n\n\t\t\t\t\tpre b {\n\t\t\t\t\t\tfont-weight: normal;\n\t\t\t\t\t}\n\n\t\t\t\t\tsmall {\n\t\t\t\t\t\tfont-family: monospace;\n\t\t\t\t\t}\n\n\t\t\t\t</style>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t' + this.convert.toHtml(report) + '\n\t\t\t</body>\n\t\t</html>';

			return report;
		}
	}]);

	return Locales;
}();

exports.default = Locales;

var LocaleSource = exports.LocaleSource = function () {

	/**
  * LocaleSource constructor.
  * 
  * @param  {String|LocaleSource} fileOrLocaleSource
  * @param  {String}              code
  * @param  {Node}                node
  * @param  {String}              fn
  * @param  {String}              string
  * @return {LocaleSource}
  */


	/**
  * Locale string.
  * @type {String}
  */


	/**
  * Column of token.
  * @type {Number}
  */


	/**
  * Type of node.
  * @type {String}
  */
	function LocaleSource(fileOrLocaleSource, code, node, fn, string) {
		_classCallCheck(this, LocaleSource);

		this.file = null;
		this.type = null;
		this.line = null;
		this.column = null;
		this.fn = null;
		this.string = null;
		this.codeFrame = null;


		if (fileOrLocaleSource instanceof LocaleSource) {
			this.from(fileOrLocaleSource);
			return;
		}

		var file = fileOrLocaleSource;

		if (typeof file != 'string' && typeof file != 'undefined') {
			throw new Error('File path must be a string');
		}

		if (typeof code != 'string') {
			throw new Error('Code must be setted');
		}

		if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) != 'object' || typeof node.type != 'string') {
			throw new Error('Node be setted');
		}

		if (typeof fn != 'string') {
			throw new Error('Function name must be setted');
		}

		if (typeof string != 'string' && typeof string != 'undefined') {
			throw new Error('Locale string must be setted');
		}

		this.file = file;
		this.type = node.type;
		this.line = node.loc.start.line;
		this.column = node.loc.start.column + 1;
		this.fn = fn;
		this.string = string;

		this.codeFrame = (0, _babelCodeFrame2.default)(code, this.line, this.column, codeFrameOptions);
	}

	/**
  * Import data from other instance.
  * 
  * @param {LocaleSource} localeSource
  */


	/**
  * Code frame.
  * @type {String}
  */


	/**
  * Function name.
  * @type {String}
  */


	/**
  * Line of token.
  * @type {Number}
  */


	/**
  * Path to file.
  * @type {String}
  */


	_createClass(LocaleSource, [{
		key: 'from',
		value: function from(localeSource) {

			if (!(localeSource instanceof LocaleSource)) {
				throw new Error('Invalid locale source.');
			}

			this.file = localeSource.file;
			this.type = localeSource.type;
			this.line = localeSource.line;
			this.column = localeSource.column;
			this.fn = localeSource.fn;
			this.string = localeSource.string;
			this.codeFrame = localeSource.codeFrame;
		}

		/**
   * Create copy of this.
   * 
   * @return {LocaleSource}
   */

	}, {
		key: 'copy',
		value: function copy() {
			return new LocaleSource(this);
		}
	}]);

	return LocaleSource;
}();