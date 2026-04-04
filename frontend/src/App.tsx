import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './App.css'
import Annotator from './pages/Annotator';
import Home from './pages/Home';
import { Header } from './components/Header';
import { NotFound } from './pages/NotFound';


function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Header />
        <main style={{ paddingTop: '30px', minHeight: '30vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/annotate" element={<Annotator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
