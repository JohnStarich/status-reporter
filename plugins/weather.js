const request = require('request-promise')

const LocationNotProvided = {error: "Location information was not provided."}

module.exports = {
	location: true,
	tags: ["weather", "temperature"],

	run(value, opts) {
		if (opts.location === undefined) {
			return LocationNotProvided
		}
		let {lat, lon} = opts.location
		if (lat === undefined || lon === undefined) {
			return LocationNotProvided
		}
		queryParams = {
			'q': `
				select *
				from weather.forecast
				where woeid in (
					SELECT woeid FROM geo.places WHERE text="(${lat},${lon})"
				)
			`,
			'format': 'json',
		}
		return request({
			url: "https://query.yahooapis.com/v1/public/yql",
			qs: queryParams,
		}).then(body => {
			let data = JSON.parse(body)
			if(data.query.results === null) {
				return {error: "No data found for this location."}
			}
			let results = data.query.results.channel
			let temp = results.item.condition.temp
			let units = results.units.temperature
			return {
				text : "The temperature is currently " + temp + " degrees " + units,
				summary : "The temperature is currently " + temp + " degrees " + units,
			}
		})
	},
}
