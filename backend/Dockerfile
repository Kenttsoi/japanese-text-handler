# python
FROM python:3.10.19-slim

# Environment Variable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$PATH:$JAVA_HOME/bin

# Install system dependency
RUN apt-get update && apt-get install -y \
    default-jre \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set container working directory
WORKDIR /app

# Install Python Packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all backend files
COPY . .

# Start program
CMD ["python", "run.py"]