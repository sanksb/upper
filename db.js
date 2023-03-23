const mongoose = require("mongoose");
const DogSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim: true, minLength: 1},
        raza: {
            type: String,
            trim: true,
            required: true,
            enum: ["Chihuahua",
                "Terrier tibetano",
                "Alaskan malamute",
                "Basenji",
                "Alabai"],
        },
        fecha_nacimiento: {
            type: Date,
            required: true
        },
        pedigri: {
            type: Boolean,
            required: true
        },
        descripcion: {
            type: String,
            default: "Perro sin Descripcion"
        },
        popularidad: Number,
        edad: {type: Number, max: 15, required: true},
        imagen: {
            type: String,
            required: true
        },
        clave: {
            type: String,
            required: true
        }
    },
    {
        methods: {
            calificar: async function (like) {
                if (like = 1)
                    this.popularidad + 1;
                else
                    this.popularidad - 1;
                return await this.save();
            }
        }
    }
);
const Dog = new mongoose.model("Dog", DogSchema);
exports.connect = async function () {
    mongoose.set("strictQuery", false);
    await mongoose.connect('mongodb://127.0.0.1:27017/doglovers');
};

exports.close = async function () {
    await mongoose.disconnect();
};
exports.find = async function (params) {
    const query = Dog.find()
    return await query.exec()
}

exports.save = async function (dogData) {
    try {
        const dog = new Dog(dogData);
        return await dog.save();
    } catch (err) {
        return undefined;
    }
};
exports.findByPopularidad = async function (likes) {
    return await Dog.find()
        .where("popularidad")
        .gte(Number(likes))
        .sort({popularidad: -1});
}
exports.findByRaza = async function (raza) {
    return await Dog.find()
        .where("raza")
        .equals(raza);
}

exports.findByClave = async function (id, clave) {
    return await Dog.find({clave: "pruebaunica", _id: id})
    // const query = Dog.find().limit(1)
    // return await query.exec()
}
exports.topTenDogs = async function () {
    return await Dog.find()
        .sort({popularidad: -1})
        .limit(10);

}

exports.findById = async function (dogId) {
    /*Devolveria un objeto con ese id obtenido de mongo*/
    return await Dog.findById(dogId);
}
exports.findSingleDog = async function (params) {
    if (params.clave && params.id) {
        const dog = await Dog.find({clave: params.clave, _id: params.id})
        return dog[0]
    } else {
        return await Dog.findById(params.id);
    }
}
exports.actualizar = async function (dogId, dogData) {
    return Dog.updateOne({_id: dogId}, {
        nombre: dogData.nombre,
        pedrigi: dogData.pedrigi,
        descripcion: dogData.descripcion,
        raza: dogData.raza
    });
}

exports.calificar = async function (dogId, like) {
    const dog = Dog.findById(dogId);
    if (dog) {
        return await dog.calificar(like);
    } else {
        return undefined;
    }
}

exports.delete = async function (dogId,clave) {
    return (await Dog.deleteOne({_id: dogId , clave : clave})).deletedCount == 1;
};

