//--------------------------------------------
//       Referenciar contenidos
//leer recibido y enviado                        |x
//jugar con el tiempo                            |x
//las palabras ambos                             |X
//pueden hacer de manera randomica               |X
//mostrar la lista de envidados                  |X
//validacion de numeros                          |X
//hacer que se pueda editar fraces randomicas    |X
//actualizar pagina                              |X
//SE ECONTRO UN ERROR EL ENVIO ES DE INMEDIATO   |X
//ejecutable                                     |
//diseño  agbc                                   |
//resumen de los enviados                        |X
//conectar a la base de datos enviados           |/
//--------------------------------------------
const { startAPI, messageSend, callStatus } = require("./api.js");
const { updateOnlineStatus } = require("./status.js");
const XLSX = require("xlsx");
let mysql = require("mysql");
const fs = require("fs");
const { sync } = require("rimraf");

updateOnlineStatus();

//--------------------------------------------
//       Coneccion BD
//--------------------------------------------
let conexion;

conexion = mysql.createConnection({
  host: "localhost",
  database: "trackpak",
  user: "root",
  password: "",
});

conexion.connect(function (err) {
  if (err) {
    document.getElementById("jsonDataBD").innerHTML =
      "No conectado a la base de datos";
    console.log("No conectado a la base de datos");
    throw err;
  } else {
    document.getElementById("jsonDataBD").innerHTML =
      "Conexion a la base de datos exitosa";
    console.log("Conexion a la base de datos exitosa");
  }
});

//--------------------------------------------
//       Excel a Json
//--------------------------------------------
var selectedFile;
var name_item = [];
var allJSONObjects = [];
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
      selectedFile = event.target.files[0];
    });

  document.getElementById("uploadExcel").addEventListener("click", function () {
    if (selectedFile) {
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });

        allJSONObjects = [];

        workbook.SheetNames.forEach((sheet) => {
          let rowObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          let jsonArray = JSON.parse(JSON.stringify(rowObject));
          allJSONObjects = allJSONObjects.concat(jsonArray);

          jsonArray.forEach((objeto) => {
            for (var prop in objeto) {
              if (
                typeof objeto[prop] === "number" &&
                !name_item.includes(prop)
              ) {
                name_item.push(prop);
              }
            }
          });
        });
        document.getElementById("jsonData").innerHTML =
          allJSONObjects.length + " numeros de contacto contactos encontrados";
      };
      fileReader.readAsBinaryString(selectedFile);
    }
  });
});
//--------------------------------------------
//       FUNCION DE TIEMPO
//--------------------------------------------

var sleepES5 = function (ms) {
  var esperarHasta = new Date().getTime() + ms;
  while (new Date().getTime() < esperarHasta) continue;
};
//--------------------------------------------
//       Librerias de fraces
//--------------------------------------------

// Variable para almacenar las frases aleatorias
let frasesAleatorias = [];

// Función para cargar las frases al cargar la página
function cargarFrases() {
  const listaFrases = document.getElementById("lista-frases");
  listaFrases.innerHTML = "";

  frasesAleatorias.forEach((frase, index) => {
    const li = document.createElement("li");
    li.textContent = frase;
    li.setAttribute("data-index", index);
    li.addEventListener("click", seleccionarFrase);
    listaFrases.appendChild(li);
  });
}

// Función para agregar una nueva frase desde el textarea
function agregarFrase() {
  const nuevaFrase = document.getElementById("editor").value.trim();
  if (nuevaFrase !== "") {
    frasesAleatorias.push(nuevaFrase);
    cargarFrases();
    guardar();
    document.getElementById("editor").value = "";
  }
}

// Función para eliminar la frase seleccionada
function eliminarFrase() {
  const listaFrases = document.getElementById("lista-frases");
  const seleccionado = listaFrases.querySelector(".seleccionado");

  if (seleccionado) {
    const index = parseInt(seleccionado.getAttribute("data-index"));
    frasesAleatorias.splice(index, 1);
    cargarFrases();
    guardar();
  }
}

// Función para marcar la frase seleccionada
function seleccionarFrase(event) {
  const listaFrases = document.getElementById("lista-frases");
  const items = listaFrases.getElementsByTagName("li");

  // Desmarcar todas las frases
  Array.from(items).forEach((item) => {
    item.classList.remove("seleccionado");
  });

  // Marcar la frase seleccionada
  event.target.classList.add("seleccionado");
}

// Función para guardar las frases en un archivo (simulado)

// Cargar las frases al cargar la página

