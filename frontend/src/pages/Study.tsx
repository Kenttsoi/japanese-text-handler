import React from 'react';
import { Container, Skeleton, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Alert } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import DynamicKanaSlider from '@/components/study/DynamicKanaSlider';
import { KanaItem, VocabItems, KanjiItems } from '@/types';
import { vocabService } from '@/services/vocabService';
import { fetchFirstKanji, searchKanji } from '@/services/api';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch.mjs';
import VocabGrid from '@/components/study/VocabGrid';
import KanjiGrid from '@/components/study/KanjiGrid';
import { hiraganaData } from '@/data/kanaData';
import { katakanaData } from '@/data/kanaData';

const splitRomaji = (input: string): string[] => {
  const regex = /[bcdfghjklmnpqrstvwxyz]*[aeiou]|n(?![aeiou])/gi;
  return input.match(regex) || [];
};

const generateSearchTokens = (query: string): string[] => {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) return [];
  const hasNonEnglish = /[^\x00-\x7F]/.test(cleanQuery);
  if (hasNonEnglish) {
    return Array.from(cleanQuery);
  } else {
    return splitRomaji(cleanQuery);
  }
}

const filteredKana = (kanaData: KanaItem[], searchQuery: string): KanaItem[] => {
  console.log('filteredKana starts');
  if (!searchQuery.trim()) return kanaData;

  const tokens = generateSearchTokens(searchQuery);

  if (tokens.length === 0) return [];

  return kanaData.filter(item => {
    const itemKana = item.kana;
    const itemRomaji = item.romaji.toLowerCase();

    return tokens.some(token =>
      itemKana === token || itemRomaji === token
    );
  })
}

export default function Study() {
  // 1. Higher Priority for search bar render
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  // 2. Lower Priority for display
  const [displayQuery, setDisplayQuery] = React.useState<string>('');
  // 3. For the sending request in useEffect
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 1000);
  const [isPending, startTransition] = React.useTransition();
  /* const [hiraganaResult, setHiraganaResult] = React.useState<KanaItem[]>([]);
  const [katakanaResult, setKatakaanaResult] = React.useState<KanaItem[]>([]); */
  const [vocabResult, setVocabResult] = React.useState<VocabItems[]>([]);
  const [kanjiResult, setKanjiResult] = React.useState<KanjiItems[]>([]);
  const [isVocabCardLoading, setIsVocabCardLoading] = React.useState<boolean>(false);
  const [isKanjiCardLoading, setIsKanjiCardLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    async function fetchFirstVocab() {
      try {
        setIsVocabCardLoading(true);
        setError(null);

        const result = await vocabService.getAllVocab();
        if (result) {
          setVocabResult(result);
        } else {
          console.warn("Vocab service returned no data.");
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch vocab:", err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        setIsVocabCardLoading(false);
      }
    }
    fetchFirstVocab();

    return () => {
      controller.abort();
    }
  }, [])

  React.useEffect(() => {
    const controller = new AbortController();
    async function getFirstKanji() {
      try {
        setIsKanjiCardLoading(true);

        const response = await fetchFirstKanji(controller.signal);
        const { result: kanjiCardList, success } = response;
        if (success && kanjiCardList) {
          setKanjiResult(kanjiCardList);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch vocab:", err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        setIsKanjiCardLoading(false);
      }
    }
    getFirstKanji();

    return () => {
      controller.abort();
    }
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setSearchQuery(value);

    startTransition(() => {
      setDisplayQuery(value);
    });
  }

  const filteredHiragana = React.useMemo(() =>
    filteredKana(hiraganaData, displayQuery),
    [displayQuery, hiraganaData]
  );

  const filteredKatakana = React.useMemo(() =>
    filteredKana(katakanaData, displayQuery),
    [displayQuery, katakanaData]
  );

  React.useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setVocabResult([]);
      setKanjiResult([]);
      return;
    }

    const controller = new AbortController();

    const fetchAllData = async () => {
      setIsVocabCardLoading(true);
      setIsKanjiCardLoading(true);
      try {
        const [vocabData, kanjiData] = await Promise.all([
          vocabService.searchVocab(debouncedSearchQuery, controller.signal),
          searchKanji(debouncedSearchQuery, controller.signal)
        ]);
        setVocabResult(vocabData);
        if (kanjiData.success) {
          setKanjiResult(kanjiData.result);
        } else {
          throw new Error('Error occurred');
        }
        console.log('KanjiData', kanjiData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("[PARALLEL SEARCH ERROR] ", err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsVocabCardLoading(false);
          setIsKanjiCardLoading(false);
        }

      }
    }
    fetchAllData();
    return () => {
      controller.abort();
    };
  }, [debouncedSearchQuery])

  console.log("=== Component re-render ===");

  return (
    <Container size="md" py="xl" my="md">
      <TextInput
        placeholder="Search"
        size="lg"
        radius="xl"
        value={searchQuery}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        mb="xl"
        onChange={handleSearchChange}
        styles={(theme) => ({
          input: {
            '&:focus': { borderColor: theme.colors.orange[4] }
          }
        })}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Hiragana
      </Text>
      <DynamicKanaSlider
        kanaList={filteredHiragana} isLoading={isPending}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Katakana
      </Text>
      <DynamicKanaSlider
        kanaList={filteredKatakana} isLoading={isPending}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Vocabulary
      </Text>
      <VocabGrid isLoading={isVocabCardLoading} data={vocabResult} />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Kanji
      </Text>
      <KanjiGrid isLoading={isKanjiCardLoading} data={kanjiResult} />
    </Container>
  )
}
