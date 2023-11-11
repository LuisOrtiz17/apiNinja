const jwt = require('jsonwebtoken');

const generarJWT = (uid, role) => {
    const payload = {uid, role}

    return new Promise(( resolve, reject) => {

        //metodo sing genera JWT hay que pasarle el payload generado y nuestra firma
        jwt.sign(payload, process.env.SECRET_KEY,{ expiresIn: '1h'},
        (err, token) => {
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(token)
            }
        })
    });

}

module.exports = {
    generarJWT
}
