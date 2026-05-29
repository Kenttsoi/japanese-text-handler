from pathlib import Path
from flask import current_app
import requests
import gzip
import os

KANJIDIC_URL = "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz"

def load_kanjidic():
    data_dir = Path(current_app.root_path) / 'data' / 'kanjidic2'
    xml_path = data_dir / 'kanjidic2.xml'

    if xml_path.exists():
        current_app.logger.info("Kanjidic2 XML file already exists, skipping download.")
        return
    
    current_app.logger.info("Downloading Kanjidic2 XML file...")
    data_dir.mkdir(parents=True, exist_ok=True)

    try:
        gz_path = data_dir / 'kanjidic2.xml.gz'
        response = requests.get(KANJIDIC_URL, stream=True)
        response.raise_for_status()

        with open(gz_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        with gzip.open(gz_path, 'rb') as f_in:
            with open(xml_path, 'wb') as f_out:
                f_out.write(f_in.read())

        gz_path.unlink()
        current_app.logger.info("Kanjidic2 XML file downloaded and extracted successfully.")
    except Exception as e:
        current_app.logger.error(f"Error downloading Kanjidic2 XML file: {e}")