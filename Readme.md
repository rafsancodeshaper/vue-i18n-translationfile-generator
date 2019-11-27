# Vue Translation file generator

This tool parses .Vue files for $t('...') statements and adds them to a js file.

## for one file

generator --vueFile=src/pages/Calculator.vue --i18nDir=src/i18n --locale=en-us

or

## for all files

generator --i18nDir=src/i18n --locale=en-us
