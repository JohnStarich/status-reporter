const config = require('config')

const PermissionDenied = "Permission denied: "

module.exports = {
	load(name) {
		let plugin
		try {
			plugin = require('./plugins/' + name)
		} catch (err) {
			if (err.code !== 'MODULE_NOT_FOUND') {
				console.log(`Error loading module: ./plugins/${name}`, err)
			}
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
				return {error: `Error running module '${name}': ${err.message}`}
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
				return opts.location
			}
			throw new Error(`${PermissionDenied}Module '${name}' does not have permission to access current location`)
		}
		return plugin.run(value, pluginOpts)
	},
}
