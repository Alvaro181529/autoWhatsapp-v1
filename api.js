const { Client, LocalAuth } = require("whatsapp-web.js");
const code = document.getElementById("qrcode");
const rimraf = require("rimraf");
const fs = require("fs");
let numero;
let status;
const SESSION_FOLDER_PATH = ".wwebjs_auth";
async function startAPI() {
  let sessionData;
  console.log("estra a estart qr");
  const client = new Client({
    session: sessionData,
    authStrategy: new LocalAuth(),
  });

  client.on("qr", (qr) => {
    document.getElementById("estado").innerHTML = "Sin conexion";
    code.innerHTML = "";
    new QRCode(code, {
      text: qr,
      width: 350,
      height: 350,
    });
  });
  client.on("authenticated", async (session) => {
    console.log("Autenticado exitosamente");
    if (session) {
      console.log("Autenticado exitosamente");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    } else {
      console.error("Error: El objeto de sesión es undefined.");
    }
  });
  client.on("ready", () => {
    console.log("cliente inicializado");
    const user = client.info.me.user;
    numero = user.slice(-8);
    document.getElementById("user").innerHTML= numero
  });
  await client.initialize().then(() => {
    document.getElementById("estado").innerHTML = "conectado";
    code.innerHTML ="conectando...."
  });
  const texto = code.textContent;
  const palabra = texto.includes("conectando....");
  if (palabra) {
    console.log("La palabra 'oculto' se encuentra en el div.");
    const botonCerrar = document.querySelector("#cerrar");
    botonCerrar.click();
  } else {
    console.log("La palabra 'oculto' no se encuentra en el div.");
  }
  client.on("message_ack", (msg, ack) => {
    status = ack;
  });
  const eliminar = document.getElementById("eliminar");
  eliminar.addEventListener("click", function () {
    client.logout();
    setTimeout(function () {
      const eliminar = confirm("¿Esta seguro de eliminar la cuenta?");
      if (eliminar) {
        try {
          rimraf.sync(SESSION_FOLDER_PATH);
          console.log("Carpeta de sesiones eliminada exitosamente");
          alert(
            "Cuenta eliminada \n Recuerde que al salir la cuenta tambien tendria que eliminarlo de su dispositivo vinculado"
          );
          document.getElementById("iniciar").click();
        } catch (err) {
          console.error("Error al eliminar la carpeta de sesiones:", err.message);
        }
      }
    }, 3000);

  });
  return client;
}
// Función para eliminar la sesión local
function logeo() {
  if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log("Sesión encontrada.");
  } else {
    console.log(
      "No se encontraron datos de sesión. Escanea el código QR para autenticar."
    );
    fs.mkdirSync(SESSION_FOLDER_PATH);
  }
}
function callStatus() {
  status = status;
  console.log(status);
  return status;
}
function messageSend(cliente, contacto, mensaje) {
  try {
    return cliente.sendMessage(contacto, mensaje);
  } catch (error) {
    alert("No fue posible conectarse");
  }
}

logeo();

module.exports = {
  startAPI,
  messageSend,
  callStatus,
};
