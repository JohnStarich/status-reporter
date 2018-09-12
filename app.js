const express = require('express')
const pluginManager = require('./plugin-manager')

const app = express()
const port = process.env.HTTP_PORT || 3000

pluginManager.init()

app.get('/status', (req, res, next) => {
	let opts = Object.assign({}, req.query)
	if (opts.loc) {
		let [lat, lon] = opts.loc.split(",")
		opts.location = {lat, lon}
		delete req.query['loc']
	}

	let results = Object.entries(req.query)
		.map(([tag, value]) => {
			return pluginManager.run(tag, value, opts)
				.then(result => {
					let plugin = {}
					plugin[tag] = result
					return plugin
				})
		})
	Promise.all(Object.values(results)).then(results => {
		let data = Object.assign({}, ...results)
		res.send({data})
		next()
	})
})

app.get('/tags', (req, res, next) => {
	res.send(pluginManager.tags())
	next()
})

app.listen(port, () => console.log(`Server started on port ${port}.`))
