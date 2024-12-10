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
- **Step 6**
    - **Use the following SQL statement to create a scenes table.**
    ```sh
    CREATE TABLE scenes (
      id SERIAL PRIMARY KEY,   
      name VARCHAR(255) NOT NULL,   
      image VARCHAR(255) NOT NULL,  
      category VARCHAR(255) NOT NULL  );
    ```
- **Step 7**
    - Run`text/text.py`

- **Step 8**
    - Download the checkpoint from [here](https://myshell-public-repo-host.s3.amazonaws.com/openvoice/checkpoints_1226.zip) and extract it to the `checkpoints` folder.
  
- **Step 9**
    PostgreSQL extension installation
    - Download the Vector from [here](https://pgxn.org/dist/vector/)
    - Compiling on Windows requires you to download Visual Studio first
    - Select C++ during installation
    - After the installation is complete, open cmd in Administrator Mode and execute the following commands in turn to complete the installation.
      ```sh
      call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
      cd C:\Users\xxx\Downloads\vector-0.7.3
      set "PGROOT=C:\Program Files\PostgreSQL\16"
      nmake /F Makefile.win
      nmake /F Makefile.win install
      ```
  - Finally, in the database connection tool, select the specific database instance and run the following command to expand the vector type.
    ```sh
      CREATE EXTENSION vector;
    ```
**Step 10** 
- Run db upgrade
    ```sh
    alembic upgrade head
    ```
    
After running these commands, a local development server will start, and your default web browser will open a new tab/window pointing to this server (usually http://localhost:3000).
