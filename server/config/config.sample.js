module.exports = {
	'url': 'http://localhost:8090',
  	'port': process.env.PORT || 8090,
	'database': 'mongodb://localhost:27017/gpsguide',
	// Secret key for JWT signing and encryption
	'secret': 'super secret passphrase'
}
