var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const sharp = require('sharp');
const jwt = require('jsonwebtoken')
const { uid } =  require('uid');
const dotenv = require('dotenv');

dotenv.config();


function checkToken( req, res, next ) {
    if (req.method !== 'OPTIONS' && !req.originalUrl.match(/file/)) {
        let auth = req.header('Authorization');
        const regexp = /Bearer (.*)$/;
        const publicKey = process.env.jwtKey;
        if (auth && auth.match(regexp) && auth.match(regexp)[1]) {
            let token = auth.match(regexp)[1];
            try {
                payload = jwt.verify(token, publicKey);
                res.userId = payload.userId;
                res.email = payload.email;
            } catch (e) {
                if (e instanceof jwt.JsonWebTokenError) {
                    return res.status(401).end();
                }
            } finally {
                next();
            }
        } else {
            return res.status(400). end();
        }
    } else {
        next();
    }
}

function onFileupload(req, res) {

    let file = req['files'].file;

    console.log("File uploaded: ", file);

    if (file.size > 50000000) {
        return res.status(413).json({ error : 'Size >= 50M'});
    }

    const id = uid();

    const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

    if( ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') {
        sharp(file.data)
            .resize({width: 320, height : 320 })
            .toFile(__dirname + '/../upload/' + id + '-profile.png' )
            .then(()=> {
                return sharp(file.data)
                    .toFile(__dirname + '/../upload/' + id + '.png' )
            }).then(()=> {
                return sharp(file.data)
                    .resize({width: 50, height: 50})
                    .toFile(__dirname + '/../upload/' + id + '-vignette.png')
            }).then(()=> {

                    return res.status(200).json({file: id + '.png'});
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            })
    } else {
        fs.writeFile(__dirname + '/../upload/' + id + '.' + ext, file.data, (error) => {
            if (error) {
                console.log(error);
                console.log(error);
                return res.status(500).json(error);
            }
            return res.status(200).json({file : id + '.' + ext });
        })
    }
}



function readFile( req, res ) {
    console.log(req.params.filename);
    const file = __dirname + '/../upload/' + req.params.filename;
    return res.download(file);
}

function deletePicture( req, res ) {
    const filename = __dirname + '/../upload/' + req.params.filename;
    const radical = req.params.filename.substr(0, req.params.filename.lastIndexOf('.'));
    const profile = __dirname + '/../upload/' + radical + '-profile.png';
    const vignette = __dirname + '/../upload/' + radical + '-vignette.png';

    try {
        fs.existsSync(filename) ? fs.unlinkSync(filename) : null;
        fs.existsSync(profile) ? fs.unlinkSync(profile) : null;
        fs.existsSync(vignette) ? fs.unlinkSync(vignette) : null;
    } catch(error) {
        return res.status(500).json({error});
    }
    return res.status(200).json({ok: true});
}

var app = express();
app.use(cors())
app.use(fileUpload());
app.use(checkToken);

app.route('/upload').post(onFileupload);

app.route('/file/:filename').get(readFile)

app.route('/picture/:filename').delete(deletePicture);


app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'));
console.log("app listening on port: " , app.get('port'));
