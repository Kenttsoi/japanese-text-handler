import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, MantineProvider, Center, Loader, CSSVariablesResolver } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import '@mantine/core/styles.css';
import './App.css'

import Home from './pages/Home';
import { Header } from './components/layout/Header';
import { NotFound } from './pages/NotFound';
import PageLayout from './components/layout/PageLayout';
// import Annotator from './pages/Annotator';

const Annotator = lazy(() => import('./pages/Annotator'));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <Center style={{ height: '50vh' }}>
          <Loader color="blue" size="xl" type="bars" />
        </Center>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageLayout><Home /></PageLayout>} />
          <Route path="/annotate" element={<PageLayout><Annotator /></PageLayout>} />
          <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

const theme = createTheme({
  primaryColor: 'yellow',
  other: {
    backgroundColorLight: '#FAFAF9',
    backgroundColorDark: '#1A1A18',
  }
})

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    // place variables here which will not be changed by mode
  },
  light: {
    '--mantine-color-body': theme.other.backgroundColorLight,
    '--header-bg': '#FFFFFF',
  },
  dark: {
    '--mantine-color-body': theme.other.backgroundColorDark,
    '--header-bg': '#25262B',
  },
});

function App() {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme="light"
    >
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
