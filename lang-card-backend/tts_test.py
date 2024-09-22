from melo.api import TTS

# Speed is adjustable
speed = 1.0
device = 'cpu' # or cuda:0

text = "彼は毎朝ジョギングをして体を健康に保っています。"
model = TTS(language='JP', device=device)
speaker_ids = model.hps.data.spk2id

output_path = 'jp.wav'
model.tts_to_file(text, speaker_ids['JP'], output_path, speed=speed)