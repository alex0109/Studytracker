FROM python:3.13-slim

WORKDIR /server

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false

RUN poetry install --no-interaction --no-root

COPY . .

# RUN poetry install --no-interaction

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]