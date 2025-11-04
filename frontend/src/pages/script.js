    document.addEventListener('DOMContentLoaded', () => {
        const roleSelect = document.getElementById('role-select');
        const startInterviewBtn = document.getElementById('start-interview');
        const interviewSection = document.getElementById('interview-section');
        const chatMessages = document.getElementById('chat-messages');
        const startVoiceBtn = document.getElementById('start-voice');
        const stopVoiceBtn = document.getElementById('stop-voice');
        const voiceStatus = document.getElementById('voice-status');
        const aiSpeaking = document.getElementById('ai-speaking');
        const userStreamVideo = document.getElementById('user-stream');
        const userResponseInput = document.getElementById('user-response');
        const sendResponseBtn = document.getElementById('send-response');
        const currentRoundSpan = document.getElementById('current-round');
        const timerDisplay = document.getElementById('timer-display');
        const navToCollectionBtn = document.getElementById('nav-to-collection');
        const backToMainBtn = document.getElementById('back-to-main');

    let currentRole = '';
    let currentRound = 0;
    const rounds = ['Introduction', 'Technical', 'Behavioral', 'Closing'];
    let questions = [];
    let questionIndex = 0;
    let userResponses = []; // Track user responses for feedback
    let recognition;
    let synth = window.speechSynthesis;
    let userStream;
    let currentTranscript = '';
    let voices = [];
    let cameraActive = false; // Track if camera was actually used during interview
    let interviewStartTime = null;
    let interviewTimer = null; // Timer for the interview
    let timeRemaining = 30 * 60; // 30 minutes in seconds

    // Load voices when available
    if (synth) {
        voices = synth.getVoices();
        synth.onvoiceschanged = () => {
            voices = synth.getVoices();
        };
    }

    // Questions database based on role with reference answers
    const questionsDB = {
        'software-engineer': {
            'Introduction': [
                {
                    question: "Can you tell me a little about yourself?",
                    referenceAnswer: "I am a passionate software engineer with 3+ years of experience in full-stack development. I hold a Bachelor's degree in Computer Science and have worked on projects involving React, Node.js, and cloud technologies. I'm particularly interested in scalable systems and enjoy solving complex problems through clean, efficient code."
                },
                {
                    question: "Why are you interested in this software engineering position?",
                    referenceAnswer: "I'm excited about this role because it aligns perfectly with my passion for building scalable applications. Your company's innovative approach to [specific technology/company focus] resonates with my experience in [relevant experience]. I'm eager to contribute to projects that impact users at scale while learning from your talented team."
                },
                {
                    question: "What programming languages are you most proficient in?",
                    referenceAnswer: "I'm most proficient in JavaScript and Python. In JavaScript, I have extensive experience with React, Node.js, and modern ES6+ features. In Python, I work with Django, Flask, and data science libraries like Pandas and NumPy. I also have solid experience with Java for enterprise applications and SQL for database management."
                },
                {
                    question: "Describe a project you're particularly proud of.",
                    referenceAnswer: "I'm particularly proud of developing a real-time collaboration platform that serves 10,000+ daily active users. I led the backend architecture using Node.js and WebSockets, implemented real-time document editing, and optimized performance to handle concurrent users. The project reduced team communication overhead by 40% and received excellent user feedback for its intuitive interface."
                }
            ],
            'Technical': [
                {
                    question: "Can you explain the difference between synchronous and asynchronous programming?",
                    referenceAnswer: "Synchronous programming executes code sequentially, blocking further execution until each operation completes. Asynchronous programming allows multiple operations to run concurrently without blocking, using callbacks, promises, or async/await. For example, in JavaScript, async operations like API calls use promises to prevent UI freezing, improving user experience in web applications."
                },
                {
                    question: "How would you optimize a slow database query?",
                    referenceAnswer: "First, I'd analyze the query execution plan to identify bottlenecks. Common optimizations include: adding appropriate indexes on frequently queried columns, rewriting queries to avoid full table scans, using EXPLAIN to understand query performance, implementing query result caching, and considering database normalization. I'd also monitor slow query logs and use tools like database profilers to measure improvements."
                },
                {
                    question: "Describe your experience with version control systems like Git.",
                    referenceAnswer: "I have extensive experience with Git for version control. I use branching strategies like Git Flow, regularly commit with descriptive messages, and handle merge conflicts effectively. I'm proficient with commands like git rebase, git cherry-pick, and git bisect for debugging. In team environments, I ensure proper code reviews through pull requests and maintain clean commit histories."
                },
                {
                    question: "What is the difference between REST and GraphQL APIs?",
                    referenceAnswer: "REST APIs follow a resource-based architecture with fixed endpoints and HTTP methods (GET, POST, PUT, DELETE). GraphQL uses a single endpoint with a query language that allows clients to request exactly the data they need, reducing over/under-fetching. REST is simpler for caching and has better tooling support, while GraphQL offers more flexibility and efficiency for complex data requirements."
                },
                {
                    question: "How do you approach debugging a complex issue?",
                    referenceAnswer: "I follow a systematic approach: first reproduce the issue consistently, then isolate the problem through logging and breakpoints. I check recent changes, review error messages, and use debugging tools. I break down complex issues into smaller components, test hypotheses systematically, and document findings. After resolution, I add tests to prevent regression and document the solution for future reference."
                },
                {
                    question: "Explain the concept of object-oriented programming.",
                    referenceAnswer: "Object-oriented programming organizes code around objects that combine data and behavior. Key concepts include encapsulation (hiding internal state), inheritance (creating hierarchies of classes), polymorphism (objects responding differently to same method), and abstraction (focusing on essential features). In practice, I design classes with single responsibilities, use inheritance judiciously, and leverage polymorphism for flexible, maintainable code."
                }
            ],
            'Behavioral': [
                {
                    question: "Tell me about a time when you faced a challenging bug and how you resolved it.",
                    referenceAnswer: "In my previous role, I encountered a critical bug causing data corruption in production. I systematically debugged by reproducing the issue locally, adding logging to trace the problem, and using debugging tools. After identifying the root cause in a race condition, I implemented a fix with proper synchronization and added comprehensive unit tests. The resolution prevented future occurrences and improved system reliability."
                },
                {
                    question: "How do you handle tight deadlines and high-pressure situations?",
                    referenceAnswer: "I thrive under pressure by maintaining clear priorities and effective communication. I break down tasks into manageable chunks, set realistic milestones, and regularly update stakeholders. For tight deadlines, I focus on the most critical features first (MVP approach), leverage automation tools, and collaborate closely with the team. I also ensure work-life balance by taking short breaks to maintain productivity and avoid burnout."
                },
                {
                    question: "Describe a situation where you had to learn a new technology quickly.",
                    referenceAnswer: "When our project required React Native for mobile development, I had only basic React knowledge. I dedicated time outside work hours to complete official documentation and tutorials, built small prototype apps, and joined relevant online communities. Within two weeks, I contributed to the mobile app development, and within a month, I led the mobile development efforts, delivering the app on time."
                },
                {
                    question: "How do you collaborate with team members on code reviews?",
                    referenceAnswer: "I approach code reviews constructively, focusing on code quality and learning opportunities. I provide specific, actionable feedback with explanations, suggest improvements rather than just pointing out issues, and acknowledge good practices. I respond promptly to review comments, explain my reasoning when needed, and view reviews as collaborative learning experiences that improve code quality for everyone."
                },
                {
                    question: "Tell me about a time when you received constructive criticism.",
                    referenceAnswer: "During a project review, my team lead pointed out that my code lacked sufficient error handling. Initially defensive, I took time to reflect and researched best practices for error handling in our tech stack. I implemented comprehensive error handling across the codebase, which improved application stability. This experience taught me to view feedback as an opportunity for growth rather than criticism."
                },
                {
                    question: "How do you prioritize tasks when working on multiple projects?",
                    referenceAnswer: "I use a combination of Eisenhower Matrix and MoSCoW method to prioritize tasks. I assess urgency and importance, considering deadlines, dependencies, and business impact. I break large tasks into smaller, actionable items and use tools like Jira or Trello for tracking. Regular communication with stakeholders ensures alignment, and I maintain focus by limiting work-in-progress to avoid context switching."
                }
            ],
            'Closing': [
                {
                    question: "Do you have any questions for us?",
                    referenceAnswer: "Yes, I have a few questions. Could you tell me about the current tech stack and any planned technology migrations? What does success look like for this role in the first 6-12 months? How does the team approach code reviews and knowledge sharing? What are the biggest challenges the team is currently facing?"
                },
                {
                    question: "What are your salary expectations?",
                    referenceAnswer: "Based on my research and experience level, I'm targeting a salary range of $X-$Y for this role. However, I'm more interested in the total compensation package including benefits, growth opportunities, and work culture. I'm open to discussing this further once we understand mutual fit better."
                },
                {
                    question: "When would you be available to start?",
                    referenceAnswer: "I can provide two weeks' notice to my current employer, so I would be available to start approximately two weeks after receiving an offer. However, I'm flexible and could potentially start sooner if needed for urgent projects."
                },
                {
                    question: "How do you stay updated with technology trends?",
                    referenceAnswer: "I stay updated through multiple channels: following tech blogs and newsletters, participating in online communities like Stack Overflow and Reddit, attending conferences and meetups, contributing to open-source projects, and dedicating time for personal projects with new technologies. I also follow industry leaders on social media and regularly read research papers in areas relevant to my work."
                }
            ]
        },
        'data-scientist': {
            'Introduction': [
                "Can you walk me through your background in data science?",
                "What drew you to data science as a career?",
                "What tools and programming languages do you use most often?",
                "Describe your experience with machine learning projects."
            ],
            'Technical': [
                "How would you handle missing data in a dataset?",
                "Explain the bias-variance tradeoff in machine learning.",
                "What statistical methods do you use for hypothesis testing?",
                "How do you evaluate the performance of a machine learning model?",
                "What is the difference between supervised and unsupervised learning?",
                "How would you deal with imbalanced datasets?"
            ],
            'Behavioral': [
                "Describe a project where you had to present complex data insights to non-technical stakeholders.",
                "How do you stay updated with the latest developments in data science?",
                "Tell me about a time when your analysis led to a significant business decision.",
                "How do you handle conflicting priorities between accuracy and model interpretability?",
                "Describe a time when you had to explain a technical concept to a non-technical audience.",
                "How do you approach continuous learning in a rapidly evolving field?"
            ],
            'Closing': [
                "What are your thoughts on our company's data initiatives?",
                "Do you have any questions about the role or team?",
                "What are your salary expectations for this position?",
                "How do you ensure data privacy and ethical considerations in your work?"
            ]
        },
        'product-manager': {
            'Introduction': [
                "Can you tell me about your product management experience?",
                "What excites you about product management?",
                "What methodologies do you follow (Agile, Scrum, etc.)?",
                "Describe your approach to user research and customer discovery."
            ],
            'Technical': [
                "How do you prioritize features in a product roadmap?",
                "Describe your experience with A/B testing.",
                "How do you measure product success?",
                "What metrics do you use to track product performance?",
                "How do you balance technical feasibility with business value?",
                "Explain your experience with product analytics tools."
            ],
            'Behavioral': [
                "Tell me about a time when you had to make a difficult product decision.",
                "How do you handle conflicting priorities from different stakeholders?",
                "Describe a successful product launch you've been involved in.",
                "How do you gather and incorporate user feedback into product decisions?",
                "Tell me about a time when you had to pivot a product strategy.",
                "How do you foster collaboration between engineering, design, and business teams?"
            ],
            'Closing': [
                "What questions do you have about our product strategy?",
                "How do you see yourself contributing to our team?",
                "What are your salary expectations?",
                "How do you stay updated with product management trends?"
            ]
        },
        'marketing-specialist': {
            'Introduction': [
                "Can you share your background in marketing?",
                "Why are you interested in this marketing role?",
                "What marketing channels are you most experienced with?",
                "Describe a successful marketing campaign you've led."
            ],
            'Technical': [
                "How do you measure the success of a marketing campaign?",
                "Describe your experience with digital marketing tools and platforms.",
                "How would you optimize a website for better conversion rates?",
                "What SEO strategies do you employ?",
                "How do you use social media analytics to improve campaigns?",
                "Explain your experience with content marketing."
            ],
            'Behavioral': [
                "Tell me about a marketing campaign that didn't go as planned and what you learned.",
                "How do you stay creative and generate new ideas?",
                "Describe a time when you had to work with a difficult team member.",
                "How do you handle tight deadlines for campaign launches?",
                "Tell me about a time when you had to adapt to changing market conditions.",
                "How do you collaborate with other departments like sales and product?"
            ],
            'Closing': [
                "What are your thoughts on our current marketing efforts?",
                "Do you have any questions about the role?",
                "What are your salary expectations?",
                "How do you measure ROI on marketing investments?"
            ]
        },
        'hr-manager': {
            'Introduction': [
                "Can you tell me about your HR experience?",
                "What aspects of HR management interest you most?",
                "What HR certifications do you hold?",
                "Describe your approach to employee engagement."
            ],
            'Technical': [
                "How do you ensure compliance with labor laws and regulations?",
                "Describe your experience with HRIS systems.",
                "How do you conduct effective performance reviews?",
                "What strategies do you use for talent acquisition?",
                "How do you handle employee relations issues?",
                "Explain your experience with compensation and benefits administration."
            ],
            'Behavioral': [
                "Tell me about a time when you had to handle a sensitive employee issue.",
                "How do you promote diversity and inclusion in the workplace?",
                "Describe a successful recruitment strategy you've implemented.",
                "How do you handle difficult conversations with employees?",
                "Tell me about a time when you had to manage organizational change.",
                "How do you balance employee advocacy with business needs?"
            ],
            'Closing': [
                "What questions do you have about our company culture?",
                "How do you see yourself fitting into our HR team?",
                "What are your salary expectations?",
                "How do you measure the effectiveness of HR initiatives?"
            ]
        }
    };

    startInterviewBtn.addEventListener('click', async () => {
        currentRole = roleSelect.value;
        if (!currentRole) {
            alert('Please select a role before starting the interview.');
            return;
        }
        // Store current role for feedback page
        localStorage.setItem('currentRole', currentRole);
        try {
            userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            userStreamVideo.srcObject = userStream;
            cameraActive = true; // Camera is now active
            interviewStartTime = Date.now(); // Record interview start time
            document.getElementById('role-selection').classList.add('hidden');
            interviewSection.classList.remove('hidden');
            // Enable speech synthesis after user interaction
            if (synth) {
                synth.resume();
            }
            startRound();
        } catch (error) {
            console.error('Media access error:', error);
            alert('Camera and microphone access is required for the video interview. Please allow access in your browser settings and try again. Error: ' + error.message);
            return;
        }
    });

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceStatus.textContent = 'Voice recognition: Listening...';
            startVoiceBtn.disabled = true;
            stopVoiceBtn.disabled = false;
        };

        recognition.onend = () => {
            voiceStatus.textContent = 'Voice recognition: Inactive';
            startVoiceBtn.disabled = false;
            stopVoiceBtn.disabled = true;
            // Reset recognition for next use
            const newRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            newRecognition.continuous = false;
            newRecognition.interimResults = false;
            newRecognition.lang = 'en-US';
            newRecognition.onstart = recognition.onstart;
            newRecognition.onend = recognition.onend;
            newRecognition.onresult = recognition.onresult;
            newRecognition.onerror = recognition.onerror;
            recognition = newRecognition;
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                currentTranscript = finalTranscript.trim();
                voiceStatus.textContent = 'Voice recognition: Processing voice response...';
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            voiceStatus.textContent = 'Voice recognition: Error - ' + event.error;
            alert('Speech recognition error: ' + event.error + '. Please try again or use text input.');
        };
    } else {
        alert('Speech recognition is not supported in this browser. Please use Chrome for best voice features.');
        startVoiceBtn.disabled = true;
        stopVoiceBtn.disabled = true;
    }

    startVoiceBtn.addEventListener('click', () => {
        if (recognition) {
            try {
                currentTranscript = ''; // Reset transcript
                recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                alert('Failed to start voice recognition. Please try again.');
            }
        }
    });

    stopVoiceBtn.addEventListener('click', () => {
        if (recognition) {
            try {
                recognition.stop();
                voiceStatus.textContent = 'Voice recognition: Processing voice response...';
                startVoiceBtn.disabled = false;
                stopVoiceBtn.disabled = true;
                // Delay processing to allow onresult to fire
                setTimeout(() => {
                    if (currentTranscript) {
                        const transcript = currentTranscript; // Save before clearing
                        addMessage('user', transcript);
                        voiceStatus.textContent = 'Voice response sent to AI';
                        currentTranscript = '';

                        // Check if interview is complete and this is a follow-up question
                        if (currentRound >= rounds.length) {
                            // Interview is complete, treat as follow-up question
                            handlePostInterviewQuestion(transcript);
                        } else {
                            // Still in interview, record response and continue
                            const currentQuestion = typeof questions[questionIndex] === 'string' ? questions[questionIndex] : questions[questionIndex].question;
                            recordUserResponse(currentQuestion, transcript);
                            setTimeout(() => {
                                nextQuestion();
                            }, 1000);
                        }
                    } else {
                        voiceStatus.textContent = 'Voice recognition: No speech detected';
                        // Reset for next attempt
                        setTimeout(() => {
                            voiceStatus.textContent = 'Voice recognition: Inactive';
                        }, 2000);
                    }
                }, 1000); // Increased delay to 1 second
            } catch (error) {
                console.error('Failed to stop recognition:', error);
                voiceStatus.textContent = 'Voice recognition: Error stopping';
            }
        }
    });

    sendResponseBtn.addEventListener('click', () => {
        const response = userResponseInput.value.trim();
        if (response) {
            addMessage('user', response);
            userResponseInput.value = '';

            // Check if interview is complete and this is a follow-up question
            if (currentRound >= rounds.length) {
                // Interview is complete, treat as follow-up question
                handlePostInterviewQuestion(response);
            } else {
                // Still in interview, record response and continue
                const currentQuestion = typeof questions[questionIndex] === 'string' ? questions[questionIndex] : questions[questionIndex].question;
                recordUserResponse(currentQuestion, response);
                setTimeout(() => {
                    nextQuestion();
                }, 1000); // Simulate AI thinking time
            }
        }
    });

    userResponseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendResponseBtn.click();
        }
    });

    function startRound() {
        currentRound = 0;
        questionIndex = 0;
        questions = questionsDB[currentRole][rounds[currentRound]];
        currentRoundSpan.textContent = rounds[currentRound];
        startTimer(); // Start the interview timer
        speakAndAddMessage(`Welcome to the ${rounds[currentRound]} round. Let's begin.`);
        setTimeout(() => {
            const firstQ = typeof questions[questionIndex] === 'string' ? questions[questionIndex] : questions[questionIndex].question;
            speakAndAddMessage(firstQ);
        }, 2000);
    }

    function nextQuestion() {
        questionIndex++;
        if (questionIndex < questions.length) {
            setTimeout(() => {
                const nextQ = typeof questions[questionIndex] === 'string' ? questions[questionIndex] : questions[questionIndex].question;
                speakAndAddMessage(nextQ);
            }, 1000);
        } else {
            // Move to next round
            currentRound++;
            if (currentRound < rounds.length) {
                questionIndex = 0;
                questions = questionsDB[currentRole][rounds[currentRound]];
                currentRoundSpan.textContent = rounds[currentRound];
                setTimeout(() => {
                    speakAndAddMessage(`Great! Now moving to the ${rounds[currentRound]} round.`);
                    setTimeout(() => {
                        const nextQ = typeof questions[questionIndex] === 'string' ? questions[questionIndex] : questions[questionIndex].question;
                        speakAndAddMessage(nextQ);
                    }, 2000);
                }, 2000);
            } else {
                // Interview complete - allow follow-up questions
                setTimeout(() => {
                    speakAndAddMessage("Thank you for participating in this mock interview. The interview is now complete. You can now ask me any questions you have about the role, company, or interview process, and I'll provide detailed responses.");
                    setTimeout(() => {
                        speakAndAddMessage("Feel free to ask questions like 'What are the benefits?' or 'Tell me about the team'. When you're ready for feedback, just say 'show me my feedback' or 'give me feedback'.");
                    }, 3000);
                }, 1000);
            }
        }
    }

    function recordUserResponse(question, response) {
        userResponses.push({ question: question, response: response });
    }

    function findReferenceAnswer(questionText) {
        // Get the current role from localStorage or default to software-engineer
        const currentRole = localStorage.getItem('currentRole') || 'software-engineer';

        if (questionsDB[currentRole]) {
            for (const round in questionsDB[currentRole]) {
                const question = questionsDB[currentRole][round].find(q => q.question === questionText);
                if (question) {
                    return question.referenceAnswer;
                }
            }
        }
        return null;
    }

    function speakAndAddMessage(message) {
        addMessage('ai', message);
        if (synth) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1; // Neutral pitch
            utterance.volume = 1; // Full volume

            // Try to select a female voice for HR representation
            if (voices.length > 0) {
                // Look for a female English voice
                const femaleVoice = voices.find(voice =>
                    voice.lang.startsWith('en') &&
                    (voice.name.toLowerCase().includes('female') ||
                     voice.name.toLowerCase().includes('woman') ||
                     voice.name.toLowerCase().includes('zira') ||
                     voice.name.toLowerCase().includes('susan') ||
                     voice.name.toLowerCase().includes('karen') ||
                     voice.name.toLowerCase().includes('samantha'))
                );
                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                } else {
                    // Fallback to first English voice
                    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
                    if (englishVoice) {
                        utterance.voice = englishVoice;
                    }
                }
            }

            aiSpeaking.textContent = 'AI is speaking...';
            utterance.onstart = () => {
                // Simulate lip sync by changing avatar opacity slightly
                const aiAvatar = document.getElementById('ai-avatar');
                aiAvatar.style.animation = 'lipSync 0.5s infinite alternate';
            };
            utterance.onend = () => {
                aiSpeaking.textContent = '';
                const aiAvatar = document.getElementById('ai-avatar');
                aiAvatar.style.animation = '';
            };
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                aiSpeaking.textContent = '';
                const aiAvatar = document.getElementById('ai-avatar');
                aiAvatar.style.animation = '';
            };
            try {
                // Small delay to ensure user interaction context
                setTimeout(() => {
                    synth.speak(utterance);
                }, 100);
            } catch (error) {
                console.error('Failed to speak:', error);
                aiSpeaking.textContent = '';
                const aiMouth = document.getElementById('ai-mouth');
                aiMouth.classList.remove('speaking');
            }
        } else {
            console.warn('Speech synthesis not supported');
            aiSpeaking.textContent = '';
        }
    }

    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'ai' ? 'ai-message' : 'user-message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function provideStructuredFeedback() {
        // Stop the timer if it's still running
        if (interviewTimer) {
            clearInterval(interviewTimer);
            interviewTimer = null;
        }

        // Prepare feedback data
        const feedbackData = {
            responses: userResponses.map(item => ({
                question: item.question,
                response: item.response,
                analysis: analyzeResponse(item.question, item.response)
            })),
            overallScore: calculateOverallScore(),
            performanceLevel: getPerformanceLevel(calculateOverallScore()),
            overallFeedback: getOverallFeedback(calculateOverallScore()),
            cameraActive: cameraActive, // Include camera status for behavioral analysis
            interviewDuration: interviewStartTime ? Math.round((Date.now() - interviewStartTime) / 1000) : 0, // Duration in seconds
            timeExpired: timeRemaining <= 0 // Whether interview ended due to time expiration
        };

        // Store feedback data in localStorage
        localStorage.setItem('interviewFeedback', JSON.stringify(feedbackData));

        // Display feedback on main page instead of popup
        displayFeedbackOnMainPage(feedbackData);
    }

    function displayFeedbackOnMainPage(feedbackData) {
        // Hide interview section and show feedback section
        document.getElementById('interview-section').classList.add('hidden');
        document.getElementById('feedback-section').classList.remove('hidden');

        const feedbackContent = document.getElementById('feedback-content');

        let html = `
            <div class="feedback-header">
                <div class="overall-score">Overall Score: ${feedbackData.overallScore}/10</div>
                <div class="performance-level">Performance Level: ${feedbackData.performanceLevel}</div>
                <div class="feedback-summary">
                    <strong>Overall Feedback:</strong> ${feedbackData.overallFeedback}
                </div>
            </div>

            <div class="response-analysis">
                <h3>Response Analysis</h3>
        `;

        feedbackData.responses.forEach((item, index) => {
            // Find the reference answer for this question
            const referenceAnswer = findReferenceAnswer(item.question);

            html += `
                <div class="feedback-item">
                    <div class="feedback-question">Question ${index + 1}: ${item.question}</div>
                    <div class="feedback-analysis"><strong>Performance Feedback:</strong> ${item.analysis.feedback}</div>
                    <div class="feedback-suggestion"><strong>Improvement Suggestion:</strong> ${item.analysis.suggestion}</div>
                    ${referenceAnswer ? `<div class="reference-answer"><strong>What You Should Have Said:</strong> ${referenceAnswer}</div>` : ''}
                </div>
            `;
        });

        html += `
            </div>

            <div class="behavioral-analysis">
                <h3>Behavioral Analysis</h3>
                <p>Based on your performance throughout the interview:</p>
                <ul>
                    ${generateBehavioralFeedback(feedbackData.overallScore, feedbackData.responses.length, feedbackData.cameraActive, feedbackData.interviewDuration)}
                </ul>
                ${feedbackData.timeExpired ? '<div class="time-expired-notice"><p><strong>⚠️ Interview Time Expired:</strong> Your interview ended due to time constraints. In real interviews, managing your time effectively is crucial. Consider practicing with shorter time limits to improve your pacing.</p></div>' : ''}
            </div>
        `;

        feedbackContent.innerHTML = html;

        // Add event listeners for feedback buttons
        document.getElementById('save-feedback').addEventListener('click', () => saveFeedbackToCollection(feedbackData));
        document.getElementById('back-to-start').addEventListener('click', () => location.reload());
    }

    function saveFeedbackToCollection(feedbackData) {
        // Get existing feedback collection from localStorage
        let feedbackCollection = JSON.parse(localStorage.getItem('feedbackCollection') || '[]');

        // Create feedback entry with timestamp
        const feedbackEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            role: localStorage.getItem('currentRole') || 'Unknown',
            score: feedbackData.overallScore,
            performanceLevel: feedbackData.performanceLevel,
            responses: feedbackData.responses,
            overallFeedback: feedbackData.overallFeedback,
            cameraActive: feedbackData.cameraActive,
            interviewDuration: feedbackData.interviewDuration,
            timeExpired: feedbackData.timeExpired,
            content: generateFeedbackTextContent(feedbackData)
        };

        // Add to collection
        feedbackCollection.push(feedbackEntry);

        // Save back to localStorage
        localStorage.setItem('feedbackCollection', JSON.stringify(feedbackCollection));

        // Show success message and navigate to collection
        alert('Feedback saved to your collection successfully!');
        showFeedbackCollection();

        // Show navigation button
        document.getElementById('nav-to-collection').classList.remove('hidden');
    }

    function generateFeedbackTextContent(feedbackData) {
        let content = `AI-MOCK HR Interview\n`;
        content += `Saved Feedback Report\n`;
        content += `AI-MOCK HR Interview Feedback Report\n`;
        content += `=====================================\n\n`;

        content += `OVERALL PERFORMANCE\n`;
        content += `===================\n`;
        content += `Score: ${feedbackData.overallScore}/10\n`;
        content += `Performance Level: ${feedbackData.performanceLevel}\n`;
        content += `Overall Feedback: ${feedbackData.overallFeedback}\n\n`;

        content += `RESPONSE ANALYSIS\n`;
        content += `=================\n\n`;

        feedbackData.responses.forEach((item, index) => {
            const referenceAnswer = findReferenceAnswer(item.question);
            content += `Question ${index + 1}: ${item.question}\n`;
            content += `Your Answer: "${item.response}"\n`;
            content += `Analysis: ${item.analysis.feedback}\n`;
            content += `Suggestion: ${item.analysis.suggestion}\n`;
            content += `Reference Answer: ${referenceAnswer || 'N/A'}\n`;
            content += `\n`;
        });

        content += `BEHAVIORAL ANALYSIS\n`;
        content += `==================\n`;
        content += `Based on your performance throughout the interview:\n`;

        // Generate behavioral feedback for text content
        const behavioralFeedback = generateBehavioralFeedback(feedbackData.overallScore, feedbackData.responses.length, feedbackData.cameraActive, feedbackData.interviewDuration);
        // Convert HTML list to plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = behavioralFeedback;
        const listItems = tempDiv.querySelectorAll('li');
        listItems.forEach(item => {
            content += `- ${item.textContent}\n`;
        });

        // Add time expired notice if applicable
        if (feedbackData.timeExpired) {
            content += `\n⚠️ INTERVIEW TIME EXPIRED\n`;
            content += `========================\n`;
            content += `Your interview ended due to time constraints. In real interviews, managing your time effectively is crucial. Consider practicing with shorter time limits to improve your pacing.\n`;
        }

        return content;
    }

    function showFeedbackCollection() {
        // Hide all sections and show collection
        document.getElementById('role-selection').classList.add('hidden');
        document.getElementById('interview-section').classList.add('hidden');
        document.getElementById('feedback-section').classList.add('hidden');
        document.getElementById('saved-feedback-view').classList.add('hidden');
        document.getElementById('feedback-collection-section').classList.remove('hidden');

        const feedbackList = document.getElementById('feedback-list');
        const feedbackCollection = JSON.parse(localStorage.getItem('feedbackCollection') || '[]');

        if (feedbackCollection.length === 0) {
            feedbackList.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No feedback reports saved yet. Complete an interview to save your first report!</p>';
            return;
        }

        let html = '';
        feedbackCollection.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            const time = new Date(entry.timestamp).toLocaleTimeString();
            const roleName = entry.role.charAt(0).toUpperCase() + entry.role.slice(1).replace('-', ' ');

            html += `
                <div class="feedback-card" data-id="${entry.id}">
                    <div class="feedback-card-header">
                        <h3 class="feedback-card-title">Interview Report</h3>
                        <button class="delete-feedback-btn" data-id="${entry.id}" title="Delete this report">🗑️</button>
                    </div>
                    <div class="feedback-card-date">${date} ${time}</div>
                    <div class="feedback-card-score">Score: ${entry.score}/10</div>
                    <div class="feedback-card-role">Role: ${roleName}</div>
                    <div class="feedback-card-responses">${entry.responses.length} responses analyzed</div>
                </div>
            `;
        });

        feedbackList.innerHTML = html;

        // Add click listeners to cards and delete buttons
        document.querySelectorAll('.feedback-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger card click if delete button was clicked
                if (e.target.classList.contains('delete-feedback-btn')) {
                    e.stopPropagation();
                    const feedbackId = parseInt(e.target.dataset.id);
                    if (confirm('Are you sure you want to delete this feedback report?')) {
                        deleteFeedback(feedbackId);
                    }
                    return;
                }
                const feedbackId = parseInt(e.currentTarget.dataset.id);
                showSavedFeedback(feedbackId);
            });
        });
    }

    function showSavedFeedback(feedbackId) {
        const feedbackCollection = JSON.parse(localStorage.getItem('feedbackCollection') || '[]');
        const feedbackEntry = feedbackCollection.find(entry => entry.id === feedbackId);

        if (!feedbackEntry) return;

        // Hide collection and show saved feedback view
        document.getElementById('feedback-collection-section').classList.add('hidden');
        document.getElementById('saved-feedback-view').classList.remove('hidden');

        document.getElementById('saved-feedback-content').textContent = feedbackEntry.content;

        // Add event listeners
        document.getElementById('back-to-collection').addEventListener('click', () => {
            document.getElementById('saved-feedback-view').classList.add('hidden');
            document.getElementById('feedback-collection-section').classList.remove('hidden');
        });

        document.getElementById('delete-feedback').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this feedback report?')) {
                deleteFeedback(feedbackId);
            }
        });
    }

    function deleteFeedback(feedbackId) {
        let feedbackCollection = JSON.parse(localStorage.getItem('feedbackCollection') || '[]');
        feedbackCollection = feedbackCollection.filter(entry => entry.id !== feedbackId);
        localStorage.setItem('feedbackCollection', JSON.stringify(feedbackCollection));

        // Go back to collection
        document.getElementById('saved-feedback-view').classList.add('hidden');
        showFeedbackCollection();
    }

    // Function to generate AI responses for follow-up questions
    function generateAIResponse(userQuestion) {
        const questionLower = userQuestion.toLowerCase();

        // Check for feedback requests
        if (questionLower.includes('feedback') || questionLower.includes('show me') || questionLower.includes('give me')) {
            provideStructuredFeedback();
            return "Opening your detailed feedback report now. This includes analysis of all your responses, suggestions for improvement, and reference answers to help you prepare better.";
        }

        // Check for common interview-related questions
        if (questionLower.includes('salary') || questionLower.includes('pay') || questionLower.includes('compensation')) {
            return "That's a great question about compensation. Typically, we offer competitive salaries based on experience level, with additional benefits including health insurance, retirement plans, and professional development opportunities. During the interview process, we'll discuss specific compensation ranges that align with your experience and our budget. What are your salary expectations for this role?";
        } else if (questionLower.includes('benefit') || questionLower.includes('vacation') || questionLower.includes('pto')) {
            return "We offer comprehensive benefits including health, dental, and vision insurance, flexible PTO policy (typically 15-20 days per year plus holidays), professional development budget, and opportunities for remote work. We also provide gym memberships, mental health support, and regular team-building activities. Our benefits package is designed to support work-life balance and employee well-being.";
        } else if (questionLower.includes('team') || questionLower.includes('size') || questionLower.includes('people')) {
            return "Our engineering team consists of about 25 talented individuals including developers, designers, product managers, and QA engineers. We work in cross-functional teams of 4-6 people, fostering collaboration and knowledge sharing. The team has a good mix of experience levels, from junior developers to senior architects, creating excellent mentorship opportunities.";
        } else if (questionLower.includes('project') || questionLower.includes('work on') || questionLower.includes('technology')) {
            return "Currently, we're working on several exciting projects including a real-time collaboration platform, a machine learning-powered analytics dashboard, and mobile applications for both iOS and Android. We primarily use React, Node.js, Python, and cloud technologies like AWS. You'll have opportunities to work across the full stack and contribute to projects that impact thousands of users.";
        } else if (questionLower.includes('culture') || questionLower.includes('environment') || questionLower.includes('workplace')) {
            return "Our company culture emphasizes innovation, collaboration, and continuous learning. We have a flat organizational structure that encourages open communication, regular feedback sessions, and professional development. We value work-life balance with flexible hours, remote work options, and a supportive environment where everyone feels comfortable sharing ideas and taking initiative.";
        } else if (questionLower.includes('growth') || questionLower.includes('career') || questionLower.includes('development')) {
            return "We invest heavily in employee growth and development. This includes annual professional development budgets, conference attendance, online learning platforms, mentorship programs, and clear career progression paths. Many of our team members have been promoted internally, and we encourage continuous learning through hackathons, lunch-and-learn sessions, and cross-training opportunities.";
        } else if (questionLower.includes('challenge') || questionLower.includes('difficult') || questionLower.includes('problem')) {
            return "Like any growing tech company, we face challenges such as scaling our infrastructure to handle increasing user loads, maintaining code quality across a growing codebase, and staying ahead of rapidly evolving technologies. We're currently focusing on improving our deployment processes, enhancing our testing strategies, and building more robust monitoring and alerting systems.";
        } else if (questionLower.includes('process') || questionLower.includes('methodology') || questionLower.includes('agile')) {
            return "We follow an Agile development methodology with two-week sprints, daily stand-ups, and bi-weekly planning sessions. We use Jira for project management, Git for version control with feature branches and pull requests, and have a comprehensive CI/CD pipeline. Code reviews are mandatory, and we emphasize automated testing and continuous integration.";
        } else if (questionLower.includes('remote') || questionLower.includes('hybrid') || questionLower.includes('office')) {
            return "We offer a flexible hybrid work model where employees can work from home several days a week while also having access to our modern office space for collaboration. We provide all the necessary equipment for remote work and use tools like Slack, Zoom, and Miro to maintain team connectivity regardless of location.";
        } else if (questionLower.includes('interview') || questionLower.includes('process') || questionLower.includes('next step')) {
            return "Our interview process typically includes an initial phone screening, a technical assessment, a virtual interview with the hiring manager, and potentially a final interview with senior leadership or a panel. The entire process usually takes 2-4 weeks. We'll keep you updated at each step and provide feedback regardless of the outcome.";
        } else {
            // Generic response for unrecognized questions
            return "That's an interesting question. In a real interview, I'd recommend preparing thoughtful questions that show your genuine interest in the role and company. Questions about team dynamics, current projects, growth opportunities, and company culture demonstrate that you've done your research and are seriously considering the position. Is there anything specific about our team or projects you'd like to know more about?";
        }
    }

    // Add follow-up question handling
    function handleFollowUpQuestion(userQuestion) {
        const aiResponse = generateAIResponse(userQuestion);
        setTimeout(() => {
            speakAndAddMessage(aiResponse);
        }, 1000);
    }

    // Handle follow-up questions after interview completion
    function handlePostInterviewQuestion(userQuestion) {
        const aiResponse = generateAIResponse(userQuestion);
        setTimeout(() => {
            speakAndAddMessage(aiResponse);
        }, 1000);
    }

    function analyzeResponse(question, response) {
        const responseLength = response.split(' ').length;
        const questionLower = question.toLowerCase();

        // Analyze based on question type and content
        let feedback = '';
        let suggestion = '';

        if (questionLower.includes('experience') || questionLower.includes('background')) {
            if (responseLength < 15) {
                feedback = 'Your response lacks sufficient detail about your background and experience.';
                suggestion = 'Provide specific examples of your work, achievements, and relevant experience with concrete details.';
            } else if (responseLength < 40) {
                feedback = 'Good overview, but could benefit from more specific examples and achievements.';
                suggestion = 'Include specific projects, technologies used, and measurable outcomes from your experience.';
            } else {
                feedback = 'Excellent comprehensive overview of your background and experience.';
                suggestion = 'Continue providing detailed responses that showcase your expertise and achievements.';
            }
        } else if (questionLower.includes('why') || questionLower.includes('interested')) {
            if (responseLength < 10) {
                feedback = 'Your motivation and interest in the role/company needs more explanation.';
                suggestion = 'Explain what specifically attracts you to this role and company, mentioning research you\'ve done.';
            } else if (responseLength < 25) {
                feedback = 'Decent explanation of your interest, but could be more compelling.';
                suggestion = 'Connect your skills and career goals with specific aspects of the role and company values.';
            } else {
                feedback = 'Strong, well-reasoned explanation of your interest and motivation.';
                suggestion = 'Your response effectively communicates genuine interest and preparation.';
            }
        } else if (questionLower.includes('technical') || questionLower.includes('how') || questionLower.includes('explain')) {
            if (responseLength < 20) {
                feedback = 'Technical explanation lacks depth and specific examples.';
                suggestion = 'Provide step-by-step explanations with real-world examples and demonstrate problem-solving approach.';
            } else if (responseLength < 50) {
                feedback = 'Good technical understanding shown, but could include more practical examples.';
                suggestion = 'Include specific scenarios, code examples, or methodologies you\'ve used in similar situations.';
            } else {
                feedback = 'Excellent technical depth with clear explanations and examples.';
                suggestion = 'Continue demonstrating strong technical knowledge and practical application.';
            }
        } else if (questionLower.includes('behavioral') || questionLower.includes('tell me about') || questionLower.includes('describe')) {
            if (responseLength < 25) {
                feedback = 'Behavioral response is too brief and lacks the STAR structure.';
                suggestion = 'Use STAR method: Situation, Task, Action, Result. Provide specific examples with measurable outcomes.';
            } else if (responseLength < 60) {
                feedback = 'Good attempt at behavioral response, but could be more structured.';
                suggestion = 'Ensure you cover all STAR elements and quantify your impact where possible.';
            } else {
                feedback = 'Strong behavioral response with clear structure and impact.';
                suggestion = 'Excellent use of STAR method with specific, quantifiable examples.';
            }
        } else {
            // Generic analysis for other questions
            if (responseLength < 10) {
                feedback = 'Response is quite brief and could provide more value.';
                suggestion = 'Expand on your answer with specific details, examples, or reasoning.';
            } else if (responseLength < 30) {
                feedback = 'Decent response that covers the basics.';
                suggestion = 'Consider adding more context or examples to strengthen your answer.';
            } else {
                feedback = 'Comprehensive and well-thought-out response.';
                suggestion = 'Your detailed approach effectively addresses the question.';
            }
        }

        return { feedback, suggestion };
    }

    function calculateOverallScore() {
        if (userResponses.length === 0) return 5;

        let totalScore = 0;
        userResponses.forEach(item => {
            const responseLength = item.response.split(' ').length;
            if (responseLength >= 40) totalScore += 10;
            else if (responseLength >= 25) totalScore += 7;
            else if (responseLength >= 15) totalScore += 5;
            else if (responseLength >= 10) totalScore += 3;
            else totalScore += 1;
        });

        return Math.min(10, Math.max(1, Math.round(totalScore / userResponses.length)));
    }

    function getPerformanceLevel(score) {
        if (score >= 9) return 'exceptionally well';
        if (score >= 8) return 'very well';
        if (score >= 7) return 'well';
        if (score >= 6) return 'adequately';
        if (score >= 5) return 'moderately well';
        return 'below expectations';
    }

    function getOverallFeedback(score) {
        if (score >= 8) {
            return 'You demonstrated strong interview skills with detailed, well-structured responses. Focus on maintaining this level of preparation.';
        } else if (score >= 6) {
            return 'You showed good potential with solid responses. Work on providing more detailed examples and using structured approaches like STAR method.';
        } else {
            return 'Your responses need more development. Practice providing detailed answers with specific examples and clear structure. Consider recording practice interviews to improve.';
        }
    }

    function generateBehavioralFeedback(score, responseCount, cameraActive, interviewDuration) {
        let feedback = '';

        // Communication Skills based on response quality
        if (score >= 8) {
            feedback += '<li><strong>Communication Skills:</strong> Excellent verbal communication with clear, confident delivery and professional tone throughout the interview.</li>';
        } else if (score >= 6) {
            feedback += '<li><strong>Communication Skills:</strong> Good communication skills demonstrated, though delivery could be more confident with better pacing and emphasis.</li>';
        } else {
            feedback += '<li><strong>Communication Skills:</strong> Communication needs significant improvement - responses lacked clarity and confidence, with inconsistent pacing.</li>';
        }

        // Body Language and Video Presence - based on actual camera usage
        if (cameraActive) {
            if (score >= 8) {
                feedback += '<li><strong>Body Language & Video Presence:</strong> Excellent video presence with confident posture, consistent eye contact through the camera, and professional appearance throughout the interview.</li>';
            } else if (score >= 6) {
                feedback += '<li><strong>Body Language & Video Presence:</strong> Good video presence with adequate eye contact and posture, though could be more confident and engaging.</li>';
            } else {
                feedback += '<li><strong>Body Language & Video Presence:</strong> Video presence needs improvement - appeared nervous or distracted, with inconsistent eye contact and posture.</li>';
            }
        } else {
            feedback += '<li><strong>Body Language & Video Presence:</strong> Camera was not active during the interview, so video presence could not be evaluated. In a real interview, maintaining eye contact through the camera and professional posture is crucial.</li>';
        }

        // Engagement based on response count, quality, and interview duration
        const engagementScore = (responseCount >= 10 && score >= 7) ? 'high' :
                               (responseCount >= 8) ? 'moderate' : 'low';

        if (engagementScore === 'high') {
            feedback += '<li><strong>Engagement:</strong> Highly engaged throughout the entire interview process, showing genuine interest and active participation in all rounds.</li>';
        } else if (engagementScore === 'moderate') {
            feedback += '<li><strong>Engagement:</strong> Moderate engagement shown, but could demonstrate more enthusiasm and better connection with the interviewer.</li>';
        } else {
            feedback += '<li><strong>Engagement:</strong> Low engagement levels observed - responses seemed disengaged with minimal enthusiasm or connection to the interview process.</li>';
        }

        // Preparation based on score and response structure
        if (score >= 8) {
            feedback += '<li><strong>Preparation:</strong> Exceptionally well-prepared with thoughtful, structured responses that demonstrate thorough research and extensive practice.</li>';
        } else if (score >= 6) {
            feedback += '<li><strong>Preparation:</strong> Moderately prepared with some structured responses, but needs more practice with common interview questions and frameworks.</li>';
        } else {
            feedback += '<li><strong>Preparation:</strong> Poor preparation evident - responses lacked structure and showed minimal familiarity with standard interview expectations.</li>';
        }

        // Professionalism based on overall performance and camera usage
        if (score >= 7 && cameraActive) {
            feedback += '<li><strong>Professionalism:</strong> Maintained professional demeanor throughout all interview rounds, with appropriate tone, respect for the process, and proper video etiquette.</li>';
        } else if (score >= 7) {
            feedback += '<li><strong>Professionalism:</strong> Maintained professional demeanor throughout all interview rounds, with appropriate tone and respect for the process.</li>';
        } else {
            feedback += '<li><strong>Professionalism:</strong> Professionalism needs improvement - tone and approach were not consistently appropriate for a professional interview setting.</li>';
        }

        return feedback;
    }

    // Timer functions
    function startTimer() {
        timeRemaining = 30 * 60; // Reset to 30 minutes
        updateTimerDisplay();

        interviewTimer = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                // Time's up - end the interview
                clearInterval(interviewTimer);
                interviewTimer = null;

                // Show time expired message and provide feedback
                speakAndAddMessage("I'm sorry, but the interview time has expired. Time management is crucial in real interviews. Let me provide you with feedback on your performance so far.");
                setTimeout(() => {
                    provideStructuredFeedback();
                }, 3000);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Change color when time is running low
        if (timeRemaining <= 300) { // Last 5 minutes
            timerDisplay.style.color = '#e74c3c';
        } else if (timeRemaining <= 600) { // Last 10 minutes
            timerDisplay.style.color = '#f39c12';
        } else {
            timerDisplay.style.color = '#27ae60';
        }
    }

    // Check if there's existing feedback collection and show nav button
    const feedbackCollection = JSON.parse(localStorage.getItem('feedbackCollection') || '[]');
    if (feedbackCollection.length > 0) {
        navToCollectionBtn.classList.remove('hidden');
    }

    // Add event listeners for navigation
    navToCollectionBtn.addEventListener('click', () => showFeedbackCollection());
    backToMainBtn.addEventListener('click', () => {
        document.getElementById('feedback-collection-section').classList.add('hidden');
        document.getElementById('role-selection').classList.remove('hidden');
    });
});
