import React from 'react';
import { TextInput, ScrollArea, Group, Paper, Text, Stack, Title, Container } from '@mantine/core';
import { KanaItem } from '@/types';
import KanaCard from './KanaCard';

interface DynamicKanaSliderProps {
  kanaList: KanaItem[];
}

export default function DynamicKanaSlider({ kanaList }: DynamicKanaSliderProps) {
  return (
    <Paper shadow="xs" p="lg" radius="lg" bg="white" withBorder>
      <ScrollArea w="100%" pb="xs" scrollbarSize={6}>
        <Group wrap="nowrap" gap="sm">
          {kanaList.map((item) => (
            <KanaCard kanaList={item}/>
          ))}
        </Group>
      </ScrollArea>
    </Paper>
  )
}