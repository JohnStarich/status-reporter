const request = require('request-promise')

module.exports = function(lat, lon) {
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
		var results = data.query.results.channel
		var temp = results.item.condition.temp
		var units = results.units.temperature
		return {
			text : "The temperature is currently " + temp + " degrees " + units,
			summary : "The temperature is currently " + temp + " degrees " + units,
			tags : ["weather","temperature"],
		}
	})
}

