# ai/Dockerfile

FROM python:3.9-slim

# Install system dependencies including gcc, g++, and make
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    build-essential \
    libatlas-base-dev \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt requirements.txt

# Upgrade pip first
RUN pip install --upgrade pip

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]