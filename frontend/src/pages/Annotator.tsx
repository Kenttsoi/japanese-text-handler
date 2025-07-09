import React from 'react';
import { Container, Textarea, Paper } from '@mantine/core';
import { annotateTextSimple } from '../services/api';
import { Header } from '../components/Header';
import classes from './Annotator.module.css';

const Annotator: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const [result, setResult] = React.useState<string>('');

  const handleAnnotate = async () => {
    console.log(text)
    try {
      const apiResult: string[][] = await annotateTextSimple(text);
      console.log('[FUNCTION: handleAnnotate]', apiResult);
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

      {/* <textarea value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Pls Type your Japanese Text here'
      /> */}
      <br />
      <button onClick={handleAnnotate}>SHOW</button>
      <Container className="mainContentWidth">
        <Paper shadow="xs" p="xl" className={classes.displayPaper}>
          {text}
        </Paper>
      </Container>
      <div>{result}</div>
    </>

  )
}

export default Annotator;