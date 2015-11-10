var ShortJsDoc = require('short-jsdoc');
var gulp = require('gulp')
var jsdocTool = new ShortJsDoc(); 
var through = require('through')

function throughShortJsDoc(config)
{
	var onFile = function(file)
	{
		// console.log(file.path, file.contents.toString())
		jsdocTool.maker.addFile(file.contents.toString(), file.path);
		this.emit('data', file);
	};

	var onEnd = function()
	{
		this.emit('end');
	};

	return through(onFile, onEnd);
}







gulp.task('jsdoc', [], function()
{
	gulp.src(['./src/**/*.js'])
		.pipe(throughShortJsDoc({}))
		.pipe(gulp.dest('jsdocfromgulp'));
});
