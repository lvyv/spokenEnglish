from faster_whisper import WhisperModel

model = WhisperModel("base")

segments, info = model.transcribe("test.mp3")
for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
