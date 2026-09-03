import React from 'react';
import { Container, Skeleton, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Alert } from '@mantine/core';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import DynamicKanaSlider from '@/components/study/DynamicKanaSlider';
import { KanaItem, VocabItems, KanjiItems, VocabAPIResult } from '@/types';
import { vocabService } from '@/services/vocabService';
import { fetchFirstKanji, searchKanji } from '@/services/api';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch.mjs';
import VocabGrid from '@/components/study/VocabGrid';
import KanjiGrid from '@/components/study/KanjiGrid';
import { hiraganaData } from '@/data/kanaData';
import { katakanaData } from '@/data/kanaData';
import DataCards from '@/components/study/DataCards';
import { showErrorToast, showWarningToast } from '@/utils/notification';
import VocabModal from '@/components/layout/VocabModal';
import KanjiModal from '@/components/layout/KanjiModal';
import { useTranslation } from 'react-i18next';

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
  const [vocabResult, setVocabResult] = React.useState<VocabAPIResult>({ items: [], total: 0 });
  const [kanjiResult, setKanjiResult] = React.useState<KanjiItems[]>([]);
  const [totalVocabCount, setTotalVocabCount] = React.useState<number>(0);
  const [isVocabCardLoading, setIsVocabCardLoading] = React.useState<boolean>(false);
  const [isKanjiCardLoading, setIsKanjiCardLoading] = React.useState<boolean>(false);
  const [vocabDisplayCount, setVocabDisplayCount] = React.useState(6);
  const [kanjiDisplayCount, setKanjiDisplayCount] = React.useState(6);
  const [starredIds, setStarredIds] = useLocalStorage<number[]>({
    key: 'starred-vocabs',
    defaultValue: [],
  });
  const [error, setError] = React.useState<Error | null>(null);
  const [vocabModalOpen, setVocabModalOpen] = React.useState(false);
  const [kanjiModalOpen, setKanjiModalOpen] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const controller = new AbortController();
    async function fetchFirstVocab() {
      try {
        setIsVocabCardLoading(true);
        setError(null);

        const result = await vocabService.getAllVocab();
        if (result && result.data) {
          setVocabResult({ items: result.data, total: 9 });
          setVocabDisplayCount(6);
        } else {
          console.warn("Vocab service returned no data.");
          showWarningToast("Vocab service returned no data.");
        }
        if (result && result.count) {
          setTotalVocabCount(result.count);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch vocab:", err);
          // setError(err instanceof Error ? err : new Error('Unknown error'));
          showErrorToast(t('others.fetchFailed'));
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
          setKanjiDisplayCount(6);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch vocab:", err);
          // setError(err instanceof Error ? err : new Error('Unknown error'));
          showErrorToast(t('others.fetchFailed'));
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

  const handleToggleStar = (id: number) => {
    setStarredIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

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
      setVocabResult({ items: [], total: 0 });
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
        setVocabDisplayCount(6);
        if (kanjiData.success) {
          setKanjiResult(kanjiData.result);
          setKanjiDisplayCount(6);
        } else {
          showErrorToast(t('others.fetchFailed'));
          throw new Error('Error occurred');
        }
        console.log('KanjiData', kanjiData);
        console.log('VoacbData', vocabData.items, vocabData.total);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("[PARALLEL SEARCH ERROR] ", err);
          // setError(err instanceof Error ? err : new Error('Unknown error'));
          showErrorToast(t('others.fetchFailed'));
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

  const vocabItems = vocabResult.items;
  const vocabTotal = vocabResult.total;
  const visibleVocabItems = vocabItems.slice(0, vocabDisplayCount)
  const visibleKanjiItems = kanjiResult.slice(0, kanjiDisplayCount)

  return (
    <Container size="md" py="xl" my="md">
      <TextInput
        placeholder={t('studyPage.searchBarLabel')}
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
      <DataCards totalWords={totalVocabCount} favorites={starredIds.length} />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> {t('studyPage.hiraganaLabel')}
      </Text>
      <DynamicKanaSlider
        kanaList={filteredHiragana} isLoading={isPending}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> {t('studyPage.katakanaLabel')}
      </Text>
      <DynamicKanaSlider
        kanaList={filteredKatakana} isLoading={isPending}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> {t('studyPage.vocabSection.vocabLabel')}
      </Text>
      <VocabGrid isLoading={isVocabCardLoading} data={visibleVocabItems} starredIds={starredIds} onToggleStar={handleToggleStar} />
      {vocabTotal > 6 && (
        <Group justify='right' mt='md'>
          {vocabDisplayCount === 6 ? (
            <Button variant="light" onClick={() => setVocabDisplayCount(12)}>
              {t('studyPage.general.showMoreButton')}
            </Button>
          ) : vocabDisplayCount === 12 && vocabTotal > 12 ? (
            <Button variant="outline" onClick={() => setVocabModalOpen(true)}>
              {t('studyPage.general.showAllButton.part1')}{vocabTotal}{t('studyPage.general.showAllButton.part2')}
            </Button>
          ) : null}
        </Group>
      )}
      <VocabModal opened={vocabModalOpen} onClose={() => setVocabModalOpen(false)} query={debouncedSearchQuery} total={vocabTotal} starredIds={starredIds} onToggleStar={handleToggleStar} />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> {t('studyPage.kanjiSection.kanjiLabel')}
      </Text>
      <KanjiGrid isLoading={isKanjiCardLoading} data={visibleKanjiItems} />
      {kanjiResult.length > 6 && (
        <Group justify='right' mt='md'>
          {kanjiDisplayCount === 6 ? (
            <Button variant="light" onClick={() => setKanjiDisplayCount(12)}>
              {t('studyPage.general.showMoreButton')}
            </Button>
          ) : kanjiDisplayCount === 12 && kanjiResult.length > 12 ? (
            <Button variant="outline" onClick={() => setKanjiModalOpen(true)}>
              {t('studyPage.general.showAllButton.part1')}{kanjiResult.length}{t('studyPage.general.showAllButton.part2')}
            </Button>
          ) : null}
        </Group>
      )}
      <KanjiModal opened={kanjiModalOpen} onClose={() => setKanjiModalOpen(false)} query={debouncedSearchQuery} total={kanjiResult.length} />
    </Container>
  )
}
