module.exports = function (wallaby) {
  'use strict';

  return {
    files: [
      {
        pattern: 'node_modules/babel-polyfill/dist/polyfill.js',
        instrument: false
      },
      'app/**/*.js'
    ],

    tests: [
      'test/**/*Spec.js'
    ],

    compilers: {
      'app/**/*.js': wallaby.compilers.babel({
        babelrc: true
      })
    }
  };
};
