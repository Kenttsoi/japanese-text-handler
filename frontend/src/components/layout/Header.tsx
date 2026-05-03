import React from 'react';
import { Anchor, Burger, Center, Menu, Group, Drawer, Grid, ActionIcon, Tabs, rem, Text, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useWindowScroll } from '@mantine/hooks';
import IconSun from '@tabler/icons-react/dist/esm/icons/IconSun.mjs';
import IconMoon from '@tabler/icons-react/dist/esm/icons/IconMoon.mjs';
import IconLanguageHiragana from '@tabler/icons-react/dist/esm/icons/IconLanguageHiragana.mjs';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const links = [
  { link: '', tLabel: 'home' },
  { link: 'annotate', tLabel: 'annotator' },
  { link: 'test', tLabel: 'test' }
];

const SUPPORTED_LANGS = [
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '한국어', value: 'ko' },
];

const navItems = links;

export const Header: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const scrolled = scroll.y > 50;
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const { i18n, t } = useTranslation();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const currentLang = pathParts[1] || 'en';

  const handleLangChange = (newLang: string) => {
    const pathSegments = location.pathname.split('/');
    pathSegments[1] = newLang;
    const newPath = pathSegments.join('/') || `/${newLang}`;
    navigate(newPath);
  }

  const mobileItems = links.map((link) => {
    return (
      <Grid.Col span={12} className={classes.mobileMenuCol}>
        <Anchor
          key={link.tLabel}
          href={link.link}
          c="white"
          underline='never'
          onClick={(event) => event.preventDefault()}
        >
          {link.tLabel}
        </Anchor>
      </Grid.Col>
    );
  });

  return (
    <>
      <header className={classes.header} data-scrolled={scrolled || undefined}>

        <div className={classes.inner}>
          <div className={classes.section} style={{ justifyContent: 'flex-start' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>KanjiTool</span>
          </div>
          <Tabs
            variant="unstyled"
            visibleFrom="sm"
            value={location.pathname}
            onChange={(value) => navigate(value || `/${i18n.language}`)}
          >
            <Tabs.List style={{ display: 'flex', gap: rem(4), position: 'relative' }}>
              {navItems.map((item) => {
                const localizedPath = item.link === '/' ? `/${i18n.language}` : `/${i18n.language}/${item.link}`;
                const isActive = location.pathname === localizedPath;

                return (
                  <Tabs.Tab
                    key={localizedPath}
                    value={localizedPath}
                    style={{
                      position: 'relative',
                      padding: `${rem(8)} ${rem(16)}`,
                      borderRadius: '100px',
                      cursor: 'pointer',
                      border: 'none',
                      /* background: 'transparent', */
                      color: isActive ? 'var(--mantine-color-white)' : 'var(--mantine-color-text)',
                      transition: 'color 300ms ease',
                    }}
                    className={classes.tab}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'var(--mantine-primary-color-filled)',
                          borderRadius: '100px',
                          zIndex: 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <Text
                      size="sm"
                      fw={500}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      {t(`header.button.${item.tLabel}` as any)}
                    </Text>
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
          <div className={classes.section} style={{ justifyContent: 'flex-end' }}>
            <Group gap={10} visibleFrom="sm">
              <ActionIcon
                variant="default"
                size="lg"
                bd={0}
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle color scheme"
              >
                <IconSun stroke={2} className={cx(classes.light)} />
                <IconMoon stroke={2} className={cx(classes.dark)} />
              </ActionIcon>
              <Menu shadow="md" width={150} position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="default" size="lg" bd={0}>
                    <IconLanguageHiragana stroke={2} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t('header.selectLanguage')}</Menu.Label>
                  {SUPPORTED_LANGS.map((lang) => (
                    <Menu.Item
                      key={lang.value}
                      color="orange"
                      onClick={() => handleLangChange(lang.value)}
                      rightSection={currentLang === lang.value ? <IconSun size={14} /> : null}
                    >
                      {lang.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </div>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>

      </header>

      <Drawer
        opened={opened}
        onClose={toggle}
        withCloseButton={false}
        position="top"
        size="100%"
        styles={{
          content: {
            background: 'transparent',
            zIndex: 1000,
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}
      >
        <Center>
          <Grid justify="center" align="center">
            {mobileItems}
          </Grid>
        </Center>
      </Drawer>
    </>

  );
}