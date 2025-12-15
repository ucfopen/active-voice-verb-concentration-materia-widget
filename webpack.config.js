const path = require('path')
const srcPath = path.join(process.cwd(), 'src')
const rootPath = process.cwd()
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const entries = widgetWebpack.getDefaultEntries()
const copy = widgetWebpack.getDefaultCopyList()

// using default creator
delete entries['creator'];

// not using coffeescript here
entries['player'] = [
	path.join(srcPath, 'player.html'),
	path.join(srcPath, 'player.js'),
	path.join(srcPath, 'player.scss')
];

// copy libs from node_modules to vendor dir
const customCopy = copy.concat([
	{
		from: path.join(rootPath, 'node_modules', 'reset-css', 'reset.css'),
		to: path.join(rootPath, 'build', 'vendor')
	},
	{
		from: path.join(rootPath, 'node_modules', 'randomcolor', 'randomColor.js'),
		to: path.join(rootPath, 'build', 'vendor')
	}
])

let options = {
	entries: entries,
	copyList: customCopy
}

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options)
