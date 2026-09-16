import React from 'react';
import { TextInput, ScrollArea, Group, Paper, Text, Stack, Title, Container } from '@mantine/core';
import { KanaItem } from '@/types';
import KanaCard from './KanaCard';
import NoResultFoundUI from '../NoResultFoundUI';
import { usePanScroll } from '@/utils/usePanScroll';

interface DynamicKanaSliderProps {
  kanaList: KanaItem[];
  isLoading: boolean;
}

export default function DynamicKanaSlider({ kanaList, isLoading }: DynamicKanaSliderProps) {
  const { viewportRef, isDragging, panProps } = usePanScroll();

  /* if (isLoading) {
    return (
      <Paper shadow="xs" p="lg" radius="lg" bg="white" withBorder>
        <ScrollArea
        >
          <Group wrap="nowrap" gap="sm">
            {
              Array.from({ length: 3 }).map((_, i) => (
                <KanaCard key={`skeleton-kanaCard-${i}`} isLoading={isLoading} />
              ))
            }
          </Group>
        </ScrollArea>
      </Paper>
    )
  } */

  if (!kanaList || kanaList.length === 0) {
    return (
      <NoResultFoundUI />
    );
  }

  return (
    <Paper shadow="xs" p="lg" radius="lg" bg="light-dark(#ffffff, var(--mantine-color-dark-6))" withBorder>
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
            item.kana ? <KanaCard key={`kana_${item.kana}`} kanaData={item} isLoading={isLoading} /> : null
          ))}
        </Group>
      </ScrollArea>
    </Paper>
  )
}