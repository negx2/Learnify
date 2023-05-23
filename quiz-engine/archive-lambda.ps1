$handler = ".\request-handler\handler.py"
$validator = ".\request-handler\format_validator.py"
#$python_deps = ".\venv\Lib\site-packages\*"
$src_code_zip = ".\request-handler.zip"
#$python_zip = ".\python.zip"
Compress-Archive -Path $handler, $validator -Force -DestinationPath $src_code_zip
