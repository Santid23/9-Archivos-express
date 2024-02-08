const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const fileUpload = require('express-fileupload')
const fs = require('fs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(fileUpload())
app.use(fileUpload({ createParentPath: true, preserveExtension: true }))
app.use('/fotos', express.static('archivos'));

app.post('/subir', async (req, res) => {
    let date = new Date()
    let now = date.toISOString()

    now = now.replaceAll('-', '').replaceAll(':', '').replaceAll('', '')
    if (!req.files) {
        res.send({
            status: false,
            message: 'Petición sin archivo',
        })
    } else {
        let file = req.files.archivo

        let md5 = file.md5
        file.mv('./archivos/' + now + md5 + file.name)

        res.send({
            status: true,
            message: 'Archivo subido',
            data: {
                name: file.name,
                mimetype: file.mimetype,
                size: file.size,
            },
        })
    }
})


app.get('/descarga', (req, res) => {
    res.download('./archivos/' + req.body.archivo)
})

app.get('/imagenes', (req, res) => {
    fs.readdir('./archivos/', (err, files) => {
        if (err) {
            res.send('Error leyendo los archivos.', err);
        } else {
            const imgPaths = files.map(
                file => `http://localhost:3001/fotos/${file}`
            );
            res.send(imgPaths);
        }
    });
});



app.listen(port, err => {
    err
        ? console.error(err)
        : console.log(`Servidor iniciado en http://localhost: ${port}`)
})