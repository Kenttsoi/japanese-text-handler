import { SimpleGrid } from '@mantine/core';
import KanjiCard from './KanjiCard';
import { CardGridProps } from '@/types';
import NoResultFoundUI from '../NoResultFoundUI';

export default function KanjiGrid({ isLoading, data }: CardGridProps) {

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {
          Array.from({ length: 3 }).map((_, i) => (
            <KanjiCard key={`skeleton-kanjiCard-${i}`} isLoading={true} />
          ))
        }
      </SimpleGrid>
    )
  }

  if (!data || data.length === 0) {
    return (
      <NoResultFoundUI />
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {
        data.map((item) => (
          <KanjiCard key={item.id ? `kanjiCard-${item.id}` : item.literal} isLoading={false} data={item} />
        ))
      }
    </SimpleGrid>
  )
}