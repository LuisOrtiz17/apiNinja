const mongoose = require('mongoose');

const dbConnection = async() =>{

    try {

        await mongoose.connect(process.env.BD_CONECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('BD online...');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicial la BD');
    }
};

module.exports = {
    dbConnection
}