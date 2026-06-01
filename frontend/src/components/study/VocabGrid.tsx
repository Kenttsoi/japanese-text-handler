import { SimpleGrid, Center, Text, Card, Stack } from '@mantine/core';
import React from 'react';
import VocabCard from './VocabCard';

interface VocabGridProps {
  isLoading: boolean;
  data: any[];
}

export default function VocabGrid({ isLoading, data }: VocabGridProps) {

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {
          Array.from({ length: 3 }).map((_, i) => (
            <VocabCard key={`skeleton-${i}`} isLoading={true} />
          ))
        }
      </SimpleGrid>

    );
  }

  if (!data || data.length === 0) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        <Card
          radius="lg"
          padding="xl"
          withBorder
          style={{
            borderStyle: 'dashed',
            borderColor: '#ced4da',
            backgroundColor: '#f8f9fa',
            height: 250,
          }}
        >
          <Center style={{ height: '100%', flexDirection: 'column' }}>
            <Text c="dimmed" fw={500} size="sm">
              No Result Found
            </Text>
          </Center>
        </Card>
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {
        data.map((item) => (
          <VocabCard key={item.id ? `vocabCard-${item.id}` : item.word} isLoading={false} data={item} />
        ))
      }
    </SimpleGrid>
  )
}