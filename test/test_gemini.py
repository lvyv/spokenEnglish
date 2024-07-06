import os
import google.generativeai as genai

def to_markdown(text):
  return text

proxy_server = '127.0.0.1'
proxy_port = '7890'

# 设置环境变量
os.environ['http_proxy'] = f'http://{proxy_server}:{proxy_port}'
os.environ['https_proxy'] = f'http://{proxy_server}:{proxy_port}'

if __name__ == "__main__":
  GOOGLE_API_KEY='AIzaSyCIsqxIt4z56lNPMKCsuwFzlAcKBnwtc9c'
  genai.configure(api_key=GOOGLE_API_KEY)
  model = genai.GenerativeModel('gemini-1.5-flash')
  response = model.generate_content("could you please show me some methods to improve spoken english?")
  reply = to_markdown(response.text)
  print(reply)