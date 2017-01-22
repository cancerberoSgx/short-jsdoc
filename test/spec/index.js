var path = require('path')
,	Jasmine = require('jasmine')
,	args = require('yargs').argv

if(!args.test)
{
	console.log('Invalid call. \nUsage: node spec --test setupSpec.js')
	process.exit(1)
}
var jasmineRunner = new Jasmine()
jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999999

var specs = [path.join(__dirname, args.test)]
jasmineRunner.specFiles = specs
jasmineRunner.execute()

