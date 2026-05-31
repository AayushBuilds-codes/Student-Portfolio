/**
 * Nova - AI Personal Assistant Logic
 * Provides responses regarding Aayush Agarwal's biography, skills, projects, experience, and contact details.
 * Features Text-to-Speech (TTS) narration, Speech-to-Text (STT) recognition, and website control commands.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNovaWidget();
});

// Database of answers with matching keywords
const responseDatabase = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'hola', 'wassup', 'status', 'online'],
        responses: [
            "Hello! I am **Nova**, Aayush's personal AI assistant. How can I help you today? You can ask me about his ML projects, skills, education, or internship experience.",
            "Hi there! Nice to meet you. I'm **Nova**, here to answer questions about Aayush's background, skills, and projects. What would you like to know?",
            "Hey! Nova here. I'm Aayush's personal digital assistant. Feel free to ask me anything about his technical journey!"
        ]
    },
    biography: {
        keywords: ['who', 'about', 'aayush', 'agarwal', 'biography', 'bio', 'profile', 'background', 'student', 'developer', 'person', 'himself'],
        responses: [
            "Aayush Agarwal is a Computer Science student specializing in **Artificial Intelligence & Machine Learning** at GLA University, Mathura. He builds predictive models, analyzes complex datasets, and designs responsive developer interfaces. He is passionate about combination of robust data science pipelines and modern frontend designs."
        ]
    },
    skills: {
        keywords: ['skills', 'skill', 'toolkit', 'languages', 'programming', 'python', 'scikit', 'sklearn', 'pandas', 'numpy', 'libraries', 'frontend', 'html', 'css', 'javascript', 'js', 'coding', 'c', 'git', 'github', 'jupyter'],
        responses: [
            "Aayush's technical toolkit includes:<br><br>" +
            "• **AI & ML**: Python, Scikit-Learn, Pandas, NumPy, Feature Engineering, and Statistical Modeling.<br>" +
            "• **Software Engineering**: HTML5, CSS3 (Flexbox/Grid), ES6+ JavaScript, and C Programming.<br>" +
            "• **Workflows & Tools**: Git, GitHub, Jupyter Notebooks, and Data Visualization."
        ]
    },
    experience: {
        keywords: ['experience', 'internship', 'jyesta', 'corporation', 'intern', 'work', 'job', 'journey', 'milestones', 'role'],
        responses: [
            "Aayush completed a **Machine Learning Internship** at **Jyesta Corporation Limited** (Dec 2025 - Jan 2026). During this period, he developed and trained ML models using Python and Scikit-learn, performed data cleaning & feature engineering, and analyzed datasets to drive AI/ML research tasks."
        ]
    },
    projects: {
        keywords: ['projects', 'project', 'works', 'recent', 'calculator', 'weather', 'dashboard', 'pinnacle', 'showcase', 'built', 'created', 'made'],
        responses: [
            "Here are Aayush's recent projects:<br><br>" +
            "1. **[Weather Dashboard](https://aayushbuilds-codes.github.io/Weather-Dashboard/)**: A dynamic, glassmorphic interface displaying real-time weather conditions and forecasts using global weather APIs.<br>" +
            "2. **[Interactive Web Calculator](https://aayushbuilds-codes.github.io/Calculator/)**: A sleek utility supporting core arithmetic calculations, responsive grid layouts, and keyboard integrations.<br>" +
            "3. **Pinnacle Portfolio Workspace**: The website you are currently browsing! Features advanced scroll triggers, glassmorphic layout elements, and direct terminal sending animations."
        ]
    },
    contact: {
        keywords: ['contact', 'email', 'connect', 'reach', 'social', 'github', 'linkedin', 'phone', 'mail', 'location', 'kanpur', 'india', 'address'],
        responses: [
            "You can reach and connect with Aayush here:<br><br>" +
            "• **Direct Email**: [aayushagarwaltech@gmail.com](mailto:aayushagarwaltech@gmail.com)<br>" +
            "• **GitHub Profile**: [github.com/AayushBuilds-codes](https://github.com/AayushBuilds-codes)<br>" +
            "• **LinkedIn**: [linkedin.com/in/aayush-agarwal-64a461284](https://www.linkedin.com/in/aayush-agarwal-64a461284/)<br>" +
            "• **Location**: Kanpur, India 208013"
        ]
    },
    education: {
        keywords: ['education', 'degree', 'university', 'gla', 'mathura', 'college', 'school', 'resume', 'cv', 'qualification', 'qualifications'],
        responses: [
            "Aayush is pursuing his **Bachelor of Technology in Computer Science (specializing in AI & ML)** at **GLA University, Mathura** (Expected graduation 2029). He has a solid foundation in Python programming, C programming, data analysis, and predictive model architectures."
        ]
    },
    certifications: {
        keywords: ['certifications', 'certification', 'certificates', 'certificate', 'credentials', 'credential', 'hackerrank', 'rank', 'verified', 'problemsolving', 'problem solving', 'sql', 'javascript', 'python'],
        responses: [
            "Aayush has earned several verified **HackerRank Certifications**:<br><br>" +
            "• **SQL (Advanced)**: Advanced querying, analytical functions, query tuning, and database optimization.<br>" +
            "• **Problem Solving (Intermediate)**: Tested skills in algorithms, data structures (heaps, trees), and space complexity analysis.<br>" +
            "• **SQL (Intermediate & Basic)**: Multi-table joins, aggregates, and filtering query sets.<br>" +
            "• **JavaScript (Basic) & Python (Basic)**: Dynamic DOM triggers, scoping, loops, and Object-Oriented design.<br><br>" +
            "All badges are verified! You can view and click them directly in the **Certifications** section on this webpage to verify their official HackerRank credentials links."
        ]
    }
};

function initNovaWidget() {
    const launcher = document.getElementById('nova-launcher');
    const chatWindow = document.getElementById('nova-chat-window');
    const closeBtn = document.getElementById('nova-close-btn');
    const voiceBtn = document.getElementById('nova-voice-btn');
    const micBtn = document.getElementById('nova-mic-btn');
    const inputForm = document.getElementById('nova-input-form');
    const inputField = document.getElementById('nova-input-field');
    const messagesContainer = document.getElementById('nova-messages');
    const suggestionsContainer = document.getElementById('nova-suggestions');

    if (!launcher || !chatWindow || !closeBtn || !inputForm || !messagesContainer) return;

    // Speech Output Config
    let isSpeechMuted = false;
    let currentUtterance = null;
    let hasWelcomed = false;

    // Initialize voice settings
    if (voiceBtn) {
        voiceBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop launcher closing on clicks inside header
            isSpeechMuted = !isSpeechMuted;
            if (isSpeechMuted) {
                voiceBtn.classList.add('muted');
                cancelSpeech();
            } else {
                voiceBtn.classList.remove('muted');
                speak("Voice output enabled.");
            }
        });
    }

    // Speech Input (Speech-to-Text) Config
    let recognition = null;
    let isRecording = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecording = true;
            if (micBtn) micBtn.classList.add('recording');
            inputField.placeholder = "Listening... Speak now!";
            cancelSpeech(); // Stop Nova speaking if you start talking
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputField.value = transcript;
            
            // Automatically submit query
            setTimeout(() => {
                inputForm.dispatchEvent(new Event('submit'));
            }, 300);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            stopRecordingState();
        };

        recognition.onend = () => {
            stopRecordingState();
        };

        if (micBtn) {
            micBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        }
    } else {
        // Hide mic button if browser doesn't support speech recognition
        if (micBtn) micBtn.style.display = 'none';
    }

    function stopRecordingState() {
        isRecording = false;
        if (micBtn) micBtn.classList.remove('recording');
        inputField.placeholder = "Ask Nova a question...";
    }

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
        chatWindow.classList.add('open');
        launcher.style.transform = 'scale(0) translateY(20px)';
        launcher.style.opacity = '0';
        launcher.style.pointerEvents = 'none';
        
        // Focus input after opening transition
        setTimeout(() => {
            inputField.focus();
        }, 300);
        
        // Speak welcome greeting on first open (unlocks speech synthesis via click gesture)
        if (!hasWelcomed) {
            setTimeout(() => {
                speak("Hello! I am Nova, Aayush's personal AI assistant. Ask me anything about his skills, machine learning projects, internship experience, or how to contact him!");
            }, 600);
            hasWelcomed = true;
        }
    });

    closeBtn.addEventListener('click', closeChat);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
            closeChat();
        }
    });

    function closeChat() {
        chatWindow.classList.remove('open');
        launcher.style.transform = 'scale(1) translateY(0)';
        launcher.style.opacity = '1';
        launcher.style.pointerEvents = 'auto';
        cancelSpeech();
        stopRecordingState();
    }

    // Handle form submit
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = inputField.value.trim();
        if (!userText) return;

        // Append User Message
        appendMessage(userText, 'user');
        inputField.value = '';

        // Generate response with simulated thinking state
        respondAsNova(userText);
    });

    // Handle suggestion chips
    if (suggestionsContainer) {
        suggestionsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.suggestion-chip');
            if (!chip) return;
            const query = chip.textContent;
            
            appendMessage(query, 'user');
            respondAsNova(query);
        });
    }

    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `nova-message-bubble ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Parse simple links and bold elements
        if (sender === 'assistant') {
            contentDiv.innerHTML = parseSimpleMarkdown(text);
        } else {
            contentDiv.textContent = text;
        }

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.appendChild(contentDiv);
        bubble.appendChild(timeSpan);
        messagesContainer.appendChild(bubble);

        // Auto Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return bubble;
    }

    function respondAsNova(userQuery) {
        // Show Typing Indicator
        const typingBubble = document.createElement('div');
        typingBubble.className = 'nova-message-bubble assistant typing';
        typingBubble.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 1. Check for interactive site control commands first
        let responseText = checkForWebsiteCommands(userQuery);
        
        // 2. Fall back to conversational response matching if no commands triggered
        if (!responseText) {
            responseText = findBestResponse(userQuery);
        }

        // Simulated thinking delay (800ms - 1500ms)
        const delay = 800 + Math.random() * 700;
        setTimeout(() => {
            // Remove typing bubble
            typingBubble.remove();
            appendMessage(responseText, 'assistant');
            
            // Narrate message aloud
            speak(responseText);
        }, delay);
    }

    function checkForWebsiteCommands(query) {
        const clean = query.toLowerCase().trim();
        
        // Command: Toggle dark/light theme
        if (clean.includes('theme') || clean.includes('dark mode') || clean.includes('light mode') || clean.includes('toggle mode')) {
            const themeBtn = document.querySelector('.theme-toggle-btn');
            if (themeBtn) {
                themeBtn.click();
                return "Sure, toggling the website theme display mode!";
            }
        }
        
        // Command: Smooth scroll viewport navigation
        if (clean.includes('scroll') || clean.includes('go to') || clean.includes('navigate to') || clean.includes('show section') || clean.includes('show about') || clean.includes('show skill') || clean.includes('show contact') || clean.includes('show work') || clean.includes('show journey') || clean.includes('show credentials') || clean.includes('show certifications') || clean.includes('show achievements')) {
            if (clean.includes('contact')) {
                scrollToElement('contact');
                return "Scrolling to the Connect with Me section.";
            }
            if (clean.includes('about') || clean.includes('biography') || clean.includes('bio')) {
                scrollToElement('about');
                return "Navigating to the Biography and About Me section.";
            }
            if (clean.includes('skills') || clean.includes('skill') || clean.includes('toolkit')) {
                scrollToElement('skills');
                return "Moving down to the Skills and Toolkit category.";
            }
            if (clean.includes('certifications') || clean.includes('certificate') || clean.includes('credentials') || clean.includes('achievements') || clean.includes('hackerrank')) {
                scrollToElement('certifications');
                return "Scrolling to the Verified Certifications and Achievements section.";
            }
            if (clean.includes('journey') || clean.includes('experience') || clean.includes('timeline')) {
                scrollToElement('journey');
                return "Scrolling to the Journey Timeline.";
            }
            if (clean.includes('work') || clean.includes('project') || clean.includes('recent')) {
                scrollToElement('work');
                return "Opening Aayush's Recent Works projects filter.";
            }
            if (clean.includes('home') || clean.includes('hero') || clean.includes('top')) {
                scrollToElement('home');
                return "Scrolling back to the top of the homepage.";
            }
        }
        
        // Command: Launch Project Specs Modals
        if (clean.includes('open') || clean.includes('show details') || clean.includes('show project') || clean.includes('view project') || clean.includes('view spec') || clean.includes('open modal')) {
            if (clean.includes('weather') || clean.includes('forecast')) {
                if (typeof openProjectModal === 'function') {
                    openProjectModal('weather-dashboard');
                    return "Opening the specs sheet for the Weather Dashboard.";
                }
            }
            if (clean.includes('calculator') || clean.includes('math')) {
                if (typeof openProjectModal === 'function') {
                    openProjectModal('calculator');
                    return "Opening the detail specs sheet for the Interactive Web Calculator.";
                }
            }
            if (clean.includes('portfolio') || clean.includes('pinnacle')) {
                if (typeof openProjectModal === 'function') {
                    openProjectModal('pinnacle-portfolio');
                    return "Opening the specs layout for the Pinnacle Portfolio Workspace.";
                }
            }
        }
        
        // Command: Close active overlays / project modals
        if (clean.includes('close') && (clean.includes('modal') || clean.includes('popup') || clean.includes('project') || clean.includes('details'))) {
            if (typeof closeModal === 'function') {
                closeModal();
                return "Closing the details modal window.";
            }
        }
        
        return null;
    }

    function scrollToElement(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function findBestResponse(userMessage) {
        const cleanMsg = userMessage.toLowerCase().replace(/[^\w\s]/g, ' ');
        const tokens = cleanMsg.split(/\s+/).filter(t => t.length > 0);
        
        if (tokens.length === 0) {
            return "I am listening! What would you like to ask about Aayush?";
        }

        let bestCategory = null;
        let highestScore = 0;
        
        for (const [category, data] of Object.entries(responseDatabase)) {
            let score = 0;
            tokens.forEach(token => {
                // Exact matches
                if (data.keywords.includes(token)) {
                    score += 1.5;
                }
                
                // Partial keyword matches
                data.keywords.forEach(keyword => {
                    if (keyword.length > 3) {
                        if (token.includes(keyword) || keyword.includes(token)) {
                            score += 0.5;
                        }
                    }
                });
            });
            
            if (score > highestScore) {
                highestScore = score;
                bestCategory = category;
            }
        }
        
        // Threshold check for category matchmaking
        if (highestScore >= 1 && bestCategory) {
            const categoryResponses = responseDatabase[bestCategory].responses;
            const randomIndex = Math.floor(Math.random() * categoryResponses.length);
            return categoryResponses[randomIndex];
        }
        
        return "I am Nova, Aayush's dedicated personal assistant. I can only answer questions related to his biography, ML projects, skills, certifications, internship, or how to contact him. Feel free to use one of the quick suggestions below!";
    }

    function parseSimpleMarkdown(text) {
        // Convert [text](url) to anchor tags
        let parsed = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Convert **text** to bold tags
        parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        return parsed;
    }

    /* Web Speech Synthesis */
    function speak(text) {
        if (isSpeechMuted) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Terminate existing voices

            // Sanitize text formatting for natural TTS pronunciation
            let cleanText = text.replace(/<[^>]*>/g, ''); // Strip html
            cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Parse brackets
            cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1'); // Parse bold
            cleanText = cleanText.replace(/•/g, '-'); // Replace bullets

            currentUtterance = new SpeechSynthesisUtterance(cleanText);
            currentUtterance.rate = 1.0;
            currentUtterance.pitch = 1.0;

            // Load speech voices
            const voices = window.speechSynthesis.getVoices();
            // Match standard English narrator voice
            const voice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
            if (voice) {
                currentUtterance.voice = voice;
            }

            window.speechSynthesis.speak(currentUtterance);
        }
    }

    function cancelSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}
