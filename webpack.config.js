const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const entries = widgetWebpack.getDefaultEntries()
const copy = widgetWebpack.getDefaultCopyList()

// using default creator
delete entries['creator']

// remove the above and uncomment this to use a real creator
// suggestion: use .css instead of .scss unless you really need something from scss
// entries['creator'] = [
// 	path.join(__dirname, 'src', 'creator.html'),
// 	path.join(__dirname, 'src', 'creator.js'),
// 	path.join(__dirname, 'src', 'creator.scss'),
// ]

entries['player'] = [
	path.join(__dirname, 'src', 'player.html'),
	path.join(__dirname, 'src', 'player.js'),
	path.join(__dirname, 'src', 'player.scss'),
]

// copy libs from node_modules to vendor dir
// confirm if these are necessary, remove if they are not
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
