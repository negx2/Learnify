#!/bin/bash

set -e

python -m pytest ./test_handler.py
python -m pytest ./test_validator.py
