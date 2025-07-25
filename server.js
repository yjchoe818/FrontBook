const pkg = require('./package.json')
const config = require('./config.json')
const path = require('path')
const express = require('express')
const debug = require('debug')(`${pkg.name}:server`)
const rateLimit = require('express-rate-limit') // Added rate-limit package

const server = express()
const distDirectory = path.resolve(config.directories.dist)

const limiter = rateLimit({ // Define rate limiting
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // Limit each IP to 100 requests per windowMs
})

module.exports = () => {
	debug('booting web server')

	return new Promise((resolve, reject) =>
		server
			.set('port', process.env.PORT || 9000)
			.use(express.static(distDirectory))
			.use(limiter) // Apply rate limiting middleware
			.get('*', (req, res) => {
				debug(`${req.method} ${req.url}`)
				res.sendFile(`${distDirectory}/index.html`)
			})
			.listen(server.get('port'), (error) => {
				if (error) reject(error)
				debug(`application is running at http://localhost:${server.get('port')}`)
				resolve()
			})
	)
}
