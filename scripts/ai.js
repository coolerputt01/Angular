"use strict";

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
const textLink = document.querySelector('.text');
const loader = `
  <div class="loading">
    <span><i class="fa fa-code"></i> <span class="loading-text">Angular Sense</span></span>
  </div>`;
const mainSection = document.querySelector('.chat-section');

let chatArea = `
  <div class="chat-texts"></div>
  <div class="user-input">
    <input type="text" class="input" placeholder="Paste your Angular Code...">
    <button class="send-user-input"><i class="fa-solid fa-paper-plane send"></i></button>
  </div>`;

const API_KEY = "AIzaSyDe1kJvfPWhDdpc3EC927PYnDt9FGzXKzw";
const genAI = new GoogleGenerativeAI(API_KEY);
const scrollToBottom = (element) => {
  element.scrollTop = element.scrollHeight;
};
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `{
    "system_instructions": "You are an Angular Code Documentation Assistant powered by a website named Angular Sense. Your role is to analyze Angular projects and provide structured documentation. This includes: 1) Parsing Angular components, services, directives, and modules. 2) Generating detailed documentation in JSON or Markdown formats. 3) Creating flowcharts and dependency graphs for better visualization. 4) Answering user queries about the project's structure, functionality, and dependencies. Always provide accurate, developer-focused information in a clear and concise manner."
  }`
});
const chat = model.startChat();

const sanitizeResponse = (text) => {
  // Remove Markdown-style formatting (e.g., asterisks)
  return text.replace(/\*/g, '').trim();
};

const getResponse = async (userInputText, chatTexts) => {
  const userMessage = document.createElement('div');
  userMessage.classList.add('user-chat-box');
  userMessage.textContent = userInputText;
  chatTexts.appendChild(userMessage);

  const aiMessage = document.createElement('div');
  aiMessage.classList.add('ai-chat-box');
  const loader = document.createElement('div');
  loader.classList.add('loader');
  aiMessage.appendChild(loader);
  const aiTools = document.createElement('div');
  aiTools.classList.add('ai-tools');
  aiTools.innerHTML = '<i class="copy fa-regular fa-copy"></i> <i class="fa-solid fa-download"></i> <i class="fa-solid fa-chart-pie"></i>'
  //aiTools.classList.add('ai-tools');
  chatTexts.appendChild(aiMessage);
  chatTexts.append(aiTools);
  scrollToBottom(chatTexts);
  try {
    const result = await chat.sendMessageStream(userInputText);
    loader.remove();

    let fullResponse = '';
    for await (const chunk of result.stream) {
      fullResponse += chunk.text();
    }

    const sanitizedResponse = sanitizeResponse(fullResponse);
    const codeBlockMatch = sanitizedResponse.match(/```(.*?)```/s);

    if (codeBlockMatch) {
      const codeLanguage = codeBlockMatch[1].split('\n')[0];
      const codeContent = codeBlockMatch[1].split('\n').slice(1).join('\n');

      const code = document.createElement('code');
      code.className = `language-javascript`;
      code.textContent = codeContent;
      aiMessage.appendChild(code);
      Prism.highlightElement(code);
      userMessage.style.setProperty('--opacity','0');
      // Attach the event listener to the parent container for dynamic content
chatTexts.addEventListener('click', async function(event) {
  if (event.target.classList.contains('copy')) {
    const codeBlock = aiMessage.querySelector('code');
    const textToCopy = codeBlock ? codeBlock.textContent : sanitizedResponse;

    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }
});
    } else {
      const aiResponse = document.createElement('p');
      aiResponse.textContent = sanitizedResponse;
      document.querySelector('.copy').addEventListener('click',async function(){
        try{
          await navigator.clipboard.writeText(aiResponse.textContent);
          console.log("copied");
        }catch(error){
          console.error(error,error.message,error.status);
        }
      });
      aiMessage.appendChild(aiResponse);
      
      scrollToBottom(chatTexts);
      userMessage.style.setProperty('--opacity','0');
    }
  } catch (error) {
    loader.remove();
    aiMessage.textContent = "An error occurred. Please try again.";
    console.error(error,error.message,error.status);
  }
};

textLink.addEventListener('click', function() {
  // Show the loader first
  mainSection.innerHTML = loader;

  // After a short delay, replace the loader with the chat area
  setTimeout(() => {
    mainSection.innerHTML = chatArea;
    mainSection.classList.add('chatting'); // Add chatting class

    // Attach event listener after the chat area is added to the DOM
    const sendButton = document.querySelector('.send-user-input');
    const userInput = document.querySelector('.input');
    const chatTexts = document.querySelector('.chat-texts');
    
    sendButton.addEventListener('click', () => {
      const userInputText = userInput.value.trim();
      if (userInputText !== '') {
        getResponse(userInputText, chatTexts);
        userInput.value = ''; // Clear the input
      }
    });
  }, 3000); // 3000 milliseconds (3 seconds)

  textLink.classList.add('underline');
});
const icons = document.querySelectorAll('.icn');
icons.forEach((icon) => {
  icon.addEventListener('click',()=>{
    icons.forEach((icn) => {
      icn.classList.remove('ico');
    });
    icon.classList.add('ico');
  });
});
