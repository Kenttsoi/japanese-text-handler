import React from 'react';
import { Container, Skeleton, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Alert } from '@mantine/core';
import DynamicKanaSlider from '@/components/study/DynamicKanaSlider';
import VocabCard from '@/components/study/VocabCard';
import { KanaItem, VocabItems, KanjiItems } from '@/types';
import { vocabService } from '@/services/vocabService';
import { fetchFirstKanji } from '@/services/api';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch.mjs';
import VocabGrid from '@/components/study/VocabGrid';
import KanjiGrid from '@/components/study/KanjiGrid';

const hiraganaData: KanaItem[] = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
  { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
  { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
  { kana: 'や', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ゆ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'よ', romaji: 'yo' },
  { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
  { kana: 'わ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'を', romaji: 'wo' },
  { kana: 'ん', romaji: 'n' },
];

const katakanaData: KanaItem[] = [
  { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
  { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
  { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
  { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
  { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
  { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
  { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
  { kana: 'ヤ', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ユ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'ヨ', romaji: 'yo' },
  { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
  { kana: 'ワ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'ヲ', romaji: 'wo' },
  { kana: 'ン', romaji: 'n' },
];

const MOCK_KANJI_DATA = [
  {
    literal: "生",
    jlpt: "N5",
    on_readings: "セイ, ショウ",
    kun_readings: "い.きる, う.まれる, お.う, は.える, なま",
    nanori_readings: "あさ, いき, いく, いけ, うぶ",
    meaning: "life, genuine, birth, live, grow"
  },
  {
    literal: "新",
    jlpt: "N4",
    on_readings: "シン",
    kun_readings: "あたら.しい, あら.た, にい",
    nanori_readings: "あら, にい, し",
    meaning: "new, fresh"
  },
  {
    literal: "情",
    jlpt: "N3",
    on_readings: "ジョウ, セイ",
    kun_readings: "なさ.け",
    nanori_readings: "こころ, もと",
    meaning: "emotion, feeling, passion, sympathy, circumstances, facts"
  },
  {
    literal: " 々", // 拿來測試常用外或特殊符號
    jlpt: undefined, // 沒有 JLPT
    on_readings: "---",
    kun_readings: "---",
    nanori_readings: "---",
    meaning: "repetition mark, iteration mark"
  },
  {
    literal: "鬱",
    jlpt: "N1",
    on_readings: "ウツ",
    kun_readings: "ふさ.ぐ, しげ.る",
    nanori_readings: "---",
    meaning: "gloom, depression, melancholy, dense, mist"
  }
];

/* const mockVocab: VocabItems[] = [
  { id: 1, word: '日本語', reading: 'にほんご', meaning_ch: '日語', jlpt_level: 'N5', pos: '名詞' },
  { id: 2, word: '美味しい', reading: 'おいしい', meaning_ch: '好吃的、美味的', pos: '形容詞' },
]; */

export default function Study() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [vocabResult, setVocabResult] = React.useState<VocabItems[]>([]);
  const [kanjiResult, setKanjiResult] = React.useState<KanjiItems[]>([]);
  const [isVocabCardLoading, setIsVocabCardLoading] = React.useState<boolean>(true);
  const [isKanjiCardLoading, setIsKanjiCardLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  /* React.useEffect(() => {
    let isMounted = true;

    async function fetchFirstVocab() {
      try {
        setIsVocabCardLoading(true);
        setError(null);

        const result = await vocabService.getAllVocab();

        if (isMounted) {
          if (result) {
            setVocabResult(result);
          } else {
            console.warn("Vocab service returned no data.");
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch vocab:", err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsVocabCardLoading(false);
        }
      }
    }
    fetchFirstVocab();

    return () => {
      isMounted = false;
    };
  }, []) */

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
        if (err.name === 'AbortError') {
          console.log("Vocab fetch was cancelled via AbortController");
        } else {
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
        if (err.name === 'AbortError') {
          console.log('GET request has been cancelled');
        } else {
          console.error('Real API error:', err);
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

  const filteredHiragana = hiraganaData.filter(item =>
    item.kana.includes(searchQuery) || item.romaji.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKatakana = katakanaData.filter(item =>
    item.kana.includes(searchQuery) || item.romaji.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container size="md" py="xl" my="md">
      <TextInput
        placeholder="Search"
        size="lg"
        radius="xl"
        value={""}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        mb="xl"
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
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
        kanaList={hiraganaData}
      />
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Katakana
      </Text>
      <DynamicKanaSlider
        kanaList={katakanaData}
      />

      {/* <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Hiragana
      </Text>
      <Paper shadow="xs" p="lg" radius="lg" bg="white" withBorder>
        <SimpleGrid
          cols={5}
          spacing="xs"
          verticalSpacing="md"
        >
          {hiraganaData.map((item) => (
            <Paper
              p="sm"
              radius="md"
              bg="#FFF0F0"
              key={item.kana}
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
          ))}
        </SimpleGrid>
      </Paper>
      <Text size="xl" fw={700} my="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF87B2' }}>✨</span> Katakana
      </Text>
      <Paper shadow="xs" p="lg" radius="lg" bg="white" withBorder>
        <SimpleGrid
          cols={5}
          spacing="xs"
          verticalSpacing="md"
        >
          {katakanaData.map((item) => (
            <Paper
              p="sm"
              radius="md"
              bg="#FFF0F0"
              key={item.kana}
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
          ))}
        </SimpleGrid>
      </Paper> */}

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
