import React from 'react';
import { Skeleton, Text, Stack, Paper } from '@mantine/core';
import { KanaItem } from '@/types';

interface KanaCardProps {
  kanaData?: KanaItem;
  isLoading: boolean;
}

export default function KanaCard({ kanaData, isLoading }: KanaCardProps) {
  /* if (isLoading) {
    return (
      <Paper
        p="sm"
        radius="md"
        bg="#F8F9FA"
        styles={{
          root: {
            width: 90,
            flexShrink: 0,
          }
        }}
      >
        <Stack align="center" gap={4}>
          <Skeleton height={38} width="80%" radius="sm" animate={true} />
          <Skeleton height={16} width="50%" radius="sm" animate={true} />
        </Stack>
      </Paper>
    )
  } */

  if (!kanaData) return null;

  return (
    <Paper
      p="sm"
      radius="md"
      bg="light-dark(#FFF0F0, var(--mantine-color-dark-5))"
      key={kanaData.kana}
      styles={{
        root: {
          width: 90,
          flexShrink: 0,
        },
      }}
      style={{
        opacity: isLoading ? 0.6 : 1,
        transition: 'opacity 0.15s ease-in-out',
        border: '1px solid light-dark(transparent, var(--mantine-color-dark-4))',
      }}
    >
      <Stack align="center" gap={4}>
        <Text size="32px" fw={500} c="light-dark(#4A4A4A, var(--mantine-color-gray-0))">
          {kanaData.kana}
        </Text>
        <Text size="sm" c="dimmed">
          {kanaData.romaji}
        </Text>
      </Stack>
    </Paper>
  )
}