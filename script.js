document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatBody = document.getElementById("chatBody");

    const loginModal = document.getElementById("loginModal");
    const openLogin = document.getElementById("openLogin");
    const closeLogin = document.getElementById("closeLogin");

    const micBtn = document.createElement("button");
    micBtn.className = "icon-btn";
    micBtn.innerHTML = "🎤";
    input.parentElement.insertBefore(micBtn, input);

    const fileBtn = document.getElementById("fileBtn");
    const urlBtn = document.getElementById("urlBtn");
    const docBtn = document.getElementById("docBtn");
    const imgBtn = document.getElementById("imgBtn");

    let loggedOut = false;
    let userName = "";

    // LOGIN MODAL
    openLogin.onclick = () => { if (!loggedOut) loginModal.style.display = "flex"; }
    closeLogin.onclick = () => { loginModal.style.display = "none";
        loggedOut = true; }
    input.onfocus = () => { if (!loggedOut) loginModal.style.display = "flex"; }

    // SEND MESSAGE
    sendBtn.onclick = () => sendMessage();
    input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

    // MICROPHONE
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        micBtn.onclick = () => {
            micBtn.innerHTML = "🎙️ Listening...";
            recognition.start();
        };

        recognition.onresult = e => {
            const spokenText = e.results[0][0].transcript;
            micBtn.innerHTML = "🎤";
            sendMessage(spokenText);
        };

        recognition.onspeechend = () => { recognition.stop();
            micBtn.innerHTML = "🎤"; };
        recognition.onerror = e => { micBtn.innerHTML = "🎤";
            alert("Microphone error: " + e.error); };

    } else { micBtn.disabled = true;
        micBtn.title = "Your browser does not support microphone input."; }

    // ICONS CLICK EVENTS
    fileBtn.onclick = () => openFilePicker("📎", "*/*");
    imgBtn.onclick = () => openFilePicker("🖼️", "image/*");
    docBtn.onclick = () => openFilePicker("📘", ".pdf,.doc,.docx,.txt");
    urlBtn.onclick = () => {
        const url = prompt("Enter URL to open:");
        if (url) window.open(url, "_blank");
    };

    function openFilePicker(icon, accept) {
        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.accept = accept;
        inputFile.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                chatBody.innerHTML += `<div class="bot-msg"><span>${icon} You selected: ${file.name}</span></div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        };
        inputFile.click();
    }

    // SEND MESSAGE FUNCTION
    function sendMessage(textInput = null) {
        const text = textInput ? textInput : input.value.trim();
        if (!text) return;
        if (!textInput) input.value = "";

        chatBody.innerHTML += `<div class="user-msg"><span>${text}</span></div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        chatBody.innerHTML += `<div class="bot-msg"><span>⏳ Thinking...</span></div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
            const reply = botReply(text);
            chatBody.lastElementChild.innerHTML = `<span>🤖 ${reply}</span>`;
            chatBody.scrollTop = chatBody.scrollHeight;

            const synth = window.speechSynthesis;
            synth.speak(new SpeechSynthesisUtterance(reply));
        }, 400);
    }

    // BOT REPLIES
    function botReply(userText) {
        const text = userText.toLowerCase();

        // NAME
        if (text.includes("my name is") || text.startsWith("i am ") || text.includes("call me")) {
            const words = userText.split(" ");
            userName = words[words.length - 1];
            return `Ohhh, nice name ${userName} 😊`;
        }

        if (text.includes("am pushpa natekar"))
            return `Nice to meet you, ${userName}! How can I help you today?`;

        // GREETINGS
        if (text.includes("hello")) return "Hello! 👋";
        if (text.includes("how are you")) return "I'm doing great 😄";
        if (text.includes("good morning")) return "Good morning ☀️ Have a nice day!";
        if (text.includes("thank you")) return "You're welcome 😊";
        if (text.includes("bye")) return "Goodbye! 👋";

        // TECH & CODING
        if (text.includes("what is ai")) return "AI allows machines to learn, think, and solve problems.Machines learn from data and recognize patterns.AI powers chatbots, voice assistants, and self-driving cars.Narrow AI handles one task; General AI handles all tasks (theoretical).Machine learning is a core subset of AI.Neural networks simulate human brain processes. AI helps automate repetitive tasks.Used in healthcare, finance, education, and more.Improves decision-making and efficiency. ";
        if (text.includes(" what is cloud computing")) return "Cloud computing provides servers, storage, databases, and software over the internet.Cloud computing is a way to use computing resources like servers, storage, databases, and software over the internet instead of relying on your own computer or local hardware. It allows you to access your data and applications from anywhere in the world as long as you have an internet connection.";
        if (text.includes("what is html")) return "HTML is the standard language used to structure content on web pages. It defines the layout of a website by creating elements such as headings, paragraphs, links, images, forms, and tables. Web browsers read HTML to display content in a structured way.";
        if (text.includes("what is css")) return "CSS is used to style and design web pages. It controls colors, fonts, spacing, layouts, and even animations. CSS separates the design of a website from its content, which is handled by HTML. It allows developers to create responsive websites that look good on desktops, tablets, and mobile devices. CSS frameworks like Bootstrap and Tailwind make designing easier.";
        if (text.includes("what is javascript")) return "JavaScript is a programming language that adds logic, interactivity, and dynamic behavior to websites. It works with HTML and CSS to create features like sliders, popups, forms, animations, and real-time updates. JavaScript runs in the browser and can also run on servers using Node.js. Frontend frameworks like React, Angular, and Vue rely heavily on JavaScript.";
        if (text.includes("what is frontend")) return "Frontend refers to the part of a website or application that users see and interact with directly. It includes layouts, text, buttons, images, forms, and navigation menus. Frontend developers use HTML for structure, CSS for styling, and JavaScript for interactivity. Frameworks like React, Angular, and Vue help build complex interfaces efficiently.";
        if (text.includes("what is backend")) return "Backend is the part of a website or application that works behind the scenes. It handles server logic, database management, user authentication, and communication with the frontend via APIs. Backend developers use languages like Node.js, Python, Java, or PHP and frameworks like Express, Django, or Spring to manage the server side of applications.";
        if (text.includes("full stack")) return "Full stack development combines both frontend and backend skills. A full stack developer can build an entire web application from start to finish. The frontend includes HTML, CSS, and JavaScript for the user interface, while the backend handles the server, databases, and business logic. Full stack developers also use APIs to connect frontend and backend.";
        if (text.includes("what is networking")) return "Networking refers to the practice of connecting devices together to share resources and communicate. It involves setting up hardware like routers, switches, and cables, as well as configuring software protocols like TCP/IP. Networking allows devices to share files, printers, and internet connections, and enables communication over local and wide area networks.";
    if (text.includes("what is power")) return "Power is the rate at which energy is transferred or converted. In computing, power refers to the amount of energy consumed by a device or system. Power management techniques are used to reduce energy consumption and prolong battery life in mobile devices.";
    if (text.includes("what is node")) return "Node.js is a JavaScript runtime environment that allows developers to run JavaScript on the server-side. It provides a way to build scalable and high-performance server-side applications using JavaScript.";
    if (text.includes("what is java")) return "Java is a high-level, object-oriented programming language used for developing a wide range of applications, including Android apps, web applications, and enterprise software.";
    if (text.includes("what is python")) return "Python is a high-level, interpreted programming language used for developing a wide range of applications, including web development, data analysis, and artificial intelligence.";
    if (text.includes("what is coding")) return "Coding, also known as programming, is the process of designing, writing, testing, debugging, and maintaining the source code of computer programs.";
    if (text.includes("what is react")) return "React is a JavaScript library used for building user interfaces and single-page applications. It allows developers to create reusable UI components and manage state changes efficiently.";
    if (text.includes("what is knowledge")) return "Knowledge is the information, facts, or skills acquired through experience or learning.";
        if (text.includes("what is software system")) return "A software system is a collection of programs, data, and procedures that perform specific tasks in computing.";
    if (text.includes("what is operating system")) return "An operating system is a software that manages computer hardware and software resources, providing a platform for running applications.";
    if (text.includes("what is database")) return "A database is a collection of organized data stored in a way that allows for efficient retrieval and manipulation.";
    if (text.includes("what is api")) return "An API (Application Programming Interface) is a set of rules and protocols for building software and applications, enabling different systems to communicate with each other.";
    if (text.includes("what is encryption")) return "Encryption is the process of converting plaintext data into unreadable ciphertext to protect it from unauthorized access.";
    if (text.includes("what is cybersecurity")) return "Cybersecurity refers to the practices and technologies designed to protect computer systems, networks, and data from unauthorized access, use, disclosure, disruption, modification, or destruction.";
    if (text.includes("what is machine learning")) return "Machine learning is a subset of AI that involves training algorithms to learn from data and make predictions or decisions without being explicitly programmed.";
    if (text.includes("what is data science")) return "Data science is a field that combines statistics, computer science, and domain expertise to extract insights and knowledge from data.";
    if (text.includes("what is blockchain")) return "Blockchain is a decentralized, distributed ledger technology that records transactions across a network of computers, providing a secure and transparent way to track assets and data.";
    if (text.includes("what is internet of things")) return "The Internet of Things (IoT) refers to the network of physical devices, vehicles, home appliances, and other items embedded with sensors, software, and connectivity, allowing them to collect and exchange data.";
    if (text.includes("what is artificial intelligence")) return "Artificial intelligence is the development of computer systems that can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.";
    if (text.includes("what is robotics")) return "Robotics is the design, construction, and operation of robots, which are machines that can perform tasks autonomously or with human guidance.";
    if (text.includes("what is computer vision")) return "Computer vision is a field of AI that enables computers to interpret and understand visual information from images and videos.";
    if (text.includes("what is natural language processing")) return "Natural language processing is a field of AI that deals with the interaction between computers and humans in natural language, enabling computers to understand, interpret, and generate human language.";

        // EDUCATION
        if (text.includes("am student")) return "That's great 😊 What course are you studying?";
        if (text.includes("bca")) return "BCA is an excellent choice 💻🔥";

        // GENERAL KNOWLEDGE
        if (text.includes("capital of india")) return "The capital of India is New Delhi 🇮🇳";
        if (text.includes("capital of usa")) return "The capital of the USA is Washington, D.C. 🇺🇸";

        // CALCULATOR
        const mathPattern = /^\s*(-?\d+)\s*([\+\-\*x])\s*(-?\d+)\s*$/;
        const match = userText.match(mathPattern);
        if (match) {
            const num1 = parseFloat(match[1]);
            const operator = match[2];
            const num2 = parseFloat(match[3]);
            let result;
            if (operator === "+") result = num1 + num2;
            else if (operator === "-") result = num1 - num2;
            else if (operator === "*" || operator === "x") result = num1 * num2;
            return `✅ Answer: ${result}`;
        }

        return "I received: " + userText;
    }

});