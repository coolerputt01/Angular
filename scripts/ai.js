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
  aiTools.innerHTML = `
    <i class="copy fa-regular fa-copy"></i> 
    <i class="fa-solid fa-download"></i> 
    <i class="fa-solid fa-chart-pie"></i>`;
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
      const codeContent = codeBlockMatch[1].split('\n').slice(1).join('\n');
      const code = document.createElement('code');
      code.className = `language-javascript`;
      code.textContent = codeContent;
      aiMessage.appendChild(code);
      Prism.highlightElement(code);

      chatTexts.addEventListener('click', async function(event) {
  const aiMessage = event.target.closest('.ai-chat-box'); // Find the nearest .ai-chat-box

  if (!aiMessage) return; // Ensure the event target is within an ai-chat-box

  // Copy text to clipboard
  if (event.target.classList.contains('copy')) {
    try {
      const textContent = aiMessage.innerText.trim(); // Get the full text of the AI message
      await navigator.clipboard.writeText(textContent);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  // Download as PDF
  else if (event.target.classList.contains('fa-download')) {
    try {
      const textContent = aiMessage.innerText.trim();
      if (textContent) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text(textContent, 10, 10);
        pdf.save('ai-response.pdf');
      } else {
        console.error("Unable to get text content for PDF.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }

  // Generate chart or flowchart
  else if (event.target.classList.contains('fa-chart-pie')) {
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '600px';
    chartContainer.style.height = '400px';
    chartContainer.classList.add('chart-container');
    aiMessage.appendChild(chartContainer); // Append the chart container to the AI message

    const responseText = aiMessage.innerText.trim();
    const isFlowchart = responseText.startsWith('flowchart'); // Check if response is a flowchart (Mermaid.js syntax).

    if (isFlowchart) {
      // Render Mermaid flowchart
      mermaid.initialize({ startOnLoad: false });
      chartContainer.innerHTML = `<div class="mermaid">${responseText}</div>`;
      mermaid.init(undefined, chartContainer.querySelector('.mermaid'));
    } else {
      // Render graph with Chart.js
      const ctx = document.createElement('canvas');
      chartContainer.appendChild(ctx);

      // Example: Bar chart data
      const chartData = {
        labels: ['Label1', 'Label2', 'Label3'],
        datasets: [{
          label: 'Example Dataset',
          data: [10, 20, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      };

      new Chart(ctx, {
        type: 'bar', // 'bar', 'line', 'pie', etc.
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  }
});
      scrollToBottom(chatTexts);
    }
  } catch (error) {
    loader.remove();
    aiMessage.textContent = "An error occurred. Please try again.";
    console.error(error);
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
