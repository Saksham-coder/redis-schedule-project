const mongoose = require('mongoose')
const logger = require('./helpers/loggers')

const app = require('./app')

// const DB = "mongodb+srv://saksham:ZFaciHpNZnOunW7R@cluster0.iusod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const DB = "mongodb://localhost:27017/saksham"

mongoose
	.connect(DB, {
		useNewUrlParser: true, 
        useUnifiedTopology: true 
	})
	.then((con) => {
		logger.info('DATABSE connected successfully')
	});

const PORT = process.env.PORT || 3000 ;


app.listen(PORT, () => {
	logger.info(`App running on port ${PORT}.....`)
});