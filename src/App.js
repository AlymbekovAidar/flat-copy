import React, { useState } from 'react';
import DownloadImagesApp from './components/DownloadImagesApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  
  return (
    <div>
      <DownloadImagesApp />
      <ToastContainer />
    </div>
  );
};

export default App;