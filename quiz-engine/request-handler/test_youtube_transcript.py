import unittest
from youtube_transcript import get_youtube_video_id


class TestGetYouTubeVideoID(unittest.TestCase):

    def test_standard_url(self):
        url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        expected_output = "dQw4w9WgXcQ"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_www(self):
        url = "https://www.youtube.com/watch?v=abcd1234xyz"
        expected_output = "abcd1234xyz"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_without_www(self):
        url = "https://youtube.com/watch?v=xyz5678abcd"
        expected_output = "xyz5678abcd"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_query_parameters(self):
        url = "https://www.youtube.com/watch?v=efg9876reco&t=1m30s"
        expected_output = "efg9876reco"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_embed(self):
        url = "https://www.youtube.com/embed/efg9876reco"
        expected_output = "efg9876reco"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_shortened_url(self):
        url = "https://youtu.be/efg9876reco"
        expected_output = "efg9876reco"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_shortened_url_and_query_parameters(self):
        url = "https://youtu.be/efg9876reco?t=1m30s"
        expected_output = "efg9876reco"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_shortened_url_and_query_parameters_and_path(self):
        url = "https://youtu.be/dQw4w9WgXcQ?t=1m30s&v=dQw4w9WgXcQ"
        expected_output = "dQw4w9WgXcQ"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_with_shortened_url_and_query_parameters_and_path_and_fragment(self):
        url = "https://youtu.be/dQw4w9WgXcQ?t=1m30s&v=dQw4w9WgXcQ#t=1m30s"
        expected_output = "dQw4w9WgXcQ"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_url_from_mobile(self):
        url = "https://m.youtube.com/watch?v=dQw4w9WgXcQ"
        expected_output = "dQw4w9WgXcQ"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    # chapter links are just t=seconds format
    def test_url_with_chapter(self):
        url = "https://youtu.be/3-hTgRO093Q?t=1395"
        expected_output = "3-hTgRO093Q"
        self.assertEqual(get_youtube_video_id(url), expected_output)

    def test_invalid_url(self):
        url = "https://example.com"
        expected_output = None
        self.assertEqual(get_youtube_video_id(url), expected_output)


if __name__ == '__main__':
    unittest.main()
