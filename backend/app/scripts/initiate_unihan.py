from unihan_etl.core import Packager, Options
from pathlib import Path
from flask import current_app

UNIHAN_ZIP_URL = "http://www.unicode.org/Public/UNIDATA/Unihan.zip"

def initiate_unihan():
    """
    Initiate the Unihan data packaging process.
    This function downloads and processes the Unihan data from the Unicode website.
    """
    destination = Path(current_app.static_folder) / 'unihan' / 'unihan_output.json'
    zip_path = Path(current_app.static_folder) / 'unihan' / 'unihan.zip'
    work_dir = Path(current_app.static_folder) / 'unihan' / 'work_dir'
    work_dir.mkdir(parents=True, exist_ok=True)

    try:
        pkgr = Packager(
            options=Options(
                source=UNIHAN_ZIP_URL,
                destination=destination,
                zip_path=zip_path,
                work_dir=work_dir,
                fields=('kJapaneseKun', 'kJapaneseOn'),
                format='json',
                input_files=['Unihan_Readings.txt'],
                download=True,
                expand=True,
                prune_empty=True,
                cache=True,
                log_level='INFO'
            )
        )
        pkgr.download()
        pkgr.export()
        print("Program started successfully")
    except Exception as e:
        current_app.logger.error(f"Error during Unihan data packaging: {e}")
        raise RuntimeError(f"initiate_unihan failed: {e}")