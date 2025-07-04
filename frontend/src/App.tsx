import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './App.css'
import Annotator from './pages/Annotator';


function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/annotate" element={<Annotator />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
