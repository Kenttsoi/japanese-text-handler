def katakana_to_hiragana(text):
    return ''.join(
        chr(ord(char) - 0x60) if '\u30A1' <= char <= '\u30F6' else char
        for char in text
    )