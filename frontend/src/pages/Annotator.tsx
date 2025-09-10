import React from 'react';
import { Container, Textarea, Paper, Group, Text, Button, SegmentedControl } from '@mantine/core';
import { annotateTextSimple } from '../services/api';
import { Header } from '../components/Header';
import { RubyText } from '../components/RubyText';
import classes from './Annotator.module.css';

type displayMode = 'Original' | 'Furigana' | 'Hiragana' | 'Katakana' | 'Romaji' | 'Pitch Accent';

const displayModes: { value: displayMode; label: displayMode; disabled?: boolean }[] = [
  { value: 'Original', label: 'Original', disabled: true },
  { value: 'Furigana', label: 'Furigana' },
  { value: 'Hiragana', label: 'Hiragana', disabled: true },
  { value: 'Katakana', label: 'Katakana', disabled: true },
  { value: 'Romaji', label: 'Romaji', disabled: true },
  { value: 'Pitch Accent', label: 'Pitch Accent', disabled: true },
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

  return (
    <>
      <Header />
      <h1>Annotator</h1>
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
        <Button
          variant="light" color="orange"
          onClick={handleAnnotate}
        >
          SHOW
        </Button>
      </Container>
      <Container className="mainContentWidth">
        <Paper shadow="lg" radius="lg" p="xl" >
          <Group align="center" justify="space-between" className={classes.outputToolsTop}>
            <Text size="lg">Output</Text>
            <Group align="center" justify="flex-end">
              <SegmentedControl defaultValue="Furigana" radius="md" color="yellow" data={displayModes} />
            </Group>
          </Group>
          <Paper shadow="xs" radius="md" p="xl" className={classes.displayPaper}>
            {result.length > 0 ?
              result.map((item, index) => {
                return (
                  <RubyText
                    key={index}
                    text={result[index]['original'] ? result[index]['original'] : ''}
                    rubyText={result[index]['hiragana']}
                  />
                )
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