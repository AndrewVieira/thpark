const handleLogin = (db) => (req, res) => {
	const credentials = {username: req.body.username, password: req.body.password};

	db.query('SELECT * FROM employee WHERE username = ${username} AND password = crypt(${password}, password)', credentials)
	.then(function(data) {
		//console.log(data);
		if (data[0] != 'undefined'){
			res.json(data[0]);
		}
		else {
			res.status(400).json('Wrong credentials');
		}
	})
	.catch(function(error) {
		//console.log('ERROR: ', error);
		res.status(400).json('Wrong credentials');
	})
	.finally(db.$pool.end);	
}

module.exports = {
	handleLogin: handleLogin
}