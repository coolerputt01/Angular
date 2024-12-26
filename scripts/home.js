const textLink = document.querySelector('.text');
const loader = `
  <div class="loading">
    <span><i class="fa fa-code"></i> <span class="loading-text">Angular Sense</span></span>
  </div>`;
const mainSection = document.querySelector('.chat-section');

let chatArea = `
  <div class="chat-texts"></div>
  <div class="user-input">
    <input type="text" class="input" placeholder="Paste Angular Code here..">
    <button class="send-user-input"><i class="fa-solid fa-paper-plane send"></i></button>
  </div>`;

const textLink = document.querySelector('.text');
const loader = `
  <div class="loading">
    <span><i class="fa fa-code"></i> <span class="loading-text">Angular Sense</span></span>
  </div>`;
const mainSection = document.querySelector('.chat-section');

let chatArea = `
  <div class="chat-texts"></div>
  <div class="user-input">
    <input type="text" class="input" placeholder="Paste Angular Code here..">
    <button class="send-user-input"><i class="fa-solid fa-paper-plane send"></i></button>
  </div>`;

textLink.addEventListener('click', function() {
  // Show the loader
  mainSection.innerHTML = loader;

  // After a delay, show the chat area
  setTimeout(() => {
    mainSection.innerHTML = chatArea;
    mainSection.classList.add('chatting'); // Add styling class

    // Attach event listeners for the chat input
    const sendButton = document.querySelector('.send-user-input');
    const userInput = document.querySelector('.input');
    const chatTexts = document.querySelector('.chat-texts');

    sendButton.addEventListener('click', () => {
      const userMessage = document.createElement('div');
      const actualText = document.createElement('p'); 
      const code = document.createElement('code'); 

      // Add appropriate classes
      userMessage.classList.add('user-chat-box');
      actualText.classList.add('textchat');
      const userInputText = userInput.value.trim();

      if (userInputText !== '') {
        // Set the text and highlight
        code.textContent = userInputText;
        code.classList.add('language-javascript');
        Prism.highlightElement(code);

        // Append elements
        actualText.appendChild(code);
        userMessage.appendChild(actualText);
        chatTexts.appendChild(userMessage);

        // Clear input field
        userInput.value = '';
      }
    });
  }, 3000); // 3 seconds

  textLink.classList.add('underline');
});