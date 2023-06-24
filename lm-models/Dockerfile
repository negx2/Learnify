# Use a base image with Python 3.9
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file and install dependencies
COPY lm-models/server/model_server.py /app/model_server.py
COPY lm-models/server/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install -i /usr/local/aws-cli -b /usr/local/bin && \
    rm -rf awscliv2.zip aws

# Copy the model from S3 to /app/model in the container
RUN aws s3 cp s3://learnify-models-bucket/ft5_large_qas_50 /app/model_dir

# Expose the port on which the FastAPI server will run
EXPOSE 8000

# Command to start the FastAPI server
CMD ["python", "model_server.py"]
