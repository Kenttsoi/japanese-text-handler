import React from 'react';
import { Anchor, Burger, Center, Container, Group, Drawer, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@mantine/hooks';

const links = [
  { link: '/', label: 'Home' },
  { link: '/annotate', label: 'Annotator' }
];

export const Header: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
  const scrolled = scroll.y > 50;
  
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
            <Group justify="flex-end" gap={5} visibleFrom="sm" style={{ flex: 1 }}>
              {items}
            </Group>
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