// Clase principal para el Chat de Ayuda
class ContactBookHelpChat {
    constructor() {
      this.keywords = {
        "agregar": ["Puedes agregar un contacto haciendo clic en el botón '+' o 'Nuevo contacto'", 
                   "Para agregar un contacto, llena todos los campos del formulario y presiona 'Guardar'"],
        "buscar": ["Usa la barra de búsqueda en la parte superior para encontrar contactos por nombre",
                  "También puedes filtrar por grupo o categoría usando los filtros"],
        "eliminar": ["Para eliminar un contacto, selecciónalo y haz clic en el botón 'Eliminar'",
                    "También puedes hacer clic derecho sobre el contacto y seleccionar 'Eliminar'"],
        "editar": ["Para modificar los datos de un contacto, selecciónalo y haz clic en 'Editar'",
                  "Después de hacer cambios, asegúrate de guardar tus modificaciones"],
        "exportar": ["Puedes exportar tus contactos en formato CSV o vCard desde el menú 'Herramientas'"],
        "importar": ["Para importar contactos, ve al menú 'Herramientas' y selecciona 'Importar'"]
      };
  
      this.defaultResponses = [
        "¿En qué puedo ayudarte con tu agenda de contactos?",
        "Si necesitas ayuda específica, intenta preguntar sobre cómo agregar, buscar, editar o eliminar contactos.",
        "No entendí tu consulta. ¿Podrías reformularla?"
      ];
    }
  
    processQuery(query) {
      query = query.toLowerCase();
  
      for (const keyword in this.keywords) {
        if (query.includes(keyword)) {
          const responses = this.keywords[keyword];
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
  
      return this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
    }
  
    attachToDOM(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error("El contenedor especificado no existe");
        return;
      }
  
      // Crear estructura del chat
      container.innerHTML = `
        <div class="help-chat-container" id="help-chat-box">
          <div class="chat-header">
            <h3>Asistente de la Agenda</h3>
            <button id="close-chat" class="close-chat-btn">X</button>
          </div>
          <div class="chat-messages" id="chat-messages">
            <div class="message bot-message">
              ¡Hola! Soy tu asistente para la agenda de contactos. ¿En qué puedo ayudarte?
            </div>
          </div>
          <div class="chat-input">
            <input type="text" id="user-input" placeholder="¿En qué puedo ayudarte?">
            <button id="send-button">Enviar</button>
          </div>
        </div>
        <style>
          .help-chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            overflow: hidden;
            z-index: 9999;
          }
          .chat-header {
            background-color: #0d6efd;;
            color: white;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .close-chat-btn {
            background: transparent;
            color: white;
            border: none;
            font-size: 16px;
            cursor: pointer;
          }
          .chat-messages {
            height: 300px;
            overflow-y: auto;
            padding: 10px;
            background-color: #f5f5f5;
          }
          .message {
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 5px;
          }
          .bot-message {
            background-color: #e1e1e1;
            align-self: flex-start;
          }
          .user-message {
            background-color: #0d6efd;;
            color: white;
            align-self: flex-end;
            text-align: right;
          }
          .chat-input {
            display: flex;
            padding: 10px;
            background-color: white;
          }
          .chat-input input {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .chat-input button {
            background-color: #0d6efd;;
            color: white;
            border: none;
            padding: 8px 12px;
            margin-left: 5px;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      `;
  
      const sendButton = document.getElementById('send-button');
      const userInput = document.getElementById('user-input');
      const messagesContainer = document.getElementById('chat-messages');
      const closeButton = document.getElementById('close-chat');
  
      const sendMessage = () => {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;
  
        messagesContainer.innerHTML += `
          <div class="message user-message">
            ${userMessage}
          </div>
        `;
  
        const botResponse = this.processQuery(userMessage);
        messagesContainer.innerHTML += `
          <div class="message bot-message">
            ${botResponse}
          </div>
        `;
  
        userInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      };
  
      sendButton.addEventListener('click', sendMessage);
      userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
  
      closeButton.addEventListener('click', () => {
        document.getElementById('help-chat-box').remove();
      });
    }
  }
  
  // Mostrar el chat al hacer clic en el botón "Ayuda"
  document.addEventListener('DOMContentLoaded', () => {
    const ayudaBtn = document.getElementById('ayuda');
    const containerId = 'chat-container';
  
    if (ayudaBtn) {
      ayudaBtn.addEventListener('click', (e) => {
        e.preventDefault();
  
        const container = document.getElementById(containerId);
        const chatAlreadyOpen = document.getElementById('help-chat-box');
  
        if (chatAlreadyOpen) {
          chatAlreadyOpen.remove(); // Cierra si ya está abierto
        } else {
          const helpChat = new ContactBookHelpChat();
          helpChat.attachToDOM(containerId);
        }
      });
    }
  });
  