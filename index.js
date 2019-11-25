var fs = require('fs'),
    path = require('path'),
    objectPath = require('object-path')
JSON5 = require('json5')

function main(args) {
    for (var arg of args) {
        var match = arg.match(/--(.*)=(.*)/);
        var cwd = process.cwd();
        if (match) {
            var pKey = match[1];
            var pVal = match[2];
            if (pKey == "vueFile") {
                vueComponentFilePath = path.join(cwd, pVal);
            } else if (pKey == "locale") {
                translationDirPath = path.join(i18nDir, pVal)
                translationFileName = 'index.js';
                translationFilePath = path.join(translationDirPath, translationFileName);
            } else if (pKey = "i18nDir") {
                i18nDir = path.join(cwd, pVal);
            }
        }
    }

    updateTranslations();
}

function updateTranslations() {

    _readTranslationFile().then(function (result) {
        console.log("Read: ", result);
        _updateTranslations(result).then(function (result) {
            console.log("Update: ", result);
            _writeUpdates(result).then(function (result) {
                console.log("Write: ", result);
            });
        });
    })
}

function _readTranslationFile() {
    var translationObjectPromise = new Promise(function (resolve, reject) {
        console.log("file", translationFilePath);
        var data = fs.readFile(translationFilePath, { encoding: 'utf-8' }, function (err, translationData) {
            var obj = {};
            if (err) {
                if (err.code == "ENOENT") { //file not found
                    resolve(obj);
                }
            }
            if (translationData) {
                var obj = _extractJSON(translationData);
                if (!obj) {
                    obj = {};
                }
                resolve(obj);
            }
        });
    });
    return translationObjectPromise;
}


function _extractJSON(str) {
    var json = str.match(/\{.*\}/gs);

    return JSON5.parse(json);
}

function _updateTranslations(translations) {
    var updatedTranslationsPromise = new Promise(function (resolve, reject) {
        fs.readFile(vueComponentFilePath, { encoding: 'utf-8' }, function (err, vueComponentdata) {
            if (!err) {
                var matches = vueComponentdata.match(/\$t\(\'.*?\'\)/g);
                for (var match of matches) {
                    var path = match.replace("$t(\'", "").replace("')", "");
                    var keys = path.split('.');
                    objectPath.set(translations, path, keys[keys.length - 1])
                }
                resolve(translations);
            } else {
                reject(err);
            }
        });
    });
    return updatedTranslationsPromise;
};

function _writeUpdates(translations) {
    var writeUpdatesPromise = new Promise(function (resolve, reject) {
        var outputStr = "export default " + JSON5.stringify(translations, null, 1);
        console.log("dir: ", translationDirPath)
        fs.mkdir(translationDirPath, { recursive: true }, (err) => {

            fs.writeFile(translationFilePath, outputStr, function (err) {
                if (!err) {
                    resolve('Translationfile updated');
                } else {
                    reject(err);
                }
            })
        });
    })
    return writeUpdatesPromise;
}

exports.createTranslationFile = function (args) {
    main(args);
}