fs.readFile("frases.txt", "utf8", (err, data) => {
  if (err) throw err;
  frasesAleatorias = data.split("\n");
});

function guardar() {
  const contenido = frasesAleatorias.join("\n");
  fs.writeFile("frases.txt", contenido, (err) => {
    if (err) throw err;
  });
}

fetch("frases.txt")
  .then((response) => response.text())
  .then((data) => (document.getElementById("lista-frases").value = data));

//--------------------------------------------
//       Envio de Mensajes variables
//--------------------------------------------
let m;
let o;
let enviados = 0;
let rechazados = 0;
let message = "";
let tiempo;
let espera;
let cantidad;
const code = "591";
const men = document.getElementById("mensajetxt");

//--------------------------------------------

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * frasesAleatorias.length);
  return frasesAleatorias[indiceAleatorio];
}
//--------------------------------------------

men.addEventListener("input", function () {
  message = men.value;
  console.clear();
  });

function espTiem() {
  tiempo = Math.floor((3000000 - 1000000) * Math.random() + 1000000);
  return tiempo;
}

function espEsp() {
  espera = Math.floor((15000000 - 9000000) * Math.random() + 10000000);
}
function espCan() {
  cantidad = Math.floor(Math.random() * (40 - 20) + 20);
  return cantidad;
}

//--------------------------------------------
//       Inicio de Cliente y Recorrido del Array de Numeros
//--------------------------------------------
cantidad = espCan();
function envioMensaje() {
  try {
    m = 0;
    o = 0;
    let n = 1;
    allJSONObjects.forEach(async (objeto) => {
      const cliente = container.client;
      // const cliente = " container.client";
      let nameItem = objeto[name_item];
      let tiempo = Math.floor((2000000 - 1000000) * Math.random() + 10000);
      espEsp();
      const fraseAleatoria = obtenerFraseAleatoria();
      const phone = code + nameItem + "@c.us";
      const mensaje = message + " " + fraseAleatoria;
      if (m == cantidad) {
        setTimeout(function () {
          let status = callStatus();
          console.log("funcion send (Espera)");
          datosTabla(n, nameItem, cliente, phone, mensaje, tiempo, status).then(
            () => n++
          );
        }, espera);
        espera += espera;
        m = -1;
      } else {
        setTimeout(function () {
          let status = callStatus();
          console.log("funcion send (Tiempo)");
          datosTabla(n, nameItem, cliente, phone, mensaje, tiempo, status).then(
            () => n++
          );
        }, tiempo);
        tiempo += tiempo;
      }
      console.log(n, nameItem, cliente, phone, mensaje, o);

      m++;
      o++;
    });
  } catch (error) {
    console.log("Si llego a esto es un error ", error);
  }
}

const container = {
  client: null,
};

async function star() {
  console.log("estas son las fraces", frasesAleatorias);
  const client = await startAPI();
  container.client = client; // Almacena el cliente en el contenedor
  return client;
}

//--------------------------------------------
//       Envio de mensajes, Base de datos
//--------------------------------------------

let diferentesIds;

