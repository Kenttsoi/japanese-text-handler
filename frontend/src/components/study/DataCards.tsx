import React from 'react';
import { Paper, SimpleGrid, Text } from '@mantine/core';

interface DataCardsProps {
  totalWords: number;
  favorites: number;
  /* categories: number;
  showing: number; */
}

export default function DataCards({ totalWords, favorites, /* categories, showing */ }: DataCardsProps) {
  const stats = [
    { title: 'Total Words', value: totalWords, color: 'pink' },
    { title: 'Favorites', value: favorites, color: 'orange' },
    /* { title: 'Categories', value: categories, color: 'teal' },
    { title: 'Showing', value: showing, color: 'orange' }, */
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 2, md: 2 }} spacing="md">
      {stats.map((stat) => (
        <Paper withBorder p="md" radius="lg" key={stat.title} ta="center" styles={{ root: { backgroundColor: 'white' } }}>
          <Text fz={32} fw={400} c={stat.color}>
            {stat.value}
          </Text>
          <Text fz="sm" c="dimmed" mt={5}>
            {stat.title}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  )
}