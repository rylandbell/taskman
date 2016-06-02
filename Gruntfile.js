module.exports = function(grunt){
	//load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
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
					document: false
				},
				latedef: "nofunc",
				nocomma: true,
				nonbsp: true,
				singleGroups: true,
				undef: true,
				unused: 'vars'
			},
			frontend: ['public/javascripts/*.js'],
			server: {
				options: {
					node: true
				},
				files: {
					src: ['app_server/**/*.js']
				}
			},
			api: {
				options: {
					node: true
				},
				files: {
					src: ['app_api/**/*.js']
				}
			}
		},
		puglint: {
			views: {
			  options: {
			    // The name of the preset: `clock` (default) or `jadelint` 
			    // preset: 'clock',
			    // If preset is an object, the standard preset is not loaded 
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
			    },
			    // The path to the configuration file 
			    // puglintrc: 'test/fixtures/.pug-lintrc',
			    // Override preset settings (default: `clock`) 
			  },
			    src: ['app_server/views/**/*.jade']
			}
		}
	});

	//register tasks:
	grunt.registerTask('default',['jshint','puglint']);
};