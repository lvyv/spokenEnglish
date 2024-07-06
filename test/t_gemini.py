import os

if __name__ == "__main__":
    os.environ['http_proxy'] = 'http://127.0.0.1:49777'
    os.environ['https_proxy'] = 'http://127.0.0.1:49777'
