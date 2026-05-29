import React from 'react';
import { Container, Group, ActionIcon, Text, rem } from '@mantine/core';
import IconBrandGithub from '@tabler/icons-react/dist/esm/icons/IconBrandGithub.mjs';
import IconBrandLinkedin from '@tabler/icons-react/dist/esm/icons/IconBrandLinkedin.mjs';
import IconMail from '@tabler/icons-react/dist/esm/icons/IconMail.mjs';

export default function Footer() {
  return (
    <>
      <div style={{ marginTop: rem(120), borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Container size="md" py="xl">
          <Group justify="space-between">
            <Text fz="sm" c="dimmed">
              © 2026 Designed & Built by Kent
            </Text>

            <Group gap={0} justify="flex-end" wrap="nowrap">
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
              {/* <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandLinkedin style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon> */}
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconMail style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </div>
    </>
  )
}