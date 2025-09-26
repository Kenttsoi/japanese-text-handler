from pathlib import Path
import jpype
import jpype.imports

from flask import current_app
import pykakasi


class KuromojiHandler:
    def __init__(self, jar_core_path: Path = None, jar_path: Path = None):
        self.jar_path = Path(__file__).resolve().parent.parent / 'lib' / 'kuromoji-ipadic-0.9.0.jar'
        self.jar_core_path = Path(__file__).resolve().parent.parent / 'lib' / 'kuromoji-core-0.9.0.jar'


    def tokenize(self, text: str):
        print('entered', text)
        print(self.jar_path) 
        jpype.startJVM(classpath=[str(self.jar_path), str(self.jar_core_path)]) # this line can issue, it needs to fix (should start JVM at the __init__.py)
        
        from java.lang import String

        java_string = String("Hello from Java!")
        print(java_string.toUpperCase())

        """ from org.atilika.kuromoji import Tokenizer """
        import com.atilika.kuromoji.ipadic.Tokenizer as Tokenizer;
        tokenizer = Tokenizer()
        tokens = tokenizer.tokenize(text)

        print("Tokens:")
        for token in tokens:
            print(token.getSurface(), '\t', token.getAllFeatures())

        kakasi = pykakasi.kakasi()
        parsed1 = kakasi.convert(text)
        print('[001]: pykakasi', parsed1)

        current_app.tagger
        parsed2 = current_app.tagger.parse(text).splitlines()[:-1]
        print('[002]: Mecab', parsed2)