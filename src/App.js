import {
  ThemeProvider
} from '@ui5/webcomponents-react';
import React from 'react';
import './App.css';
import Body from './Components/Body';
import Header from "./Components/Header";


function App() {

  return (
    <ThemeProvider>
      <Header />  
      {/* body */}
      <Body/>
    </ThemeProvider>
  );
}

export default App;
