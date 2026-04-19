import React from 'react';
import { Anchor, Burger, Center, Button, Group, Drawer, Grid, ActionIcon, Tabs, rem, Text, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowScroll } from '@mantine/hooks';
import IconSun from '@tabler/icons-react/dist/esm/icons/IconSun.mjs';
import IconMoon from '@tabler/icons-react/dist/esm/icons/IconMoon.mjs';
import IconLanguageHiragana from '@tabler/icons-react/dist/esm/icons/IconLanguageHiragana.mjs';
import cx from 'clsx';
import { motion } from 'framer-motion';

const links = [
  { link: '/', label: 'Home' },
  { link: '/annotate', label: 'Annotator' },
  { link: '/test', label: 'Testing' }
];

const navItems = links;

export const Header: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const scrolled = scroll.y > 50;
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const items = links.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => {
          event.preventDefault();
          navigate(link.link);
        }}
      >
        {link.label}
      </a>
    );
  });

  const mobileItems = links.map((link) => {
    return (
      <Grid.Col span={12} className={classes.mobileMenuCol}>
        <Anchor
          key={link.label}
          href={link.link}
          c="white"
          underline='never'
          onClick={(event) => event.preventDefault()}
        >
          {link.label}
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
            onChange={(value) => navigate(value || '/')}
          >
            <Tabs.List style={{ display: 'flex', gap: rem(4), position: 'relative' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.link;

                return (
                  <Tabs.Tab
                    key={item.link}
                    value={item.link}
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
                      {item.label}
                    </Text>
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
          <div className={classes.section} style={{ justifyContent: 'flex-end' }}>
            <Group gap={10} visibleFrom="sm">
              <ActionIcon variant="default" size="lg" bd={0}>
                <IconLanguageHiragana stroke={2} />
              </ActionIcon>
              <ActionIcon
                variant="default"
                size="lg"
                bd={0}
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle color scheme"
              >
                <IconSun stroke={2} className={cx(classes.light)}/>
                <IconMoon stroke={2} className={cx(classes.dark)}/>
              </ActionIcon>
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