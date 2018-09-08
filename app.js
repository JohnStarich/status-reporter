const express = require('express')
const pluginManager = require('./plugin-manager')

const app = express()
const port = process.env.HTTP_PORT || 3000

app.get('/status', (req, res, next) => {
	let opts = Object.assign({}, req.query)
	if (opts.loc) {
		let [lat, lon] = opts.loc.split(",")
		opts.location = {lat, lon}
		delete req.query['loc']
	}

	let results = Object.entries(req.query).map(kv => {
		let [tag, value] = kv
		return pluginManager.run(tag, value, opts)
	})
	Promise.all(results).then(data => {
		res.send({data})
		next()
	})
})

app.listen(port, () => console.log(`Server started on port ${port}.`))
