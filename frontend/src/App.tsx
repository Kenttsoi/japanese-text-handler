import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams, Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createTheme, MantineProvider, Center, Loader, CSSVariablesResolver } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import '@mantine/core/styles.css';
import './App.css'
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import Home from './pages/Home';
import { Header } from './components/layout/Header';
import Footer from './components/layout/Footer';
import { NotFound } from './pages/NotFound';
import PageLayout from './components/layout/PageLayout';
// import Annotator from './pages/Annotator';

const Annotator = lazy(() => import('./pages/Annotator'));
const Study = lazy(() => import('./pages/Study'));

const LanguageWrapper = () => {
  const { lang } = useParams();
  const { i18n: i18nInstance } = useTranslation();
  const SUPPORTED_LANGS = ['en', 'ja', 'zh-TW', 'ko'];
  const FUNCTIONAL_PATHS = ['annotate', 'study']

  if (lang && !SUPPORTED_LANGS.includes(lang)) {
    if (FUNCTIONAL_PATHS.includes(lang)) {
      return <Navigate to={`/${i18nInstance.language}/${lang}`} replace />;
    }
    return <Navigate to="/404" replace />;
  }

  useEffect(() => {
    if (lang && i18nInstance.language !== lang) {
      i18nInstance.changeLanguage(lang);
    }
  }, [lang, i18nInstance]);

  return <Outlet />;
}

const NavigateToLang = () => {
  const location = useLocation();
  const { language } = useTranslation().i18n;

  return <Navigate to={`/${language}${location.pathname}`} replace />;
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <Center style={{ height: '50vh' }}>
          <Loader color="yellow" size="xl" type="dots" />
        </Center>
      }>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Navigate to={`/${i18n.language}`} replace />}
          />
          <Route path="/:lang" element={<LanguageWrapper />}>
            <Route index element={<PageLayout><Home /></PageLayout>} />
            <Route path="annotate" element={<PageLayout><Annotator /></PageLayout>} />
            <Route path="study" element={<PageLayout><Study /></PageLayout>} />
            <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
          </Route>
          <Route
            path="/:path/*"
            element={<NavigateToLang />}
          />
          <Route path="/404" element={<PageLayout><NotFound /></PageLayout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
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
      <Notifications position="bottom-center" zIndex={1000} />
      <BrowserRouter>
        <Header />
        <main style={{ paddingTop: '30px', minHeight: '30vh' }}>
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
