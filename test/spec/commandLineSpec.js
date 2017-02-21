var shell = require('shelljs')

shell.config.silent=true;

describe('apis', function()
{
	it('command line 1', function()
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


	it('node js api', function()
	{
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')

		shell.mkdir('test_tmp')
		shell.ShellString('/*@module foo @class c*/').to('test_tmp/index.js')

		var ShortJsdoc = require('../..')
		var config = {
			input: ['test_tmp'],
			output: 'test_tmp_output',
			projectMetadata: {},
			vendor: [],
			dontMinifyOutput: true
		}

		ShortJsdoc.make(config)
		
		var  a = shell.cat('test_tmp_output/data.json').toString()
		a = a.substring('window.__shortjsdoc_data = '.length, a.length)
		a = JSON.parse(a)
		expect(a.classes['foo.c'].name).toBe('c')
		
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')
	})

	it('node js api non existent folder', function()
	{
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')

		// shell.mkdir('test_tmp')
		// shell.ShellString('/*@module foo @class c*/').to('test_tmp/index.js')

		var ShortJsdoc = require('../..')
		var config = {
			input: ['nonexxistent'],
			output: 'test_tmp_output',
			projectMetadata: {},
			vendor: [],
			dontMinifyOutput: true
		}

		var error = false

		try 
		{
			ShortJsdoc.make(config)
		}
		catch(ex)
		{
			error = true
		}
		
		expect(error).toBe(true)
		
		shell.rm('-rf', 'test_tmp')
		shell.rm('-rf', 'test_tmp_output')
	})
})