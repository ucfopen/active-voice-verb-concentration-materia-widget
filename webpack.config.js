const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const entries = widgetWebpack.getDefaultEntries()
const copy = widgetWebpack.getDefaultCopyList()

// using default creator
delete entries['creator.js']
delete entries['creator.css']

// not using coffeescript here
entries['player.js'] = [
	path.join(__dirname, 'src', 'player.js'),
]

// copy libs from node_modules to vendor dir
const customCopy = copy.concat([
	{
		from: path.join(__dirname, 'node_modules', 'reset-css', 'reset.css'),
		to: path.join(__dirname, 'build', 'vendor')
	},
	{
		from: path.join(__dirname, 'node_modules', 'randomcolor', 'randomColor.js'),
		to: path.join(__dirname, 'build', 'vendor')
	}
])

let options = {
	entries: entries,
	copyList: customCopy
}

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options)
