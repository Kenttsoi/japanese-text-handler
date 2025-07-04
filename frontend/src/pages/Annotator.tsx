import React from 'react';
import { annotateText } from '../services/api';
import { Header } from '../components/Header';

const Annotator: React.FC = () => {
  const [text, setText] = React.useState<string>('');
  const [result, setResult] = React.useState('');

  const handleAnnotate = async () => {
    try {
      const apiResult = await annotateText(text);
      console.log(apiResult);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Header />
      <div>Annotator (Testing)</div>
      <textarea value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Pls Type your Japanese Text here'
      />
      <br />
      <button onClick={handleAnnotate}>SHOW</button>
      <div>{result}</div>
    </>

  )
}

export default Annotator;