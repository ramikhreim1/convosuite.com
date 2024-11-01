
const express = require('express');
const openai = require('../middlewares/openai');



let app = express.Router()

app.post('/sql', async (req, res, next) => {
	try {
		let { content } = req.body

		let prompt = `act as a SQL database administrator in front of an example database. The database contains tables named , "Users", "Orders" and "Suppliers",Employee(id, name, department_id)
		Department(id, name, address)
		Salary_Payments(id, employee_id, amount, date). I will ask you what i need and you will write A query:\n###\n` +
			``

		let inputRaw = `TEXT: ${content}\nKEY POINTS: 1.`
		prompt += inputRaw

		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 3000,
			temperature: 0.7,
			topP: 1,
			frequencyPenalty: 0,
			presencePenalty: 0,
			bestOf: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ["#", ";"],
		});

		let output = `${gptResponse.data.choices[0].text}`

		// remove the first character from output
		output = output.substring(1, output.length)

		// If the output string ends with one or more hashtags, remove all of them
		if (output.endsWith('"')) {
			output = output.substring(0, output.length - 1)
		}

		// If the output string ends with one or more hashtags, remove all of them
		if (output.endsWith('"')) {
			output = output.substring(0, output.length - 1)
		}

		// remove a single new line at the end of output if there is one
		if (output.endsWith('\n')) {
			output = output.substring(0, output.length - 1)
		}

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.output = output
		next()
	} catch (err) {
		next(err)
	}
})

module.exports = app