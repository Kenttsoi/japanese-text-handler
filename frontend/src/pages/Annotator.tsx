import React from 'react';
import { Container, Textarea, Paper, Group, Text, Button, SegmentedControl, Chip, Select } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { convertJapaneseText, annotateTextSimple, annotateText, annotateSample } from '../services/api';
import { Header } from '../components/Header';
import { RubyText } from '../components/RubyText';
import classes from './Annotator.module.css';

type displayMode = 'original' | 'furigana' | 'hiragana' | 'katakana' | 'romaji' | 'pitch_accent';

const displayModes: { value: displayMode; label: string; disabled?: boolean }[] = [
  { value: 'original', label: 'Original', disabled: false },
  { value: 'furigana', label: 'Furigana' },
  { value: 'hiragana', label: 'Hiragana', disabled: false },
  { value: 'katakana', label: 'Katakana', disabled: false },
  { value: 'romaji', label: 'Romaji', disabled: true },
  { value: 'pitch_accent', label: 'Pitch Accent', disabled: true },
]
interface WordDict {
  original: string;
  hiragana: string;
  katakana: string;
  word_type: string;
}

type AnnotatedText = WordDict[];

const Annotator: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const [result, setResult] = React.useState<AnnotatedText>([]);
  const [displayMode, setDisplayMode] = React.useState<displayMode>('furigana');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAnnotate = async () => {
    console.log(text)
    try {
      const apiResult: AnnotatedText = await annotateTextSimple(text);
      console.log('[FUNCTION: handleAnnotate]', apiResult);
      setResult(apiResult);
    } catch (err) {
      console.error(err);
    }
  }

  const handleConvert = async () => {
    console.log('handleConvert', text);
    try {
      const apiResult: AnnotatedText = await convertJapaneseText(text);
      console.log('[FUNCTION: handleConvert]', apiResult);
      setResult(apiResult);
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    console.log('[USE EFFECT] Result updated:', displayMode);
  }, [displayMode]);

  return (
    <>
      <Header />
      <h1>Annotator</h1>
      <Container className="mainContentWidth">
        <Chip.Group>
          <Group justify="center">
            <Chip value="漢字" color="yellow" variant="light" onChange={() => setText("漢字")}>漢字</Chip>
            <Chip value="ひらがな" color="yellow" variant="light" onChange={() => setText("ひらがな")}>ひらがな</Chip>
            <Chip value="カタカナ" color="yellow" variant="light" onChange={() => setText("カタカナ")}>カタカナ</Chip>
            <Chip value="ローマ字" color="yellow" variant="light" onChange={() => setText("ローマ字")}>ローマ字</Chip>
            <Chip value="令和、誕生日、天上天下、お風呂に入る" color="yellow" variant="light" onChange={() => setText("令和、誕生日、天上天下、お風呂に入る")}>令和、誕生日、天上天下、お風呂に入る</Chip>
          </Group>
        </Chip.Group>
      </Container>
      <Container className="mainContentWidth">
        <Paper shadow="lg" radius="lg" p="xl">
          <Textarea
            variant="unstyled"
            placeholder="Please type your text here"
            autosize
            maxRows={10}
            className={classes.fullWidth}
            value={text}
            onChange={(e) => {
              console.log(e.target.value);
              setText(e.target.value);
            }}
          />
        </Paper>
      </Container>
      <br />
      <Container className="mainContentWidth">
        <Group align="center" justify="center">
          <Button
            variant="light" color="orange"
            onClick={handleAnnotate}
          >
            SHOW
          </Button>
          <Button
            variant="light" color="orange"
            onClick={handleConvert}
          >
            CONVERT
          </Button>
        </Group>
      </Container>
      <Container className="mainContentWidth">
        <Paper shadow="lg" radius="lg" p="xl" >
          <Group align="center" justify="space-between" className={classes.outputToolsTop}>
            <Text size="lg">Output</Text>
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
            {result.length > 0 ?
              result.map((item, index) => {
                switch (displayMode) {
                  case 'original':
                    return (
                      <span key={index}>{result[index]['original']}</span>
                    );
                  case 'furigana':
                    return (
                      <RubyText
                        key={index}
                        text={result[index]['original'] ? result[index]['original'] : ''}
                        rubyText={result[index]['hiragana']}
                      />
                    );
                  case 'hiragana':
                    return (
                      <span key={index}>{result[index]['hiragana']}</span>
                    );
                  case 'katakana':
                    return (
                      <span key={index}>{result[index]['katakana']}</span>
                    );
                }
              }) : <></>}
          </Paper>
          <Group align="center" justify="flex-end" className={classes.outputToolsBottom}>
            <Button
              variant="light" color="yellow"
            >
              Copy
            </Button>
            <Button
              variant="light" color="yellow"
            >
              Download
            </Button>
          </Group>
        </Paper>
      </Container>
    </>

  )
}

export default Annotator;