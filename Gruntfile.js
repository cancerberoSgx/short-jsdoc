var uglifyFiles = [
	'html/src/js/Application.js'
,	'html/src/js/JsDocRouter.js'
,	'html/src/js/AbstractView.js'
,	'html/src/js/TypesUtil.js'
,	'html/src/js/IndexView.js'
,	'html/src/js/ClassView.js'
,	'html/src/js/ModuleView.js'
,	'html/src/js/MethodView.js' 
,	'html/src/js/PropertyView.js'
,	'html/src/js/SourcesView.js'
,	'html/src/js/ParseView.js'
,	'html/src/js/ApplicationView.js'
,	'html/src/js/HeaderView.js'
];

var uglifyLibFiles = [

	'lib/esprima.js'
,	'lib/underscore.js'
,	'src/JsDocMaker.js'
,	'src/literalObjectParser.js'

,	'html/lib/jquery/jquery-2.0.3.min.js'
,	'html/lib/backbone/backbone.js'
,	'html/lib/bootstrap-3.2.0-dist/js/bootstrap.min.js'

,	'html/lib/twitter-typeahead/typeahead.bundle.js' 
,	'html/lib/marked/marked.js'
,	'html/lib/prettify/prettify.js'

];

var concat_node_distro_files = [
	'src/typeParser.js'
,	'src/JsDocMaker.js'
,	'src/shortjsdoc-main.js'
];

module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	

	grunt.initConfig({

	//WARNING - in linux for watch to work i have to do the following: 
	//echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
	watch : {

		jst : {
			files : 'html/src/templates/**/*.html'
		,	tasks : [ 'jst']
		}

	,	concat: {
			files : concat_node_distro_files
		,	tasks : [ 'concat']
		}

	,	less: {
			files : 'html/src/styles/**/*.less'
		,	tasks : [ 'less']
		}

	,	uglify: {
			files : 'html/src/js/**/*.js'
		// ,	tasks : [ 'reload']
		}

	}
	
,	connect : { 
		server : {
			options : {
				port : 8080
			,	base : '.'
			// ,	livereload: true
			}
		}
	}


  		// "grunt-reload": "*",
// ,	reload: {
// 		port: 35729
		// proxy: {
		// 	host: 'localhost'
		// ,	port: '8080'
		// ,	includeReloadScript: true
		// }
	// }

,	jst : {
		compile : {
			options : {
				processName : function(filename) {
					return filename.substring(filename
							.lastIndexOf('/templates/') + '/templates/'.length, filename
							.lastIndexOf('.html'));
				},
				namespace : 'shortjsdoc'
			},
			files : {
				'html/template-output.js': 'html/src/templates/**/*.html'
			}
		}
	}

	// we concat to generate the nodejs application
,	concat: {
		options: {
			separator: ';',
		},
		dist: {
			src: concat_node_distro_files,
			dest: 'src/shortjsdoc.js',
		},
	}

,	less: {
		development: {
			files: {
				'html/src/styles/styles.css': 'html/src/styles/main.less'
			}
		}
	}

,	browserify: {
		client: {
			src: ['src/jsdocmaker/main.js'],
			dest: 'src/JsDocMaker_browser.js'
		}
    }

,	uglify: {
		project: {
			options: {
				sourceMap: true
				// sourceMapName: 'html/all.min.map'
			},
			files: {
				'html/all.min.js': uglifyFiles
			,	'html/libs.min.js': uglifyLibFiles
			,	'html/data.min.json': 'html/data.min.json'
			}
		}
	}


,	jshint: {
		all: ['Gruntfile.js', 'src/JsDocMaker.js', 'html/src/js/**/*.js']
	,	options: {
			forin:true
		,	noarg:true
		,	noempty:true
		,	eqeqeq:true
		,	bitwise:false
		,	undef:false
		,	unused:false
		,	curly:true
		,	browser:true
		,	quotmark:'single'
		,	maxerr:50
		,	laxcomma:true
		,	expr:true
		,	newcap: false
	}
	}

	});

	grunt.registerTask('run', [ 'jst', 'browserify', 'concat', 'uglify', 'connect', 'watch' ]);

	grunt.registerTask('compile', [ 'jst', 'browserify', 'concat', 'uglify' ]);

};