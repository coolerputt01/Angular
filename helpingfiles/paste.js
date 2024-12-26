"use strict";

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import jsPDF from "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.1/accessibility.d.ts";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";


//Failed to resolve module specifier "@babel/runtime/helpers/typeof". Relative references must start with either "/", "./", or "../".



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
  return text.replace(/\*/g, '').trim();
};

const createFlowchart = (code) => {
  const flowchartDiv = document.createElement('div');
  flowchartDiv.classList.add('flowchart');
  flowchartDiv.innerHTML = `<div class="mermaid">${code}</div>`;
  mermaid.init(undefined, flowchartDiv.querySelector('.mermaid'));
  return flowchartDiv;
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
  chatTexts.appendChild(aiMessage);

  try {
    const result = await chat.sendMessageStream(userInputText);
    loader.remove();

    let fullResponse = '';
    for await (const chunk of result.stream) {
      fullResponse += chunk.text();
    }

    const sanitizedResponse = sanitizeResponse(fullResponse);
    const responseWrapper = document.createElement('div');

    const responseText = document.createElement('p');
    responseText.textContent = sanitizedResponse;
    responseWrapper.appendChild(responseText);

    // Add Copy Button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(sanitizedResponse).then(() => {
        alert('Response copied to clipboard!');
      });
    };
    responseWrapper.appendChild(copyButton);

    // Add Download Button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download as PDF';
    downloadButton.onclick = () => {
      const pdf = new jsPDF();
      pdf.text(sanitizedResponse, 10, 10);
      pdf.save('response.pdf');
    };
    responseWrapper.appendChild(downloadButton);

    // Generate Flowchart if Applicable
    if (sanitizedResponse.includes('graph')) {
      const flowchart = createFlowchart(sanitizedResponse);
      responseWrapper.appendChild(flowchart);
    }

    aiMessage.appendChild(responseWrapper);
    scrollToBottom(chatTexts);
  } catch (error) {
    loader.remove();
    aiMessage.textContent = "An error occurred. Please try again.";
    console.error(error);
  }
};

textLink.addEventListener('click', function() {
  mainSection.innerHTML = loader;

  setTimeout(() => {
    mainSection.innerHTML = chatArea;
    mainSection.classList.add('chatting');

    const sendButton = document.querySelector('.send-user-input');
    const userInput = document.querySelector('.input');
    const chatTexts = document.querySelector('.chat-texts');

    sendButton.addEventListener('click', () => {
      const userInputText = userInput.value.trim();
      if (userInputText !== '') {
        getResponse(userInputText, chatTexts);
        userInput.value = '';
      }
    });
  }, 3000);

  textLink.classList.add('underline');
});
console.log('wrks')
/*async function copyReferral() {
      const referralLink = document.location.href;
      const message = `Join for free! Earn ₦500 for each person you refer. Sign up here: ${referralLink}`;
      try {
        await navigator.clipboard.writeText(message);
        referralLinkClicked = true; // Set flag when link is clicked
      } catch (error) {
        console.error("Error copying referral link:", error);
      }
    }*/