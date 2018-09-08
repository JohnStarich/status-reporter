module.exports = {
	tags: ["time", "date"],

	run() {
		var date = new Date()
		return {
			text: "The date and time is " + date.toString(),
			summary: "The current time is " + date.getHours() + ":" + date.getMinutes(),
		}
	},
}
