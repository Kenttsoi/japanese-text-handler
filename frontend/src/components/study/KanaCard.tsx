import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Badge } from '@mantine/core';
import { KanaItem } from '@/types';

interface KanaCardProps {
  kanaData: KanaItem
}

export default function KanaCard({ kanaData }: KanaCardProps) {
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