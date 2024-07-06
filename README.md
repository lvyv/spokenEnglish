## 📀 Quick Start - Installation via Docker

1. Create a new `.env` file
   
   ```sh
   cp .env.example .env
   ```
   
   Paste your API keys in `.env` file. A single [ReByte](#11-rebyte-api-key) or [OpenAI](#12-optional-openai-api-token) API key is enough to get started.
   
   You can also configure other API keys if you have them.

2. Start the app with `docker-compose.yaml`
   
   ```sh
   docker compose up
   ```
   
   If you have issues with docker (especially on a non-Linux machine), please refer to https://docs.docker.com/get-docker/ (installation) and https://docs.docker.com/desktop/troubleshoot/overview/ (troubleshooting).

3. Open http://localhost:3000 and enjoy the app!

## 💿 Developers - Installation via Python

- **Step 1**. Clone the repo
  
  ```sh
  git clone https://github.com/Shaunwei/RealChar.git && cd RealChar
  ```

- **Step 2**. Install requirements
  
    Install [portaudio](https://people.csail.mit.edu/hubert/pyaudio/) and [ffmpeg](https://ffmpeg.org/download.html) for audio
  
  ```sh
  # for mac
  brew install portaudio
  brew install ffmpeg
  ```
  
  ```sh
  # for ubuntu
  sudo apt update
  sudo apt install portaudio19-dev
  sudo apt install ffmpeg
  ```
  
    Note: 
  
  - `ffmpeg>=4.4` is needed to work with `torchaudio>=2.1.0`
  
  - Mac users may need to add ffmpeg library path to `DYLD_LIBRARY_PATH` for torchaudio to work:
    
    ```sh
    export DYLD_LIBRARY_PATH=/opt/homebrew/lib:$DYLD_LIBRARY_PATH
    ```
    
    Then install all python requirements
    
    ```sh
    pip install -r requirements.txt
    ```
    
    If you need a faster local speech to text, install whisperX
    
    ```sh
    pip install git+https://github.com/m-bain/whisperx.git
    ```

- **Step 3**. Create an empty [sqlite](https://www.sqlite.org/index.html) database if you have not done so before
  
  ```sh
  sqlite3 init_db.sqlite "VACUUM;"
  ```

- **Step 4**. Run db upgrade
  
  ```sh
  alembic upgrade head
  ```
  
    This ensures your database schema is up to date. Please run this after every time you pull the main branch.

- **Step 5**. Setup `.env`:
  
  ```sh
  cp .env.example .env
  ```
  
    Update API keys and configs following the instructions in the `.env` file.
  
  > Note that some features require a working login system. You can get your own OAuth2 login for free with [Firebase](https://firebase.google.com/) if needed. To enable, set `USE_AUTH` to `true` and fill in the `FIREBASE_CONFIG_PATH` field. Also fill in Firebase configs in `client/next-web/.env`.

- **Step 6**. Run backend server with `cli.py` or use uvicorn directly
  
  ```sh
  python cli.py run-uvicorn
  # or
  uvicorn realtime_ai_character.main:app
  ```

- **Step 7**. Run frontend client:
  
  - web client:
    
      Create an `.env` file under `client/next-web/`
    
    ```sh
    cp client/next-web/.env.example client/next-web/.env
    ```
    
      Adjust `.env` according to the instruction in `client/next-web/README.md`.
    
      Start the frontend server:
    
    ```sh
    python cli.py next-web-dev
    # or
    cd client/next-web && npm run dev
    # or
    cd client/next-web && npm run build && npm run start
    ```
    
      After running these commands, a local development server will start, and your default web browser will open a new tab/window pointing to this server (usually http://localhost:3000).
  
  - (Optional) Terminal client:
    
      Run the following command in your terminal
    
    ```sh
    python client/cli.py
    ```
  
  - (Optional) mobile client:
    
      open `client/mobile/ios/rac/rac.xcodeproj/project.pbxproj` in Xcode and run the app

- **Step 8**. Select one character to talk to, then start talking. Use **GPT4** for better conversation and **Wear headphone** for best audio(avoid echo)

Note if you want to remotely connect to a RealChar server, SSL set up is required to establish the audio connection. 

## 👨‍🚀 API Keys and Configurations

### 1. LLMs

### 1.1 ReByte API Key

To get your ReByte API key, follow these steps:

1. Go to the [ReByte website](https://rebyte.ai/) and sign up for an account if you haven't already.
2. Once you're logged in, go to Settings > API Keys.
3. Generate a new API key by clicking on the "Generate" button.

### 1.2 (Optional) OpenAI API Token

<details><summary>👇click me</summary>
This application utilizes the OpenAI API to access its powerful language model capabilities. In order to use the OpenAI API, you will need to obtain an API token.

To get your OpenAI API token, follow these steps:

1. Go to the [OpenAI website](https://beta.openai.com/signup/) and sign up for an account if you haven't already.
2. Once you're logged in, navigate to the [API keys page](https://beta.openai.com/account/api-keys).
3. Generate a new API key by clicking on the "Create API Key" button.

(Optional) To use Azure OpenAI API instead, refer to the following section:

1. Set API type in your `.env` file:
   `OPENAI_API_TYPE=azure`

If you want to use the earlier version `2023-03-15-preview`:

`OPENAI_API_VERSION=2023-03-15-preview`

2. To set the base URL for your Azure OpenAI resource.
   You can find this in the Azure portal under your Azure OpenAI resource.

`OPENAI_API_BASE=https://your-base-url.openai.azure.com`

3. To set the OpenAI model deployment name for your Azure OpenAI resource.

`OPENAI_API_MODEL_DEPLOYMENT_NAME=gpt-35-turbo-16k`

4. To set the OpenAIEmbeddings model deployment name for your Azure OpenAI resource.

`OPENAI_API_EMBEDDING_DEPLOYMENT_NAME=text-embedding-ada-002`

</details>

### 1.3 (Optional) Anthropic(Claude 2) API Token

<details><summary>👇click me</summary>

To get your Anthropic API token, follow these steps:

1. Go to the [Anthropic website](https://docs.anthropic.com/claude/docs/getting-started-with-claude) and sign up for an account if you haven't already.
2. Once you're logged in, navigate to the [API keys page](https://console.anthropic.com/account/keys).
3. Generate a new API key by clicking on the "Create Key" button.
   
   </details>

### 1.4 (Optional) Anyscale API Token

<details><summary>👇click me</summary>

To get your Anyscale API token, follow these steps:

1. Go to the [Anyscale website](https://www.anyscale.com/) and sign up for an account if you haven't already.
2. Once you're logged in, navigate to the [Credentials page](https://app.endpoints.anyscale.com/credentials).
3. Generate a new API key by clicking on the "Generate credential" button.
   
   </details>

### 2. Speech to Text

We support [faster-whisper](https://github.com/SYSTRAN/faster-whisper) and [whisperX](https://github.com/m-bain/whisperX) as the local speech to text engines. Work with CPU and NVIDIA GPU.

### 2.1 (Optional) Google Speech-to-Text API

<details><summary>👇click me</summary>

To get your Google Cloud API credentials.json, follow these steps:

1. Go to the [GCP website](https://cloud.google.com/speech-to-text/docs/before-you-begin) and sign up for an account if you haven't already.
2. Follow the guide to create a project and enable Speech to Text API
3. Put `google_credentials.json` in the root folder of this project. Check [Create and delete service account keys](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console)
4. Change `SPEECH_TO_TEXT_USE` to use `GOOGLE` in your `.env` file
   
   </details>

### 2.2 (Optional) OpenAI Whisper API

<details><summary>👇click me</summary>

Same as [OpenAI API Token](#12-optional-openai-api-token)

</details>

### 3. Text to Speech

Edge TTS is the default and is free to use.

### 3.1 (Optional) ElevenLabs API Key

<details><summary>👇click me</summary>

1. Creating an ElevenLabs Account
   
    Visit [ElevenLabs](https://beta.elevenlabs.io/) to create an account. You'll need this to access the text to speech and voice cloning features.

2. In your Profile Setting, you can get an API Key.

</details>

### 3.2 (Optional) Google Text-to-Speech API

<details><summary>👇click me</summary>

To get your Google Cloud API credentials.json, follow these steps:

1. Go to the [GCP website](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries) and sign up for an account if you haven't already.
2. Follow the guide to create a project and enable Text to Speech API
3. Put `google_credentials.json` in the root folder of this project. Check [Create and delete service account keys](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console)
   
   </details>

## (Optional) 🔥 Create Your Own Characters

<details><summary>👇click me</summary>

### Create Characters Locally

see [realtime_ai_character/character_catalog/README.md](realtime_ai_character/character_catalog/README.md)

### Create Characters on ReByte.ai

see [docs/rebyte_agent_clone_instructions.md](docs/rebyte_agent_clone_instructions.md)

</details>

## (Optional) ☎️ Twilio Integration

<details><summary>👇click me</summary>

To use [Twilio](https://www.twilio.com/en-us) with RealChar, you need to set up a Twilio account. Then, fill in the following environment variables in your `.env` file:

```sh
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_ACCESS_TOKEN=YOUR_TWILIO_ACCESS_TOKEN
DEFAULT_CALLOUT_NUMBER=YOUR_PHONE_NUMBER
```

You'll also need to install `torch` and `torchaudio` to use Twilio.

Now, you can receive phone calls from your characters by typing `/call YOURNUMBER` in the text box when chatting with your character.

Note: only US phone numbers and Elevenlabs voiced characters are supported at the moment.

</details>

## 🆕! Anyscale and LangSmith integration

<details><summary>👇click me</summary>

### Anyscale

You can now use [Anyscale Endpoint](https://app.endpoints.anyscale.com/landing) to serve Llama-2 models in your RealChar easily! Simply register an account with Anyscale Endpoint. Once you get the API key, set this environment variable in your `.env` file:

```
ANYSCALE_ENDPOINT_API_KEY=<your API Key>
```

By default, we show the largest servable Llama-2 model (70B) in the Web UI. You can change the model name (`meta-llama/Llama-2-70b-chat-hf`) to other models, e.g. 13b or 7b versions.

### LangSmith

If you have access to LangSmith, you can edit these environment variables to enable:

```
LANGCHAIN_TRACING_V2=false # default off
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=YOUR_LANGCHAIN_API_KEY
LANGCHAIN_PROJECT=YOUR_LANGCHAIN_PROJECT
```

And it should work out of the box.

</details>

<br/>

## 📍 Roadmap

- [x] Launch v0.0.4
- [x] Create a new character via web UI
- [x] Lower conversation latency
- [x] Support Twilio
- [x] Support ReByte
- [x] Persistent conversation*
- [ ] Session management*
- [ ] Support RAG*
- [ ] Support Agents/GPTs*
- [ ] Add additional TTS service*

$*$ These features are powered by [ReByte](https://rebyte.ai/) platform.

## 🫶 Contribute to RealChar

Please check out our [Contribution Guide](contribute.md)!

## 💪 Contributors

<a href="https://github.com/Shaunwei/RealChar">
  <img src="https://contrib.rocks/image?repo=Shaunwei/RealChar" />
</a>

## 🎲 Community

- Join us on [Discord](https://realchar.ai/join-discord)
