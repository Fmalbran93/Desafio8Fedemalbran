let box = document.getElementById("messagesLogs");
const chat = document.getElementById("chatBox");
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const socket = io();

let client;

Swal.fire({
    title: "SKATE & DESTROY",
    input: "text",
    text: "Como te llaman?",
    inputValidator: (value) => {
        return !value && "Ingresa tu alias"
    },
}).then((username) => {
    client = username.value;
    nombreUsuario.innerHTML = client;
    socket.emit("nuevousuario", client);
});

chat.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (chat.value.trim().length > 0) {
            socket.emit("message", { user: client, message: chat.value });
            chat.value = "";
        }
    }
});

socket.on("message", data => {
    let messages = "";
    data.forEach(message => {
        messages = messages + `<span class="fw-bold text-warning text-uppercase"> ${message.user} </span> dice: <span class="fw-bold text-secondary">${message.message}</span> <br>`
    })
    box.innerHTML = messages;
});

document.getElementById("clearChat").addEventListener("click", () => {
    try {
      document.getElementById("chatBox").textContent = "";
      socket.emit("clearchat");
    } catch (error) {
      console.error(error);
    }
  });
