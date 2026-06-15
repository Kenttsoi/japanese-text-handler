import React from 'react';
import { Skeleton, Text, Stack, Paper } from '@mantine/core';
import { KanaItem } from '@/types';

interface KanaCardProps {
  kanaData?: KanaItem;
  isLoading: boolean;
}

export default function KanaCard({ kanaData, isLoading }: KanaCardProps) {
  if (isLoading) {
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
  }

  if (!kanaData) return null;

  return (
    <Paper
      p="sm"
      radius="md"
      bg="#FFF0F0"
      key={kanaData.kana}
      styles={{
        root: {
          width: 90,
          flexShrink: 0,
        }
      }}
    >
      <Stack align="center" gap={4}>
        <Text size="32px" fw={500} c="#4A4A4A">
          {kanaData.kana}
        </Text>
        <Text size="sm" c="dimmed">
          {kanaData.romaji}
        </Text>
      </Stack>
    </Paper>
  )
}