global.client = (global.client) || require('webdriverio').remote({
  desiredCapabilities : {
    browserName       : 'phantomjs',
    javascriptEnabled : true
  },
  logLevel            : 'silent'
});