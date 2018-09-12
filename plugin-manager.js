const config = require('config')
const path = require('path')
const fs = require('fs')

const PermissionDenied = "Permission denied: "

module.exports = {
	_plugins: null,

	init() {
		let pluginPath = path.join(__dirname, "plugins")
		module.exports._plugins = fs.readdirSync(pluginPath)
			.filter(path => path.endsWith(".js"))
			.map(path => path.slice(0, -3))
			.reduce((acc, pluginName) => {
				let file = "./plugins/" + pluginName
				try {
					acc[pluginName] = require(file)
				} catch (err) {
					if (err.code === 'MODULE_NOT_FOUND') {
						throw err
					}
					console.log(`Error loading plugin: ${pluginName}\n`, err)
					process.exit(1)
				}
				return acc
			}, {})
	},

	load(name) {
		if (module.exports._plugins === null) {
			throw new Error('Plugin manager not initialized')
		}
		let plugin = module.exports._plugins[name];
		if (plugin === undefined) {
			throw new Error(`Plugin not found: ${name}`)
		}
		return plugin
	},

	run(name) {
		return new Promise(resolve => resolve(module.exports._run(...arguments)))
			.catch(err => {
				if (err.message.startsWith(PermissionDenied)) {
					return {error: err.message}
				}
				console.log("Error running module", name, err)
				return {error: `Error running module '${name}'`}
			})
	},

	_run(name, value, opts) {
		if (name === undefined) {
			return {error: "Cannot load plugin with undefined name"}
		}
		const plugin = module.exports.load(name)
		if (plugin === undefined) {
			return {error: `Module not found: ${name}`}
		}
		if (plugin.run === undefined) {
			return {error: `Invalid module, run() is not defined: ${name}`}
		}

		opts = opts || {}
		let pluginOpts = {}
		pluginOpts.location = () => {
			if (config.permissions && config.permissions.location && config.permissions.location.includes(name)) {
				return opts.location || {}
			}
			throw new Error(`${PermissionDenied}Module '${name}' does not have permission to access current location`)
		}
		return plugin.run(value, pluginOpts)
	},

	tags() {
		return Object.keys(module.exports._plugins)
	},
}
