describing("Validation tests", ()=> {
    beforeAll((done) => {
        // secure password relative to app.js
        const mongoPassword = require('../../../../../pas');
        // 'node-angular' is the database it is storing the post in
        const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

        mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true })
            .then(() => {
                console.info('\n*Connected to mongo\n');
                done();
            }).catch(() => {
                console.info('\n*Connection failed\n');
                done();
            });
    });

    it('saves a match', done=> {
        
    });
});