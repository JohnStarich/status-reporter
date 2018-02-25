const express = require('express')
const weather = require('./weather')
const time = require('./time')

const app = express()


app.get('/status', (req, res, next) => {
	let lat = req.query.lat
	let lon = req.query.lon
	console.log("Lat", lat, "Lon", lon)

	let tags = req.query.tags

	const tagMappings = {
		'server': [() => weather(lat, lon), time],
		'time': [time],
		'default': [
			() => weather(lat, lon),
			time
		]
	}

	let resultFuncs = tagMappings[tags] !== undefined ? tagMappings[tags] : tagMappings['default']

	resultFuncs = resultFuncs.map(r => r())

	Promise.all(resultFuncs)
		.then(data => {
			res.send({data})
			next()
		})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
