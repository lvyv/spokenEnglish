## 💿 Developers - Installation via Python

- **Step 1**. Clone the repo
  
  ```sh
  git clone https://github.com/lvyv/spokenEnglish.git && cd spokenEnglish
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

- **Step 3**. Setup `.env`:
  
  ```sh
  cp .env.example .env
  ```
  
    Update API keys and configs following the instructions in the `.env` file.
  
  > Note that some features require a working login system. You can get your own OAuth2 login for free with [Firebase](https://firebase.google.com/) if needed. To enable, set `USE_AUTH` to `true` and fill in the `FIREBASE_CONFIG_PATH` field. Also fill in Firebase configs in `client/next-web/.env`.

- **Step 4**. Run backend server in Pycharm IDE：

- **Step 5**. Run frontend client:
  
  - web client:
    
      Create an `.env` file under `client/next-web/`
    
    ```sh
    cp client/next-web/.env.example client/next-web/.env
    ```
    
      Adjust `.env` according to the instruction in `client/next-web/README.md`.
    
      Start the frontend server:
    
    ```sh
    cd client/next-web
    npm install
    npm run dev
    ```
    
    
    
    
    
    After running these commands, a local development server will start, and your default web browser will open a new tab/window pointing to this server (usually http://localhost:3000).
