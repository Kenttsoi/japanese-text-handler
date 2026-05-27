import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Badge } from '@mantine/core';

export default function KanaCard({ ...item }) {
  return (
    <Paper
      p="sm"
      radius="md"
      bg="#FFF0F0"
      key={item.kana}
      styles={{
        root: {
          width: 90,
          flexShrink: 0,
        }
      }}
    >
      <Stack align="center" gap={4}>
        <Text size="32px" fw={500} c="#4A4A4A">
          {item.kana}
        </Text>
        <Text size="sm" c="dimmed">
          {item.romaji}
        </Text>
      </Stack>
    </Paper>
  )
}