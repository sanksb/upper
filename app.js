const PUERTO = 5001;
const express = require("express");
const app = express();
const multer = require('multer');

const bodyParser = require('body-parser');

const PUBLIC = "public";
const RUTA_SUBIDAS = 'images-clientes';
const MIMETYPES = ['image/jpeg', 'image/png']

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./" + PUBLIC + "/" + RUTA_SUBIDAS)
    },
    filename: (req, file, cb) => {
        console.log(file);
        const nombreFichero = Date.now() + file.originalname;
        req.originalname = nombreFichero;
        cb(null, nombreFichero)
    },
    // fileFilter :(req,file,cb) => {
    //     if (MIMETYPES.includes(file.mimetype)) cb(null,true)
    //     else cb(new Error(`Solo se permiten los archivos:${MIMETYPES}`))
    // }
})
const upload = multer({storage: storage})


app.use(bodyParser.urlencoded({extended: true}));

const db = require("./db.js")
app.use(express.json());
app.use(express.static(PUBLIC));


db.connect().then(() => {
    console.log("Conectado a la base de datos.");
    app.listen(PUERTO, () =>
        console.log(`Servidor escuchando en el puerto ${PUERTO}.`)
    );
});

/*GET recurso Lista usado para opdener todos los perro de la db b : aun no acepta parametros*/
app.get("/dogs", async (req, res) => {
    res.json(await db.find());
});
/*POST image en el create guardado en  ./public/images-clientes   **/
app.post('/upload', upload.single('image'), async (req, res) => {
    if (req.body.frmNombre
        && req.body.frmDescripcion && req.body.frmRaza && req.body.frm_fecha_nacimiento
        && req.body.frmRaza.valueOf() != "Elija una raza del perro"
        && req.body.ingresarClaveSecreta) {
        try {
            var fecha_hoy = new Date();
            var nacimiento = new Date(req.fecha_nacimiento);
            var edadtmp = fecha_hoy.getFullYear() - nacimiento.getFullYear();
            var value_of_pedrigi;

            if (req.body.frmPedrigi == 'on') {
                value_of_pedrigi = true;
            } else {
                value_of_pedrigi = false
            }
            if (isNaN(edadtmp)) {
                edadtmp = 0;
            }
            const dogData = {
                nombre: req.body.frmNombre,
                raza: req.body.frmRaza,
                fecha_nacimiento: new Date(req.body.frm_fecha_nacimiento),
                pedigri: value_of_pedrigi,
                descripcion: req.body.frmDescripcion,
                edad: edadtmp,
                clave: req.body.ingresarClaveSecreta,
                imagen: "/" + RUTA_SUBIDAS + "/" + req.originalname
            }
            if (dogData.fecha_nacimiento > Date.now()) {
                res.status(400).redirect("/upload");
            }
            const dog = await db.save(dogData);
            if (dog) res.location(`/dogs/${dog._id}`).redirect("/")
                // .redirect(`/#modalCreacionClaveSecreta`);
            // if (dog) res.location(`/dogs/${dog._id}`).status(201).redirect(`/?respuesta=${dogData.}`);
            else res.status(400).redirect("/");
        } catch (err) {
            res.status(400).send("Valores incorrectos para crear un perro.");
        }
    } else {
        res.status(400).send("Valores incorrectos para crear un perro.");
    }
});
/*GET recurso individual*/
app.get("/dogs/:id", async (req, res) => {
    if (req.query.clave) {
        /*quiero comprobar si la clave existe de ese id */
        var dog = await db.findSingleDog({
            id: req.params.id,
            clave: req.query.clave
        });
        if (dog) {
            res.json(dog);
        } else res.status(404).send(`No existe un perro con ID=${req.params.id}.`);
    } else {
        const dog = await db.findSingleDog({id: req.params.id});
        if (dog) {
            res.json(dog);
        } else res.status(404).send(`No existe un perro con ID=${req.params.id}.`);
    }
});
app.patch("/dogs/:id", async (req, res) => {
    const dogData = req.body.dogData
    const updateDog = await db.actualizar(req.params.id, dogData)
    if (updateDog) {
        res.sendStatus(204)
    } else res.status(404).send(`No existe un perro con ID=${req.params.id}.`);
});

/*DELETE recurso individual*/
app.delete("/dogs/:id", async (req, res) => {
    console.log(req.params.id,req.query.clave)
    if (await db.delete(req.params.id, req.query.clave)) {
        res.sendStatus(204);
    } else res.status(404).send(`No perro un perro con ID=${req.params.id}.`);
});



