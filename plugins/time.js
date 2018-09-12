module.exports = {
	tags: ["time", "date"],

	run() {
		const date = new Date()
		let hours = date.getHours()
		let morning = hours < 12
		hours -= 12
		let morningStr = morning ? 'am' : 'pm'
		const time = hours.toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + morningStr
		return {
			text: "The current date and time is " + date.toString(),
			summary: "The current time is " + time,
		}
	},
}
