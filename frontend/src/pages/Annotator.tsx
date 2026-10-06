import React from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Stack, Badge, Textarea, Paper, Group, Text, Button, SegmentedControl, Chip, Select, Center, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { convertJapaneseText } from '../services/api';
import { RubyText } from '../components/RubyText';
import classes from './Annotator.module.css';
import AnimatedConvertButton from '../components/annotator/AnimatedConvertButton';
import { useTranslation } from 'react-i18next';
import { showErrorToast, showWarningToast } from '../utils/notification';
import { ApiResponse, KanjiAnnotatedDictItem } from '@/types';

type displayMode = 'original' | 'furigana' | 'hiragana' | 'katakana' | 'romaji' | 'pitch_accent';

const Annotator: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<KanjiAnnotatedDictItem[]>([]);
  const [displayMode, setDisplayMode] = React.useState<displayMode>('furigana');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation();

  const displayModes: { value: displayMode; label: string; disabled?: boolean }[] = [
    { value: 'original', label: t('annotator.displayMode.original'), disabled: false },
    { value: 'furigana', label: t('annotator.displayMode.furigana') },
    { value: 'hiragana', label: t('annotator.displayMode.hiragana'), disabled: true },
    { value: 'katakana', label: t('annotator.displayMode.katakana'), disabled: false },
    { value: 'romaji', label: t('annotator.displayMode.romaji'), disabled: true },
    { value: 'pitch_accent', label: t('annotator.displayMode.pitchAccent'), disabled: true },
  ]

  const handleConvert = async () => {

    if (!text.trim()) {
      showWarningToast(t('others.notification.errorMessage.INVALID_INPUT'));
      return;
    }

    setLoading(true);
    try {
      const apiRes: ApiResponse<KanjiAnnotatedDictItem[]> = await convertJapaneseText(text);

      if (apiRes.success && apiRes.result) {
        setResult(apiRes.result);
        return;
      }

      setResult([]);

      switch (apiRes.code) {
        case "MISSING_TEXT":
        case "INVALID_INPUT":
          showWarningToast(t('others.notification.errorMessage.INVALID_INPUT'));
          break;
        case 'PAYLOAD_TOO_LARGE':
          showErrorToast(t('others.notification.errorMessage.PAYLOAD_TOO_LARGE'));
          break;
        case 'UNSAFE_CONTENT_DETECTED':
          showErrorToast(t('others.notification.errorMessage.UNSAFE_CONTENT_DETECTED'));
          break;
        case 'NETWORK_ERROR':
          showErrorToast(t('others.notification.errorMessage.NETWORK_ERROR'));
          break;
        default:
          showErrorToast(apiRes.message || t('others.notification.errorMessage.default'));
          break;
      }

    } catch (err) {
      console.error(err);
      setResult([]);
      showErrorToast(t('others.notification.errorMessage.catchedError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className={classes.contentWrapper}>
        <Stack align="center" justify="center" gap={0} mt="xl" mb="xl">
          <Group gap="xs" align="center" justify="center">
            <Title
              order={1}
              style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                lineHeight: 1
              }}
            >
              {t('annotator.title')}
            </Title>

            <Badge
              variant="dot"
              color="blue"
              size="lg"
              style={{ textTransform: 'none' }}
            >
              v1.0 Beta
            </Badge>
          </Group>
          <Text c="dimmed" size="sm" fw={500} mt="xs">
            {t('annotator.slogan')}
          </Text>
        </Stack>
        <Container className="mainContentWidth">
          <Chip.Group>
            <Group justify="center">
              <Chip value="漢字" color="yellow" variant="light" onChange={() => setText("漢字")}>漢字</Chip>
              <Chip value="ひらがな" color="yellow" variant="light" onChange={() => setText("ひらがな")}>ひらがな</Chip>
              <Chip value="カタカナ" color="yellow" variant="light" onChange={() => setText("カタカナ")}>カタカナ</Chip>
              <Chip value="ローマ字" color="yellow" variant="light" onChange={() => setText("ローマ字")}>ローマ字</Chip>
            </Group>
          </Chip.Group>
        </Container>
        <Container className="mainContentWidth">
          <Paper shadow="sm" radius="lg" p="xl" withBorder className={classes.inputContainer}>
            <Textarea
              variant="unstyled"
              placeholder={t('annotator.inputLabel')}
              autosize
              maxRows={10}
              className={classes.textareaInput}
              value={text}
              onChange={(e) => {
                setText(e.currentTarget.value);
              }}
            />
          </Paper>
        </Container>
        <br />
        <Container className="mainContentWidth">
          <Group align="center" justify="center">
            <AnimatedConvertButton onClick={handleConvert} loading={loading}/>
          </Group>
        </Container>
        <Container className="mainContentWidth">
          <Paper shadow="lg" radius="lg" p="xl" className={classes.resultContainer}>
            <Group align="center" justify="space-between" className={classes.outputToolsTop}>
              <Text size="lg">{t('annotator.outputLabel')}</Text>
              <Group align="center" justify="flex-end">
                {
                  isMobile ?
                    <Select
                      label=""
                      placeholder="Pick value"
                      checkIconPosition="right"
                      data={displayModes}
                      defaultValue="furigana"
                      value={displayMode ? displayMode : null}
                      onChange={(_value) => setDisplayMode(_value as displayMode)}
                    /> :
                    <SegmentedControl
                      defaultValue="furigana"
                      radius="md"
                      color="yellow"
                      data={displayModes}
                      value={displayMode}
                      onChange={(_value) => setDisplayMode(_value as displayMode)}
                    />
                }
              </Group>
            </Group>
            <Paper shadow="xs" radius="md" p="xl" className={classes.displayPaper}>
              {loading ? (
                <Center h="100%">
                  <Loader size="md" />
                </Center>
              ) : (result.length > 0 ?
                result.map((item, index) => {
                  if (item.original === '\\n') {
                    return (
                      <React.Fragment key={index}>
                        <br />
                        <br />
                      </React.Fragment>
                    )
                  }
                  switch (displayMode) {
                    case 'original':
                      return (
                        <span key={index}>{result[index]['original']}</span>
                      );
                    case 'furigana':
                      if (item.word_type === 'kanji' && item.kanji_breakdown.length > 0) {
                        const isOneToOne = item.kanji_breakdown.length === item.original.length;
                        const isBlockRuby = item.kanji_breakdown.length === 1 && item.original.length > 1;
                        if (isOneToOne) {
                          return item.kanji_breakdown.map((kanji_reading, kanji_index) => (
                            <RubyText
                              key={`${index}-${kanji_index}`}
                              text={item.original[kanji_index]}
                              rubyText={kanji_reading === item.original[kanji_index] ? '' : kanji_reading}
                            />
                          ))
                        }
                        if (isBlockRuby) {
                          return (
                            <RubyText
                              key={index}
                              text={item.original}
                              rubyText={item.kanji_breakdown[0]}
                            />
                          )
                        }
                      }
                      return (
                        <RubyText
                          key={index}
                          text={result[index]['original'] ? result[index]['original'] : ''}
                          rubyText={''}
                        />
                      )
                    case 'hiragana':
                      return (
                        <span key={index}>{result[index]['hiragana']}</span>
                      );
                    case 'katakana':
                      return (
                        <span key={index}>{result[index]['katakana']}</span>
                      );
                  }
                }) : <></>)}
            </Paper>
            <Group align="center" justify="flex-end" className={classes.outputToolsBottom}>
              <Button
                variant="light" color="yellow" disabled={true}
              >
                {t('annotator.copyButton')}
              </Button>
              <Button
                variant="light" color="yellow" disabled={true}
              >
                {t('annotator.downloadButton')}
              </Button>
            </Group>
          </Paper>
        </Container>
      </main>
    </>

  )
}

export default Annotator;