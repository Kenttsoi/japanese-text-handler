import React from 'react';
import { Container, Textarea, Paper } from '@mantine/core';
import { annotateTextSimple } from '../services/api';
import { Header } from '../components/Header';
import { RubyText } from '../components/RubyText';
import classes from './Annotator.module.css';

type AnnotatedText = {
  original: string[];
  result: string[];
  hiragana?: string[];
  katakana?: string[];
};

const Annotator: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const [result, setResult] = React.useState<AnnotatedText>({
    original: [],
    result: []
  });

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
      <h1>Annotator (Testing)</h1>
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
      <button onClick={handleAnnotate}>SHOW</button>
      <Container className="mainContentWidth">
        <Paper shadow="xs" p="xl" className={classes.displayPaper}>
          { result.result.length > 0 ?
            result.result.map((item, index) => {
              return (
                <RubyText
                  key={index}
                  text={result.original[index] ? result.original[index] : '' }
                  rubyText={result.result[index]}
                />
              )
            }) : <></>}
        </Paper>
      </Container>
    </>

  )
}

export default Annotator;