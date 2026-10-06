# Japanese Text Handler
![Dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen?logo=dependabot)
[<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white" alt="Python version">](https://www.python.org/)
[<img src="https://img.shields.io/badge/Flask-3.1+-black?logo=flask" alt="Flask version">](https://flask.palletsprojects.com/)
[<img src="https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black" alt="React version">](https://react.dev/)
[<img src="https://img.shields.io/badge/license-MIT-green" alt="License">](./LICENSE)

> A full-stack web application for Japanese language learners to parse text, generate furigana (振り仮名), break down kanji readings, and synthesize audio with Japanese study card.

👉 **[Live Demo (Click to Explore)](https://jpstudy.kentt.dev)** 👈

## What is this?
- Furigana (振り仮名) generator
- Broken down per kanji (各漢字の読み方 / 漢字ごとの音読み)
- Japanese Study (日本語の勉強)

## 💡 Key Features
- **Furigana Generator:** annotates raw Japanese text with reading guides - furigana (振り仮名).
- **Kanji Breakdown:** Extracts individual kanji（漢字） from Japanese Vocabulary.
- **Vocabulary Dictionary Search**
- **Text-to-Speech:** Integrated audio synthesis for pronunciation practice.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Mantine UI
- **Backend:** Python 3.10+, Flask, Java Library
- **Database / Storage:** Supabase (PostgreSQL)
- **Infrastructure:** Docker, Nginx

## 🛠 Prerequisites

This project requires **Java Runtime** to handle specific Japanese text processing libraries.

### Java Installation (macOS)
Using Homebrew:
```bash
brew install openjdk@21
# Link the JDK to system library
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

## 🚀 Quick start
### Python Flask
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python run.py
```
### React
```bash
npm install
npm run dev
```
## 📝 License
All rights reserved. This repository and its content are for personal demonstration and educational purposes.