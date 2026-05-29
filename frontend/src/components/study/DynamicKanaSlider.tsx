import React from 'react';
import { TextInput, ScrollArea, Group, Paper, Text, Stack, Title, Container } from '@mantine/core';
import { KanaItem } from '@/types';
import KanaCard from './KanaCard';
import { usePanScroll } from '@/utils/usePanScroll';

interface DynamicKanaSliderProps {
  kanaList: KanaItem[];
}

export default function DynamicKanaSlider({ kanaList }: DynamicKanaSliderProps) {
  const { viewportRef, isDragging, panProps } = usePanScroll();

  return (
    <Paper shadow="xs" p="lg" radius="lg" bg="white" withBorder>
      <ScrollArea
        w="100%"
        pb="xs"
        scrollbarSize={6}
        viewportRef={viewportRef}
        {...panProps}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
      >
        <Group wrap="nowrap" gap="sm">
          {kanaList.map((item) => (
            item.kana ? <KanaCard key={`kana_${item.kana}`} kanaData={item} /> : null
          ))}
        </Group>
      </ScrollArea>
    </Paper>
  )
}