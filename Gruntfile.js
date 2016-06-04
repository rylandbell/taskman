module.exports = function (grunt) {
  var nodePaths = ['app_server/**/*.js', 'app_api/**/*.js'];
  var browserPaths = ['public/javascripts/*.js'];
  var jadePaths = ['app_server/views/**/*.jade'];

  var jsPaths = nodePaths.concat(browserPaths);
  jsPaths.push('Gruntfile.js');

  //load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-puglint');

  //configure plugins
  grunt.initConfig({
    jshint: {
      options: {

        //environments:
        browser: true,
        jquery: true,

        //other options:
        bitwise: true,
        curly: true,
        eqeqeq: true,
        esversion: 5,
        forin: true,
        globals: {
          Modernizr: false,
          gapi: false,
          google: false,
        },
        latedef: 'nofunc',
        nocomma: true,
        nonbsp: true,
        singleGroups: true,
        undef: true,
        unused: 'vars'
      },
      browser: browserPaths,
      node: {
        options: {
          node: true,
          browser: false
        },
        files: {
          src: nodePaths
        }
      },
    },
    jscs: {
      options: {
        fix: false, // Autofix code style violations when possible.
      },
      autoFix: {
        files: {
          src: jsPaths,
        },
        options: {
          fix: true,
          requireSpaceBeforeBinaryOperators: true,
          requireSpaceAfterBinaryOperators: true,
          requireSpacesInAnonymousFunctionExpression: {
            beforeOpeningRoundBrace: true,
            beforeOpeningCurlyBrace: true
          },
          requireSpaceBeforeBlockStatements: true,
          requireSpaceAfterComma: true,
          requireSpaceBetweenArguments: true,
          requireSpaceAfterKeywords: true,
          requirePaddingNewLinesAfterBlocks: true,
          requireLineFeedAtFileEnd: true,
          disallowTrailingWhitespace: true,
          requireSpaceBetweenArguments: true,
          validateQuoteMarks: true,
          requirePaddingNewLinesBeforeLineComments: true,
          disallowSpacesInCallExpression: true,
          disallowQuotedKeysInObjects: true,
          requireSpacesInsideObjectBrackets: 'all',
          disallowSpaceAfterObjectKeys: true,
          disallowMultipleLineBreaks: true,
          disallowSpacesInsideParentheses: true,
          disallowSpaceBeforeComma: true,
          disallowSpaceBeforeBinaryOperators: [','],
          requireSpaceBeforeObjectValues: true
        }
      },
      showErrors: {
        files: {
          src: jsPaths,
        },
        options: {
          preset: 'airbnb',
          maximumLineLength: false,
          requireTrailingComma: false
        }
      }
    },
    puglint: {
      views: {
        options: {
          preset: {
            disallowHtmlText: true,
            validateIndentation: 2,
            disallowDuplicateAttributes: true,
            disallowMultipleLineBreaks: true,
            disallowSpacesInsideAttributeBrackets: true,
            requireLowerCaseAttributes: true,
            requireLowerCaseTags: true,
            requireStrictEqualityOperators: true,
            validateDivTags: true
          }
        },
        src: jadePaths
      }
    }
  });

  //register tasks:
  grunt.registerTask('default', ['jshint', 'jscs:autoFix', 'jscs:showErrors', 'puglint']);
  grunt.registerTask('fix', ['jscs:autoFix']);

};
