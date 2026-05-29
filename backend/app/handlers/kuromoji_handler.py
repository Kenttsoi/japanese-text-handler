from pathlib import Path
import jpype
import jpype.imports

from flask import current_app
import pykakasi


class KuromojiHandler:
    def __init__(self, jar_core_path: Path = None, jar_path: Path = None):
        self.jar_path = Path(__file__).resolve().parent.parent / 'lib' / 'kuromoji-ipadic-0.9.0.jar'
        self.jar_core_path = Path(__file__).resolve().parent.parent / 'lib' / 'kuromoji-core-0.9.0.jar'

    def _start_jvm(self) -> bool:
        try:
            if not jpype.isJVMStarted():
                jpype.startJVM(classpath=[str(self.jar_path), str(self.jar_core_path)])
            return True
        except Exception as e:
            print(f"JVM execution failed: {e}")
            return False
        
    def _java_testing_message(self):
        try:
            from java.lang import String
            java_string = String("Hello from Java!")
            print(java_string.toUpperCase())
        except Exception as e:
            print(f"Java String calling failed: {e}")
            return None
        
    def _kuromoji_tokenize(self, text):
        try:
            import com.atilika.kuromoji.ipadic.Tokenizer as Tokenizer;
            tokenizer = Tokenizer()
            return tokenizer.tokenize(text)
        except Exception as e:
            print(f"Kuromoji tokenize failed: {e}")
            return None
        
    def _parse_tokens(self, tokens):
        print("[Kuromoji] Tokens:")
        try:
            data = []
            for token in tokens:
                print(token.getSurface(), '\t', token.getAllFeatures())
                surface = token.getSurface()
                features = token.getAllFeatures().split(',')
                data.append({
                    "original_text": str(surface),
                    "pos": str(features[0]),
                    "pos_detail1": str(features[1]),
                    "pos_detail2": str(features[2]),
                    "pos_detail3": str(features[3]),
                    "base_form": str(features[6]),
                    "reading": str(features[7]) if len(features) > 7 else None,
                    "pronunciation": str(features[8]) if len(features) > 8 else None
                })
            return data
        except Exception as e:
            print(f"Kuromoji parsing error: {e}")
            return None 

    def tokenize(self, text: str):
        if not self._start_jvm():
            return None
        
        self._java_testing_message()

        tokens_kuromoji = self._kuromoji_tokenize(text)
        if tokens_kuromoji is None:
            return None
        
        tokenized_result = self._parse_tokens(tokens_kuromoji)
        return tokenized_result

    def old_tokenize(self, text: str):
        """ Deprecated """

        print('entered', text)
        print(self.jar_path)

        if not jpype.isJVMStarted():
            jpype.startJVM(classpath=[str(self.jar_path), str(self.jar_core_path)])
        
        from java.lang import String

        java_string = String("Hello from Java!")
        print(java_string.toUpperCase())

        """ from org.atilika.kuromoji import Tokenizer """
        import com.atilika.kuromoji.ipadic.Tokenizer as Tokenizer;
        tokenizer = Tokenizer()
        tokens_kuromoji = tokenizer.tokenize(text)

        print("[Kuromoji] Tokens:")
        data = {}
        for token in tokens_kuromoji:
            print(token.getSurface(), '\t', token.getAllFeatures())
            surface = token.getSurface()
            features = token.getAllFeatures().split(',')
            data[surface] = {
                "pos": features[0],
                "pos_detail1": features[1],
                "pos_detail2": features[2],
                "pos_detail3": features[3],
                "base_form": features[6],
                "reading": features[7] if len(features) > 7 else None,
                "pronunciation": features[8] if len(features) > 8 else None
            }
        print(data)
        return data

        parsed2 = current_app.tagger.parse(text).splitlines()[:-1]
        print('[Mecab]', parsed2)

        kakasi = pykakasi.kakasi()
        parsed1 = kakasi.convert(text)
        print('[Pykakasi]', parsed1)

        