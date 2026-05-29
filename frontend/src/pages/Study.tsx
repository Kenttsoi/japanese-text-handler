import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Box, SimpleGrid, Paper, Center, TextInput, Card, Badge } from '@mantine/core';
import DynamicKanaSlider from '@/components/study/DynamicKanaSlider';
import VocabCard from '@/components/study/VocabCard';
import { KanaItem } from '@/types';
import { vocabService } from '@/services/vocabService';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch.mjs';

interface VocabItems {
  id: number,
  word: string,
  reading: string,
  meaning_ch: string,
  jlpt_level_1?: string | null,
  pos?: string | null
}

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

const mockVocab: VocabItems[] = [
  { id: 1, word: '日本語', reading: 'にほんご', meaning_ch: '日語', jlpt_level: 'N5', pos: '名詞' },
  { id: 2, word: '美味しい', reading: 'おいしい', meaning_ch: '好吃的、美味的', pos: '形容詞' },
];

export default function Study() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [vocabResult, setVocabResult] = React.useState<VocabItems[]>([]);

  React.useEffect(() => {
    async function fetchFirstVocab() {
      const result = await vocabService.getAllVocab();
      if (result) {
        setVocabResult(result);
      }
    }
    fetchFirstVocab();
  }, [])

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
      <Box>
        <Group gap="md" grow justify="space-between">
          {vocabResult.map((item, index) => (
            <VocabCard
              key={item.id ? item.id : item.word}
              {...item}
            />
          ))}
        </Group>
      </Box>

    </Container>
  )
}
