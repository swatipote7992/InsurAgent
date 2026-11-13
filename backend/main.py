import json

import anyio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
DATA_file = Path(__file__).parent / "data" / "quotes.json"


@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.get("/quotes")
async def get_quotes():
    async with await anyio.open_file(DATA_file, "r") as f:
        data = await f.read()
    # json.loads(data) converts the text into a list of Python dicts, and FastAPI turns that back into proper JSON.
    return {"quotes": json.loads(data)}
