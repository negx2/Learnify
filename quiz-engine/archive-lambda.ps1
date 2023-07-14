
function compressScripts {
    $handler = ".\request-handler\handler.py"
    $validator = ".\request-handler\format_validator.py"
    $updater = ".\request-handler\updater.py"
    $errors = ".\request-handler\errors.py"
    $generator = ".\request-handler\open_ai_generator.py"
    $youtube_transcript = ".\request-handler\youtube_transcript.py"
    $src_code_zip = ".\request-handler.zip"
    Compress-Archive -Path $handler, $validator, $updater, $errors, $generator, $youtube_transcript `
        -Force -DestinationPath $src_code_zip
}

function compressPython {
    $python_deps = ".\venv\Lib\site-packages\*"
    $python_dest = ".\request-handler\python"
    $python_zip_temp = ".\request-handler\python_temp.zip"
    $new_name = "python.zip"
    $python_zip = ".\request-handler\" + $new_name
    # lambda requires a folder called python with the dependencies inside
    Copy-Item -Path $python_deps -Destination $python_dest -Recurse -Force
    # using temp so that ctrl+c doesn't leave a corrupted zip
    Compress-Archive -Path $python_dest -Force -DestinationPath $python_zip_temp
    Remove-Item -Path $python_zip -Force -ErrorAction SilentlyContinue
    Rename-Item -Path $python_zip_temp -NewName $new_name -Force
}

# compress scripts when lambda code changes
compressScripts

# compress python only when python dependencies change because it takes a long time
compressPython


