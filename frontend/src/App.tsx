import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import '@mantine/core/styles.css';
import './App.css'
import Annotator from './pages/Annotator';
import Home from './pages/Home';
import { Header } from './components/layout/Header';
import { NotFound } from './pages/NotFound';
import PageLayout from './components/layout/PageLayout';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageLayout><Home /></PageLayout>} />
        <Route path="/annotate" element={<PageLayout><Annotator /></PageLayout>} />
        <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Header />
        <main style={{ paddingTop: '30px', minHeight: '30vh' }}>
          <AnimatedRoutes />
        </main>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
