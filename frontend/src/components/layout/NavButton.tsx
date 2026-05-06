import React, { ReactNode } from 'react';
import { Group, UnstyledButton, Text, Box } from '@mantine/core';
import IconChevronRight from '@tabler/icons-react/dist/esm/icons/IconChevronRight.mjs';

interface NavButtonProps {
  icon: ReactNode,
  label: string,
  active: boolean,
  onClick?: () => void
}

export default function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <UnstyledButton
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        background: active ? 'light-dark(rgba(245,158,11,0.1), rgba(255,255,255,0.05))' : 'transparent'
      }}
    >
      <Group justify="space-between">
        <Group gap="md">
          <Box c={active ? 'orange.6' : 'inherit'}>{icon}</Box>
          <Text size="lg" fw={500}>{label}</Text>
        </Group>
        <IconChevronRight size={16} opacity={0.3} />
      </Group>
    </UnstyledButton>
  )
}