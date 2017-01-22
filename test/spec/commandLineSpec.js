var shell = require('shelljs')

shell.config.silent=true;

describe('command line', function()
{
	it('1', function()
	{
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')

		shell.mkdir('test_tmp')
		shell.ShellString('/*@module foo @class c*/').to('test_tmp/index.js')
		
		expect(shell.exec('node bin/short-jsdoc-cli --input test_tmp --output test_tmp_output').code).toBe(0)
		shell.exec('node bin/short-jsdoc-cli --input test_tmp').output
		expect(shell.cat('test_tmp_output/data.json').indexOf('window.__shortjsdoc_data')==0).toBe(true)

		var p = shell.exec('node bin/short-jsdoc-cli --input test_tmp')
		expect(p.code).toBe(0)
		var jsdoc = JSON.parse(p.stdout)
		expect(jsdoc.classes['foo.c'].name).toBe('c')
		
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')
	})
})