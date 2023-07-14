from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = FastAPI()

# Load model and tokenizer
model = AutoModelForSeq2SeqLM.from_pretrained('/app/model_dir')
tokenizer = AutoTokenizer.from_pretrained("/app/model_dir")


class PredictionRequest(BaseModel):
    text: str


class PredictionResponse(BaseModel):
    predictions: List[str]


@app.post("/predict", response_model=PredictionResponse)
def predict_text(request: PredictionRequest):
    input_text = request.text

    # Tokenize input
    input_ids = tokenizer.encode(input_text, return_tensors="pt")

    # Generate predictions
    with torch.no_grad():
        outputs = model.generate(input_ids=input_ids, max_length=50)

    # Decode predictions
    decoded_predictions = tokenizer.batch_decode(
        outputs, skip_special_tokens=True)

    return PredictionResponse(predictions=decoded_predictions)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
