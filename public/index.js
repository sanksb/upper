var global_id;
var esEditarOEliminar;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const respuesta = urlParams.get("respuesta");


function limitarFecha() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("frmFechaNac").setAttribute("max", today);
}

limitarFecha()

document.getElementById("btnIdEditar").disabled = true;

document.getElementById("btnIdEliminar").disabled = true;


/*Cargar Fecha a la fecha de hoy */
const poner_fecha = document.getElementById("frmFechaNac");

/*IMG*/
const imagenCargar = document.getElementById("myfile")
const imagenCargada = document.getElementById("imagenCargada")

const addphoto = document.getElementById("add_photo")
addphoto.addEventListener("click", () => {
    imagenCargar.click()
})
imagenCargar.addEventListener("change", (e) => {
    const imageFiles = e.target.files;
    const imageSrc = URL.createObjectURL(imageFiles[0]);
    imagenCargada.setAttribute("src", imageSrc)
})


/*NAV*********************************************************************************/
var frmNombreE = document.getElementById("frmNombre2")
var raza = document.getElementById("frmTipoRaza2")
var fechaNac = document.getElementById("frmFechaNac2")
var frmIdE = document.getElementById("frmID")
var frmPedrigiE = document.getElementById("frmPedrigi2")
var frmDescripciconE = document.getElementById("frmDescripcion2")
var frmImagen = document.getElementById("imagenCargada2")

var modalEdicion = document.getElementById("modalEdicion")
var modalSolicitar = document.getElementById("modalSolicitudEditar");
var btnEditarAceptar = document.getElementById("modalEdicionBottonAceptar");
var etIngresoCodigo = document.getElementById("ingresarIDEditar");
btnEditarAceptar.addEventListener("click", clickEditarAceptar)

async function clickEditarAceptar() {
    const text_clave = document.getElementById("ingresarIDEditar").value
    if (esEditarOEliminar == "editar") {
        document.getElementById("modalEdicion").style.visibility = "visible";
        const ezo = document.getElementById("ezo")
        ezo.click()
        let dog = await findDogByClave({id: global_id, clave: text_clave})
        if (dog) {
            var temp = dog.raza
            for (var i, j = 0; i = raza.options[j]; j++) {
                if (i.value == temp) {
                    raza.selectedIndex = j;
                    break;
                }
            }
            var fecha_nacimiento = new Date(dog.fecha_nacimiento);
            fechaNac.value = fecha_nacimiento.getFullYear() + '-' + ('0' + (fecha_nacimiento.getMonth() + 1)).slice(-2) + '-' + ('0' + fecha_nacimiento.getDate()).slice(-2);
            frmNombreE.value = dog.nombre
            frmIdE.value = global_id
            frmPedrigiE.value = dog.pedigri
            frmDescripciconE.value = dog.descripcion
            frmImagen.setAttribute("src", dog.imagen)
            modalEdicion.style.visibility = "visible";
            modalSolicitar.style.visibility = "hidden"

            etIngresoCodigo.value = "";
        } else {
            modalSolicitar.style.visibility = "hidden";
            modalEdicion.style.visibility = "hidden";
            etIngresoCodigo.value = "";
        }
    } else if (esEditarOEliminar == "eliminar") {
        modalSolicitar.style.visibility = "hidden";
        document.getElementById("btnIdEliminar").disabled = true;
        await deleteDog(global_id, text_clave);
        await cargarCards();
        etIngresoCodigo.value = "";
    }
}

document.getElementById("btnGuardar2").addEventListener("click", async () => {
    modalEdicion.style.visibility = "hidden";
    document.getElementById("refEdicion").disabled = true;
    document.getElementById("refEliminar").disabled = true;
    document.getElementById("btnIdEditar").disabled = true;
    document.getElementById("btnIdEliminar").disabled = true;
    modalEdicion.style.visibility = "hidden";

    const dogEdicicion = ({
        nombre: frmNombreE.value,
        pedrigi: frmPedrigiE.value,
        descripcion: frmDescripciconE.value,
        raza: raza.value,
    });
    await updateDog(global_id, dogEdicicion);
    await cargarCards()
});

document.getElementById("refEliminar").addEventListener("click", () => {
    if (global_id != "") {
        esEditarOEliminar = "eliminar"
        document.getElementById("modalSolicitudEditar").style.visibility = "visible";
    }
})
document.getElementById("refEdicion").addEventListener("click", () => {
    if (global_id != "") {
        esEditarOEliminar = "editar"
        document.getElementById("modalSolicitudEditar").style.visibility = "visible";
    }
})
const botonesCerrar = document.getElementsByClassName("btn-close-popup");
for( let x of botonesCerrar ){
    x.addEventListener("click",() => {
        document.getElementById("modalSolicitudEditar").style.visibility = "hidden";
    })
}
document.getElementById("modalEdicionCancelar").addEventListener("click",()=>{
    document.getElementById("modalSolicitudEditar").style.visibility = "hidden";
});
document.getElementById("btnCancelarCreacion").addEventListener("click",()=>{
    document.getElementById("modalCrear").style.visibility = "hidden";
});
document.getElementById("refCrear").addEventListener("click",()=>{
    document.getElementById("modalCrear").style.visibility = "visible";
});


async function cargarCards() {
    idContenedor.innerHTML = "";
    idContenedor.innerHTML = plantillaModalCardPrincipal(
        {
            dogs: await findDogs()
        }
    )
    const cards = document.getElementsByClassName("card");
    for (let card of cards) {
        card.style.background = 'rgb(0,0,0)'
        card.addEventListener("click", clickCard);
    }

    async function clickCard() {
        const id = this.getElementsByTagName("h5")[0];

        const cards = document.getElementsByClassName("card");
        for (let card of cards) {
            card.style.background = 'rgb(0,0,0)'
            card.addEventListener("click", clickCard);
        }

        global_id = id.textContent;
        document.getElementById("refEdicion").enabled = true;
        document.getElementById("refEliminar").enabled = true;
        document.getElementById("btnIdEliminar").enabled = true;
        document.getElementById("refEdicion").setAttribute("href", "#modalSolicitudEditar")
        document.getElementById("refEliminar").setAttribute("href", "#modalSolicitudEditar")
        this.style.background = 'rgb(224,224,224)';
        idpopup2.innerHTML = plantillaModal({
            dog: await findDog(id.textContent)
        });
    }
}

cargarCards();


async function enviarFetch(url, metodo = "GET", body) {
    try {
        let opts = {method: metodo};
        if (body) {
            opts.body = JSON.stringify(body);
            opts.headers = {"Content-type": "application/json"};
        }
        const resp = await fetch(url, opts);
        if (resp.ok) {
            const mimeType = resp.headers.get("content-type");
            if (mimeType && mimeType.startsWith("application/json"))
                return await resp.json();
            else return await resp.text();
        } else throw resp.statusText;
    } catch (err) {
        console.log(err);
    }
}

async function findDog(id) {
    return await enviarFetch(`/dogs/${id}`);
}

async function findDogByClave(params) {
    let url = `/dogs/`
    let id = params.id;
    url = url + `${id}`
    if (params.clave) {
        let clave = params.clave
        url = url + `?clave=${clave}`
    }
    return await enviarFetch(url)
}

async function findDogs() {
    return await enviarFetch('/dogs');
}

async function updateDog(id, dogData) {
    let url = `/dogs/`
    url = url + `${id}`
    return await enviarFetch(url, "PATCH", {dogData: dogData})
}

async function deleteDog(id, clave) {
    return await enviarFetch(`/dogs/${id}?clave=${clave}`, "DELETE");
}
