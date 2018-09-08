module.exports = {
	load(name) {
		let plugin
		try {
			plugin = require('./plugins/' + name)
		} catch (err) {
			console.log(`Error loading module: ./plugins/${name}`, err)
		}
		return plugin
	},

	run() {
		return Promise.resolve(module.exports._run(...arguments))
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
		// TODO change to config-based permissions
		if (plugin.location === true) {
			pluginOpts.location = opts.location
		}
		return module.exports._runWithPluginOpts(plugin, name, value, pluginOpts)
	},

	_runWithPluginOpts(plugin, name, value, opts) {
		try {
			return plugin.run(value, opts)
		} catch (err) {
			console.log(`Error running module: ${name}`, err)
			return {error: `Error running module: ${name}`}
		}
	},
}
