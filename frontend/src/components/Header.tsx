import React from 'react';
import { Burger, Center, Container, Group, Menu, Drawer, Box, Modal, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/annotate', label: 'Annotator' }
];

export function Header() {
  // const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [opened, { toggle }] = useDisclosure(false);
  const items = links.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <>
      <header className={classes.header}>
        <Container size="md">
          <div className={classes.inner}>
            <Group className={classes.fullWidth} justify="flex-end" gap={5} visibleFrom="sm">
              {items}
            </Group>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          </div>
        </Container>
      </header>

      <Drawer
        opened={opened}
        onClose={toggle}
        title="Menu"
        style={{ zIndex: 2000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        Menu Content Test
      </Drawer>
    </>

  );
}