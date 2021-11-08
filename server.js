const mongoose = require('mongoose')

const app = require('./app')

const DB = "mongodb+srv://saksham:ZFaciHpNZnOunW7R@cluster0.iusod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose
	.connect(DB, {
		useNewUrlParser: true, 
        useUnifiedTopology: true 
	})
	.then((con) => {
		console.log('DATABSE connected successfully');
	});

const PORT = process.env.PORT || 3000 ;


app.listen(PORT, () => {
	console.log(`App running on port ${PORT}.....`);
});