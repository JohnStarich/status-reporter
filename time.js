
module.exports = function() {
	var date = new Date()
	return {
		text: "The date and time is " + date.toString(),
		summary: "The current time is " + date.getHours() + ":" + date.getMinutes(),
		tags : ["time", "date"],
	}
}
