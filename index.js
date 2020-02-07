var fs = require('fs'),
    readDirRecursive = require('fs-readdir-recursive'),
    path = require('path'),
    objectPath = require('object-path'),
    JSON5 = require('json5'),
    readAll = true,
    vueComponentFilePath = "";

function main(args) {
    var cwd = process.cwd();
    vueComponentFilePath = path.join(cwd, "src");

    for (var arg of args) {
        var match = arg.match(/--(.*)=(.*)/);
        if (match) {
            var pKey = match[1];
            var pVal = match[2];

            if (pKey == "vueFile") {
                vueComponentFilePath = path.join(cwd, pVal);
                readAll = false;
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

    _readTranslationFile()
        .then(function (translations) {
            console.log("Input read: ", translations);
            var updateTranslationsPromise = {};
            if (readAll) {
                updateTranslationsPromise = _updateTranslationsForAll(translations);
            } else {
                updateTranslationsPromise = _updateTranslations(translations);
            }
            return updateTranslationsPromise;
        })
        .then(function (result) {
            _writeUpdates(result);
        });

}

function _readTranslationFile() {
    var translationObjectPromise = new Promise(function (resolve, reject) {
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

function _updateTranslationsForAll(translations) {
    var updateForAllPromise = new Promise(function (resolve, reject) {
        console.log("vueComponentFilePath: ", vueComponentFilePath);
        var files = readDirRecursive(vueComponentFilePath);
        for (var file of files) {
            if (file.match(/.*.vue/)) {
                var filePath = path.join(vueComponentFilePath, file);
                _updateTranslations(filePath, translations)
            }
        }
        resolve(translations);
    });
    return updateForAllPromise;
}

function _updateTranslations(vueComponentFilePath, translations) {
    var content = fs.readFileSync(vueComponentFilePath, { encoding: 'utf-8' });

    var matches = content.match(/\$t\(\'.*?\'\)/g);
    if (matches) {
        for (var match of matches) {
            var path = match.replace("$t(\'", "").replace("')", "");
            console.log('path: ', path);
            var keys = path.split('.');
            var exists = objectPath.get(translations, path);
            if (exists === undefined) {
                objectPath.set(translations, path, keys[keys.length - 1])
            }
        }
    }
    console.debug("file: ", vueComponentFilePath, "translations: ", translations);
    return translations;
};

function _writeUpdates(translations) {
    var outputStr = "export default " + JSON5.stringify(translations, null, 1);
    console.log("translationDirPath: ", translationDirPath)
    fs.mkdir(translationDirPath, { recursive: true }, (err) => {

        fs.writeFile(translationFilePath, outputStr, function (err) {
            if (!err) {
                console.log('Translationfile updated');
            } else {
                console.log(err);
            }
        })
    });
}

exports.createTranslationFile = function (args) {
    main(args);
}
