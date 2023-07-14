from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from errors import InputError

import re


def replace_newlines_with_spaces(text):
    return text.replace("\n", " ")


def get_youtube_video_id(url):
    # Regular expression pattern to extract video ID
    pattern = r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})'

    # Extract video ID using regex match
    match = re.search(pattern, url)
    if match:
        video_id = match.group(1)
        return video_id
    else:
        return None


def get_youtube_transcript(url):
    video_id = get_youtube_video_id(url)
    # if video_id is None then raise InputError
    if video_id is None:
        raise InputError(
            f"Unable to get youtube video id from given url' '{url}'")
    transcript = YouTubeTranscriptApi.get_transcript(
        video_id, languages=['en'])
    formatter = TextFormatter()
    transcript = replace_newlines_with_spaces(
        formatter.format_transcript(transcript))
    return transcript