//ENVIO DE MENSAJE
function mostarBD() {
  //CONSULTA PARA SABER SI LA ZONA ESTA VACIA , PERO SE TIENE UN NUMERO DE TELEFONO
  //SELECT * FROM packages WHERE ZONA = ""AND TELEFONO IS NOT NULL AND TELEFONO <> 0;
  //SELECT * FROM packages WHERE ZONA = "" OR ZONA IS NULL;

  const verificarBD = () => {
    return new Promise((resolve, reject) => {
      const menQuery = "SELECT * FROM mensajes";
      const packQuery =
        "SELECT * FROM packages WHERE ZONA <> '' AND ZONA IS NOT NULL AND TELEFONO <> 0";
      const packageSN =
        "SELECT * FROM packages WHERE ZONA <> '' AND TELEFONO IS NOT NULL AND TELEFONO = 0";
      conexion.query(menQuery, function (errorMen, listaMen) {
        if (errorMen) {
          reject(errorMen);
        } else {
          const idTelefono = new Set(
            listaMen.map((objeto) => objeto.id_telefono)
          );
          conexion.query(packQuery, function (errorPack, listaPack) {
            if (errorPack) {
              reject(errorPack);
            } else {
              const idPack = new Set(
                listaPack.map((objeto) => ({
                  id: objeto.id,
                  TELEFONO: objeto.TELEFONO,
                }))
              );
              conexion.query(packageSN, function (errorPack, listaPack) {
                if (errorPack) {
                  reject(errorPack);
                } else {
                  const idPackSN = new Set(
                    listaPack.map((objeto) => ({
                      id: objeto.id,
                      TELEFONO: objeto.TELEFONO,
                      ZONA: objeto.ZONA,
                    }))
                  );

                  resolve({ idTelefono, idPack, idPackSN });
                }
              });
            }
          });
        }
      });
    });
  };

  verificarBD()
    .then(({ idTelefono, idPack, idPackSN }) => {
      console.log("ID en Mensajes");
      idTelefono.forEach((id_telefono) => {
        console.log(id_telefono);
      });
      console.log("ID en Pack");
      idPack.forEach((objeto) => {
        console.log(objeto.id, objeto.TELEFONO);
      });

      console.log("ID de los que no tienen Numero pero si tienen Zonas");
      idPackSN.forEach((objeto) => {
        console.log(objeto.id, objeto.TELEFONO, objeto.ZONA);
      });

      // Verificar si hay IDs iguales de los mensajes enviados
      const idsComunes = [...idTelefono].filter((id) => {
        const idEnPack = [...idPack].find((objeto) => objeto.id === id);
        return idEnPack !== undefined;
      });

      if (idsComunes.length > 0) {
        console.log("\nIDs comunes:");
        idsComunes.forEach((id) => {
          const idEnPack = [...idPack].find((objeto) => objeto.id === id);
          console.log(id, idEnPack.TELEFONO);
        });
      } else {
        console.log("\nNo hay IDs comunes entre idTelefono e idPack.");
      }

      const idsComunesCeros = [...idTelefono].filter((id) => {
        const idEnPack = [...idPackSN].find((objeto) => objeto.id === id);
        return idEnPack !== undefined;
      });

      if (idsComunesCeros.length > 0) {
        console.log("\nIDs comunes que no tienen numeros:");
        idsComunesCeros.forEach((id) => {
          const idEnPackSN = [...idPackSN].find((objeto) => objeto.id === id);
          console.log(id, idEnPackSN.TELEFONO, idEnPackSN.ZONA);
        });
      } else {
        console.log("\nNo hay IDs comunes entre idTelefono e idPack.");
      }

      // IDs que no son iguales con los que tienen numeros y zonas

      const idsNoIgualesEnPack = [...idPack].filter(
        (objeto) => !idTelefono.has(objeto.id)
      );

      if (idsNoIgualesEnPack.length > 0) {
        console.log("\nIDs en idPack que no están en idTelefono:");
        m = 0;
        o = 0;
        let n = 1;
        const tam = idsNoIgualesEnPack.length;
        idsNoIgualesEnPack.forEach((objeto) => {
          console.log(objeto.id, objeto.TELEFONO);
          let id = objeto.id;
          const cliente = container.client;
          let nameItem = objeto.TELEFONO;
          let tiempo = Math.floor((2000000 - 1000000) * Math.random() + 100000);
          espEsp();
          const fraseAleatoria = obtenerFraseAleatoria();
          const phone = code + nameItem + "@c.us";
          const mensaje = message + " " + fraseAleatoria;
          if (m == cantidad) {
            setTimeout(function () {
              let status = callStatus();
              console.log("funcion send (Espera)");
              datosTablaBD(
                n,
                nameItem,
                cliente,
                phone,
                mensaje,
                tiempo,
                status,
                id,
                tam
              ).then(() => n++);
            }, espera);
            espera += espera;
            m = -1;
          } else {
            setTimeout(function () {
              let status = callStatus();
              console.log("funcion send (Tiempo)");
              datosTablaBD(
                n,
                nameItem,
                cliente,
                phone,
                mensaje,
                tiempo,
                status,
                id,
                tam
              ).then(() => n++);
            }, tiempo);
            tiempo += tiempo;
          }
          console.log(n, nameItem, cliente, phone, mensaje, o, id);

          m++;
          o++;
        });
      } else {
        console.log("no se encuentra nada");
        alert("No todos los mensajes ya fuerron enviados")
      }

      // IDs que no son iguales solo los que tienen zonas pero no numero
      // estos se enviaran de forma automatica

      const idsNoIgualesEnPackSN = [...idPackSN].filter(
        (objeto) => !idTelefono.has(objeto.id)
      );

      if (idsNoIgualesEnPackSN.length > 0) {
        console.log("\nIDs en idPack que no están en idTelefono de zonas:");
        m = 0;
        o = 0;
        let n = 1;
        const tam = idsNoIgualesEnPackSN.length;

        idsNoIgualesEnPackSN.forEach((objeto) => {
          console.log(objeto.id, objeto.TELEFONO);
          let id = objeto.id;
          console.log(objeto.id, objeto.TELEFONO);
          const cliente = container.client;
          let nameItem = objeto.TELEFONO;
          let tiempo = Math.floor((2000000 - 1000000) * Math.random() + 100000);
          espEsp();
          const phone = code + nameItem + "@c.us";
          const mensaje = "Sin mensaje";
          if (m == cantidad) {
            setTimeout(function () {
              let status = callStatus();
              console.log("funcion send (Espera)");
              datosTablaBD(
                n,
                nameItem,
                cliente,
                phone,
                mensaje,
                tiempo,
                status,
                id,
                tam
              ).then(() => n++);
            }, espera);
            espera += espera;
            m = -1;
          } else {
            setTimeout(function () {
              let status = callStatus();
              console.log("funcion send (Tiempo)");
              datosTablaBD(
                n,
                nameItem,
                cliente,
                phone,
                mensaje,
                tiempo,
                status,
                id,
                tam
              ).then(() => n++);
            }, tiempo);
            tiempo += tiempo;
          }
          console.log(n, nameItem, cliente, phone, mensaje, o, id);

          m++;
          o++;
        });
      } else {
        console.log("no se encuentra nada");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function insertarMen(estado, mensajes, observacion, id_telefono) {
  //INSERT INTO `mensajes` (`id`, `estado`, `mensajes`, `observacion`, `id_telefono`) VALUES (NULL, 'Enviado', 'hola usuario', 'numero incorrecto', '10261');
  const enviarMensajes =
    "INSERT INTO `mensajes` (`id`, `estado`, `mensajes`, `observacion`, `id_telefono`) VALUES (NULL, ?, ?, ?, ?)";
  conexion.query(
    enviarMensajes,
    [estado, mensajes, observacion, id_telefono],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log("insertado");
      }
    }
  );
}
//--------------------------------------------
//       Envio de mensajes, muestra de info y validacion BD
//--------------------------------------------

async function datosTablaBD(
  n,
  celular,
  cliente,
  phone,
  mensaje,
  tiempo,
  status,
  id
) {
  let tableBody = document.getElementById("tbody");
  let estado;
  let descripcion;
  const cantidad = allJSONObjects.length;
  const res = cantidad - 1;
  if (typeof celular == "number") {
    let numeroComoCadena = celular.toString();
    let primerNumero = numeroComoCadena[0];
    let cantidadDigitos = numeroComoCadena.length;
    if (
      (cantidadDigitos == 8 && primerNumero == 7) ||
      primerNumero == 8 ||
      primerNumero == 6
    ) {
      if (status == 3) {
        estado = `Leido`;
      } else if (status == 2) {
        estado = `Recibido`;
      } else if (
        status == 1 ||
        status == "undefined" ||
        status == undefined ||
        status != 1
      ) {
        estado = `Enviado`;
      }
      descripcion = `El número es correcto.`;
      enviados++;
      messageSend(cliente, phone, mensaje).then(() => {
        document.getElementById("resultados-envio").innerHTML = enviados;
        document.getElementById("resultados-rechazado").innerHTML = rechazados;
        if (n == res) {
          tableBody.innerHTML += `<tr>${"<td align='center' colspan='5'> MENSAJES FINALIZADOS</td>"}</tr>`;
          alert("se enviaron los mensajes");
        }
      });
    } else if (cantidadDigitos > 8) {
      rechazados++;
      estado = `No enviado`;
      descripcion = `El número es incorrecto.`;
    } else {
      rechazados++;
      estado = `No enviado`;
      descripcion = `El número es incorrecto.`;
    }
  } else {
    rechazados++;
    estado = "No es un número.";
  }
  insertarMen(estado, mensaje, descripcion, id);
  tableBody.innerHTML += `<tr>${"<td>" +
    n +
    "</td>" +
    "<td>" +
    celular +
    "</td>" +
    "<td>" +
    estado +
    "</td>" +
    "<td>" +
    descripcion +
    "</td>" +
    "<td>" +
    tiempo / 10000 +
    " seg</td>"
    }</tr>`;
}

//--------------------------------------------
//       Envio de mensajes, muestra de info y validacion
//--------------------------------------------

async function datosTabla(n, celular, cliente, phone, mensaje, tiempo, status) {
  let tableBody = document.getElementById("tbody");
  let estado;
  let descripcion;

  if (typeof celular == "number") {
    let numeroComoCadena = celular.toString();
    let primerNumero = numeroComoCadena[0];
    let cantidadDigitos = numeroComoCadena.length;
    if (
      (cantidadDigitos == 8 && primerNumero == 7) ||
      primerNumero == 8 ||
      primerNumero == 6
    ) {
      if (status == 3) {
        estado = `Leido`;
      } else if (status == 2) {
        estado = `Recibido`;
      } else if (
        status == 1 ||
        status == "undefined" ||
        status == undefined ||
        status != 1
      ) {
        estado = `Enviado`;
      }
      descripcion = `El número es correcto.`;
      enviados++;
      messageSend(cliente, phone, mensaje).then(() => {
        document.getElementById("resultados-envio").innerHTML = enviados;
        document.getElementById("resultados-rechazado").innerHTML = rechazados;
        if (n == allJSONObjects.length) {
          tableBody.innerHTML += `<tr>${"<td align='center' colspan='5'> MENSAJES FINALIZADOS</td>"}</tr>`;
          alert("se enviaron los mensajes");
        }
      });
    } else if (cantidadDigitos > 8) {
      rechazados++;
      estado = `No enviado`;
      descripcion = `El número es incorrecto.`;
    } else {
      rechazados++;
      estado = `No enviado`;
      descripcion = `El número es incorrecto.`;
    }
  } else {
    rechazados++;
    estado = "No es un número.";
  }
  tableBody.innerHTML += `<tr>${"<td>" +
    n +
    "</td>" +
    "<td>" +
    celular +
    "</td>" +
    "<td>" +
    estado +
    "</td>" +
    "<td>" +
    descripcion +
    "</td>" +
    "<td>" +
    tiempo / 10000 +
    " seg</td>"
    }</tr>`;
}
//--------------------------------------------
//       Uso de botones
//--------------------------------------------

const themeButton = document.getElementById('toggle-theme');

themeButton.addEventListener('click', function() {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  const theme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-bs-theme', theme);

  // Cambiar la clase del botón
  themeButton.classList.toggle('btn-dark', theme === 'light');
  themeButton.classList.toggle('btn-light', theme === 'dark');
});

const uploadButton = document.getElementById('uploadExcel');
uploadButton.disabled = true; // Desactiva el botón
const fileInput = document.getElementById('fileUpload');

fileInput.addEventListener('change', function () {
  if (fileInput.files.length > 0) {
    uploadButton.disabled = false; // Activa el botón si hay un archivo
  } else {
    uploadButton.disabled = true; // Desactiva el botón si no hay archivo
  }
});
const submitButton = document.getElementById('enviar');
submitButton.disabled = true; // Desactiva el botón

uploadButton.addEventListener('click', function () {
  // Activa el botón "Enviar" al hacer clic en "Aceptar"
  submitButton.disabled = false;
});

document.addEventListener("DOMContentLoaded", function () {
  // Obtener referencias a los elementos
  const excelButton = document.getElementById("excel");
  const bdButton = document.getElementById("bd");
  const verExcelSection = document.getElementById("verEXCEL");
  const verBDSection = document.getElementById("verBD");
  const enviarButton = document.getElementById("enviar");
  const conectarButton = document.getElementById("conectar");

  // Agregar eventos a los botones
  excelButton.addEventListener("click", function () {
    verExcelSection.style.display = "block";
    verBDSection.style.display = "none";
    enviarButton.style.display = "block";
    conectarButton.style.display = "none";
  });

  bdButton.addEventListener("click", function () {
    verExcelSection.style.display = "none";
    verBDSection.style.display = "block";
    enviarButton.style.display = "none";
    conectarButton.style.display = "block";
  });
});
document.getElementById("agregarFrase").addEventListener("click", function () {
  agregarFrase();
});

document.getElementById("eliminarFrase").addEventListener("click", function () {
  eliminarFrase();
});

document.getElementById("enviar").addEventListener("click", function () {
  envioMensaje();
  alert("iniciando mensajes");
});

document.getElementById("conectar").addEventListener("click", function () {
  mostarBD();
});
document.getElementById("verFrase").addEventListener("click", function () {
  cargarFrases();
})
document.getElementById("iniciar").addEventListener("click", function () {
  console.log("inicio de start");
  star();
  // Oculta el botón y muestra el spinner
  this.style.display = "none";
  document.getElementById("overlay").style.display = "flex";

  // Simula la carga de elementos después de 10 segundos
  setTimeout(function () {
    // Agrega la clase oculto para ocultar los elementos
    document.getElementById("overlay").style.display = "none";
    document.getElementById("elementos").classList.remove("oculto");
  }, 18000); // 10000 milisegundos = 10 segundos
});
