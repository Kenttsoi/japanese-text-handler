import { SimpleGrid } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import VocabCard from './VocabCard';
import { CardGridProps } from '@/types';
import NoResultFoundUI from '../NoResultFoundUI';

interface VocabCardGridProps extends CardGridProps {
  starredIds: number[],
  onToggleStar: (id: number) => void
}

export default function VocabGrid({ isLoading, data, starredIds, onToggleStar}: VocabCardGridProps) {

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {
          Array.from({ length: 3 }).map((_, i) => (
            <VocabCard key={`skeleton-vocabCard-${i}`} isLoading={true} isStarred={false} onToggle={() => {}}/>
          ))
        }
      </SimpleGrid>

    );
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
          <VocabCard
            key={item.id ? `vocabCard-${item.id}` : item.word}
            isLoading={false}
            data={item}
            isStarred={starredIds.includes(item.id)}
            onToggle={() => onToggleStar(item.id)}
          />
        ))
      }
    </SimpleGrid>
  )
}