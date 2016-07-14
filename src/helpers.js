import Glob    from 'glob';
import * as Fs from 'fs';

export function asyncForEach(array, callback, resolvedObject) {

    var balancer = 0, i = 0, _this = array;

    return new Promise((resolve, reject) => {

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
                return reject(err);
            }

            resolve(data);
        });
    });
}

export function glob(mask) {
    return new Promise((resolve, reject) => {
        Glob(mask, (err, files) => {
    
            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}