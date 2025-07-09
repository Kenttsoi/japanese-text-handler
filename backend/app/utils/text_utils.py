import jaconv

def katakana_to_hiragana(text):
    """
    Convert a string from Katakana to Hiragana.

    Args:
        text (str): A string in Katakana.

    Returns:
        str: The converted string in Hiragana.
    """
    return jaconv.kata2hira(text)