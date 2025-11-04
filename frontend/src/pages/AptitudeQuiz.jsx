import React, { useEffect, useRef } from 'react';

const AptitudeQuiz = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load the quiz app content
    const loadQuiz = async () => {
      try {
        const [htmlResponse, cssResponse, jsResponse] = await Promise.all([
          fetch('/aptitude-quiz/index.html'),
          fetch('/aptitude-quiz/style.css'),
          fetch('/aptitude-quiz/script.js')
        ]);

        const html = await htmlResponse.text();
        const css = await cssResponse.text();
        const js = await jsResponse.text();

        // Create a complete HTML document
        const fullHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Aptitude Quiz Generator</title>
            <style>
              ${css}
              /* Override some styles to match HireReady theme */
              body {
                background-color: #111827 !important;
                color: #ffffff !important;
              }
              .container {
                background-color: #1f2937 !important;
                color: #ffffff !important;
              }
              h1 {
                color: #ffffff !important;
              }
              .option {
                background-color: #374151 !important;
                border-color: #4b5563 !important;
                color: #ffffff !important;
              }
              .option:hover {
                background-color: #4b5563 !important;
              }
              .option.selected {
                background-color: #3b82f6 !important;
              }
              button {
                background-color: #3b82f6 !important;
              }
              button:hover {
                background-color: #2563eb !important;
              }
              #answer-container {
                background-color: #374151 !important;
              }
            </style>
          </head>
          <body>
            ${html}
            <script>
              ${js}
            </script>
          </body>
          </html>
        `;

        // Set the iframe content
        if (iframeRef.current) {
          iframeRef.current.srcdoc = fullHtml;
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
    };

    loadQuiz();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">Aptitude Quiz</h1>
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <iframe
          ref={iframeRef}
          title="Aptitude Quiz"
          width="100%"
          height="800"
          frameBorder="0"
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default AptitudeQuiz;
