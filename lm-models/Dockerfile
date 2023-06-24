# Use a base image with Python 3.9
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file and install dependencies
COPY ../server/requirements.txt .
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the model from S3 to /app/model in the container
RUN apt-get install -y awscli
RUN aws s3 cp s3://learnify-models-bucket/ft5_large_qas_50 /app/model_dir

# Copy the server.py file into the container
COPY ../server/model_server.py /app/model_server.py

# Expose the port on which the FastAPI server will run
EXPOSE 8000

# Command to start the FastAPI server
CMD ["python", "model_server.py"]
