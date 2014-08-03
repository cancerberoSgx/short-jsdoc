module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var concat_files = ['src/typeParser.js', 'src/JsDocMaker.js', 'src/shortjsdoc-main.js'];

	grunt.initConfig({

	//WARNING - in linux for watch to work i have to do the following: 
	//echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

	watch : {
// browserify : {
//	files : 'src/**/*.js',
//	// files : './src/*.js',
//	tasks : [ /*'browserify', */'yuidoc' ]
// }

		jst : {
			files : 'html/src/templates/**/*.html'
		,	tasks : [ 'jst']
		}

	,	concat: {
			files : concat_files
		,	tasks : [ 'concat']
		}

	,	less: {
			files : 'html/src/styles/**/*.less'
		,	tasks : [ 'less']
		}
	}
	
,	connect : { 
		server : {
			options : {
				port : 8080
			,	base : '.'
			// ,	keepalive: true
			// ,	open: 'http://localhost:8080/index.html'
			}
		}
	}

,	jst : {
		compile : {
			options : {
				processName : function(filename) {
					return filename.substring(filename
							.lastIndexOf('/') + 1, filename
							.lastIndexOf('.html'));
				},
				namespace : 'shortjsdoc'
			},
			files : {
				'html/template-output.js': 'html/src/templates/*.html'
			}
		}
	}

	// we concat to generate the nodejs application
,	concat: {
		options: {
			separator: ';',
		},
		dist: {
			src: concat_files,
			dest: 'src/shortjsdoc.js',
		},
	}

,	less: {
		development: {
			files: {
				"html/src/styles/styles.css": "html/src/styles/main.less"
			}
		}
	}

	});

	grunt.registerTask('run', [ 'jst', 'connect', 'watch' ]);
	// grunt.registerTask('run', [ 'browserify', 'connect'  ]);
	// grunt.registerTask('apidoc', [ 'apidocs' ]);

};