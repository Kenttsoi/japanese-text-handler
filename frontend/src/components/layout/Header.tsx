import React from 'react';
import { Anchor, Burger, Center, SimpleGrid, Collapse, Button, Box, Menu, Group, Drawer, Grid, ActionIcon, Tabs, rem, Text, Stack, Divider, UnstyledButton, useMantineColorScheme, useComputedColorScheme, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useWindowScroll } from '@mantine/hooks';
import IconSun from '@tabler/icons-react/dist/esm/icons/IconSun.mjs';
import IconMoon from '@tabler/icons-react/dist/esm/icons/IconMoon.mjs';
import IconLanguageHiragana from '@tabler/icons-react/dist/esm/icons/IconLanguageHiragana.mjs';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX.mjs';
import IconHome from '@tabler/icons-react/dist/esm/icons/IconHome.mjs';
import IconEdit from '@tabler/icons-react/dist/esm/icons/IconEdit.mjs';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NavButton from './NavButton';

interface NavLink {
  link: string;
  tLabel: string;
  icon?: React.ElementType;
}

interface LanguageOption {
  label: string;
  value: string;
  alias: string;
}

const LINKS: NavLink[] = [
  { link: '', tLabel: 'home', icon: IconHome },
  { link: 'annotate', tLabel: 'annotator', icon: IconEdit }
];

const SUPPORTED_LANGS: LanguageOption[] = [
  { label: 'English', value: 'en', alias: 'EN' },
  { label: '日本語', value: 'ja', alias: 'JA' },
  { label: '繁體中文', value: 'zh-TW', alias: 'TC' },
  { label: '한국어', value: 'ko', alias: 'KO' },
] as const;

const navItems = LINKS;

export const Header: React.FC = () => {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const scrolled = scroll.y > 50;
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [langMobileOpened, setLangMobileOpened] = React.useState(false);

  const pathParts = location.pathname.split('/');
  const currentLang = pathParts[1] || 'en';
  const currentLangObject: LanguageOption = SUPPORTED_LANGS.find(l => l.value === currentLang) || SUPPORTED_LANGS[0];

  const handleLangChange = (newLang: string) => {
    const pathSegments = location.pathname.split('/');
    pathSegments[1] = newLang;
    const newPath = pathSegments.join('/') || `/${newLang}`;
    navigate(newPath);
  }

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
                const localizedPath = !item.link ? `/${i18n.language}` : `/${i18n.language}/${item.link}`;
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
        onClose={close}
        withCloseButton={false}
        position="top"
        offset={28}
        radius="xl"
        size="100%"
        padding="xl"
        styles={{
          content: {
            background: 'light-dark(rgba(255, 255, 255, 0.78), rgba(28, 28, 30, 0.65))',
            border: '1px solid light-dark(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
            color: 'light-dark(#451a03, #e2e8f0)',
            backdropFilter: 'blur(15px)',
            zIndex: 1000,
            position: 'fixed',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          overlay: {
            backgroundColor: 'light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Group justify="flex-end" mb="xl">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="xl"
              radius="xl"
              onClick={close}
            >
              <IconX size={28} />
            </ActionIcon>
          </Group>
          <Group justify="center" gap="xl" mb="xl">
            <Button
              leftSection={<IconLanguageHiragana size={20} />}
              variant="light"
              radius="xl"
              color='gray'
              onClick={() => setLangMobileOpened((o) => !o)}
            >
              {currentLangObject.label}
            </Button>
            <ActionIcon
              variant="light"
              color="orange.6"
              radius="xl"
              size="lg"
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            >
              <IconSun size={20} className={cx(classes.light)} />
              <IconMoon size={20} className={cx(classes.dark)} />
            </ActionIcon>
          </Group>
          <Collapse in={langMobileOpened}>
            {langMobileOpened && (
              <Box pt="xs" pb="md">
                <SimpleGrid cols={2} spacing="xs" mb="md">
                  {SUPPORTED_LANGS.map((lang) => (
                    <Button
                      key={lang.value}
                      variant="light"
                      justify="space-around"
                      radius="xl"
                      color="red.9"
                      leftSection={lang.alias}
                      disabled={false}
                      onClick={() => {
                        handleLangChange(lang.value);
                        setLangMobileOpened(false);
                      }}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </Collapse>
          <ScrollArea style={{ flex: 1 }} mx="-md" px="md">
            <Stack gap="xs">
              {navItems.map((linkItem) => {
                const IconComponent = linkItem.icon;
                const localizedPath = !linkItem.link ? `/${i18n.language}` : `/${i18n.language}/${linkItem.link}`;
                const isActive = location.pathname === localizedPath;
                const clickEvents = () => {
                  navigate(linkItem.link);
                  close();
                };
                return (
                  <NavButton
                    icon={IconComponent ? <IconComponent /> : <></>}
                    label={t(`header.button.${linkItem.tLabel}` as any)}
                    key={linkItem.tLabel}
                    active={isActive}
                    handleClick={clickEvents} />
                );
              })}
            </Stack>
          </ScrollArea>
          <Box pt="xl">
            <Divider variant="dashed" mb="md" />
            <Text size="xs" c="dimmed" ta="center" style={{ letterSpacing: '1px' }}>
              © 2026 KANJITOOL
            </Text>
          </Box>

        </Box>
      </Drawer>
    </>

  );
}