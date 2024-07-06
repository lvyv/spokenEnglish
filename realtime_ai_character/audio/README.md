# ElevenLabs Voice Cloning Guide

This README serves as a guide on how to use ElevenLabs for voice cloning. Follow the steps below to clone a voice, test it, and fine-tune it for the best results.

## Collecting Data

Before you start, you'll need voice data. Download high quality vocal only audio clips. Check the [training_data](./training_data) folder for reference.

If you're creating your own dataset, ensure the audio is high quality. It should have no background noise, clear pronunciation.

The audio format must be mp3 and should be about 1 minute long in total.

## Creating an ElevenLabs Account

Visit [ElevenLabs](https://beta.elevenlabs.io/) to create an account. You'll need this to access the speech synthesis and voice cloning features.

Get your `ELEVEN_LABS_API_KEY`:
1. Click profile icon and select 'profile'.
2. Copy API Key

## Speech Synthesis/Voice Cloning

Follow these steps to clone a voice:

1. Go to the [speech synthesis page](https://beta.elevenlabs.io/speech-synthesis).
2. Click "Add Voice".
3. Click "Add Generative or Cloned Voice".
4. Click "Instant Voice Cloning".
5. Fill in all the required information and upload your audio samples.
6. Click "Add Voice".

## Testing Your Voice

To test the voice you've just created:

1. Go back to the [speech synthesis page](https://beta.elevenlabs.io/speech-synthesis).
2. Choose the voice you just created in Settings.
4. Type some text and click "Generate".

## Fine-tuning Your Voice

You can make the voice read better by adjusting system and user prompts.
Here are some tips:

- If the voice is too monotone, lower the Stability to make it more emotional. However, setting the Stability to zero can sometimes lead to a strange accent.
- Longer sentences tend to be spoken better because they provide more context for the AI speaker to understand.
- For shorter sentences that are spoken too quickly, replace "." with "...". Add "-" or a newline for a pause.
- Add emotion-related words or phrases, or use punctuation marks like “!”, “?” to add emotions to the voice.

## Using Your Custom Voice in Our Project

You need the voice id of cloned voice. Here's how:
1. go to https://api.elevenlabs.io/docs
2. choose Get Voices api
3. follow the instruction and find the specific voice_id in the Responses.
4. Do not forget to update your .env file with `ELEVEN_LABS_API_KEY` and voice ids.


ElevenLabs 语音克隆指南
本 README 作为 ElevenLabs 语音克隆的使用指南。按照以下步骤进行声音克隆，测试它，并进行微调以获得最佳结果。

收集数据
在开始之前，您需要语音数据。下载高质量的仅包含声音的音频片段。可以查看 training_data 文件夹作为参考。

如果您正在创建自己的数据集，请确保音频质量高。它不应该有背景噪音，发音清晰。

音频格式必须为 mp3 格式，并且应该总共约 1 分钟长。

创建 ElevenLabs 账户
访问 ElevenLabs 创建一个账户。您需要此账户来访问语音合成和语音克隆功能。

获取您的 ELEVEN_LABS_API_KEY：

点击个人资料图标，然后选择“个人资料”。
复制 API 密钥。
语音合成/语音克隆
按照以下步骤克隆声音：

转到 语音合成页面。
点击“添加声音”。
点击“添加生成或克隆的声音”。
点击“即时语音克隆”。
填写所有必需的信息并上传您的音频样本。
点击“添加声音”。
测试您的声音
要测试您刚刚创建的声音：

返回 语音合成页面。
在设置中选择您刚刚创建的声音。
输入一些文本，然后点击“生成”。
微调您的声音
您可以通过调整系统和用户提示使声音读得更好。以下是一些技巧：

如果声音过于单调，请降低稳定性以使其更具情感。然而，将稳定性设置为零有时会导致奇怪的口音。
较长的句子往往会更好地发音，因为它们为 AI 说话者提供了更多的上下文。
对于说得太快的较短句子，可以用“...”代替“。”。用“-”或换行符添加一个停顿。
添加与情感相关的词语或短语，或使用标点符号如“！”、“？”来为声音添加情感。
在我们的项目中使用您的自定义声音
您需要克隆声音的声音 ID。以下是方法：

访问 https://api.elevenlabs.io/docs
选择 Get Voices API
按照说明找到响应中的特定 voice_id。
不要忘记使用 ELEVEN_LABS_API_KEY 和声音 ID 更新您的 .env 文件。