import React, { useEffect, useRef } from 'react';

const MockInterview = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // The iframe will load the mock interview application
    // Since it's a separate HTML file, we'll use an iframe to embed it
    if (iframeRef.current) {
      iframeRef.current.src = '/src/pages/index.html';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mock Interview</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <iframe
            ref={iframeRef}
            src="/src/pages/index.html"
            width="100%"
            height="600"
            style={{ border: 'none', borderRadius: '8px' }}
            title="AI-MOCK HR Interview"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
