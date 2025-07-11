import jaconv
import unicodedata

vowel_mapping = {
    'a': 'あ',
    'i': 'い',
    'u': 'う',
    'e': 'い',
    'o': 'う',
    'A': 'あ',
    'I': 'い',
    'U': 'う',
    'E': 'い',
    'O': 'う',
}

def katakana_to_hiragana(text):
    """
    Convert a string from Katakana to Hiragana.

    Args:
        text (str): A string in Katakana.

    Returns:
        str: The converted string in Hiragana.
    """

    category = unicodedata.name('ょ', None)
    result = ""
    hiragana = jaconv.kata2hira(text)
    if len(hiragana) > 1:
        for i, char in enumerate(hiragana):
            if char == 'ー':
                vowel = unicodedata.name(hiragana[i - 1])[-1]
                result += vowel_mapping.get(vowel, vowel)
            else:
                result += char
    else:
        return jaconv.kata2hira(text)
    print(result)
    return result