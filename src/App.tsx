import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Gruß from './Gruß';
import Textblock from './Textblock';
import TextBlick from './TextBlick';
import ChatGPTDialog from './ChatGPTDialog';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center">
        <TextBlick />
        <ChatGPTDialog />
      </main>
      <Footer />
    </div>
  );
}

export default App;
