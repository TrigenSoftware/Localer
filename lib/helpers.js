'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.asyncForEach = asyncForEach;
exports.pushUnique = pushUnique;
exports.readFile = readFile;
exports.glob = glob;

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncForEach(array, callback, resolvedObject) {

    var balancer = 0,
        i = 0,
        _this = array;

    return new Promise(function (resolve, reject) {

        if (!_this.length) {
            return resolve(resolvedObject);
        }

        callback(_this[i], i++).then(function next() {

            if (i >= _this.length) {
                return resolve(resolvedObject);
            }

            return callback(_this[i], i++).then(next).catch(reject);
        }).catch(reject);
    });
}

function pushUnique(array, element) {

    if (array.indexOf(element) != -1) {
        return element;
    }

    return array.push(element);
}

function readFile(file) {
    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(file, 'utf8', function (err, data) {

            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}

function glob(mask) {
    return new Promise(function (resolve, reject) {
        (0, _glob2.default)(mask, function (err, files) {

            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}