import React from 'react';
import { Container, Group, ActionIcon, Text, rem } from '@mantine/core';
import IconBrandGithub from '@tabler/icons-react/dist/esm/icons/IconBrandGithub.mjs';
import IconBrandLinkedin from '@tabler/icons-react/dist/esm/icons/IconBrandLinkedin.mjs';
import IconMail from '@tabler/icons-react/dist/esm/icons/IconMail.mjs';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <div style={{ marginTop: rem(120), borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Container size="md" py="xl">
          <Group justify="space-between">
            <Text fz="sm" c="dimmed">
              © 2026 {t('footer.ownerStatement')} Kent
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