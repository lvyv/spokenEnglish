# -*- coding: utf-8 -*-
# test on python 3.4 ,python of lower version  has different module organization.
import http.server
import socketserver
import mimetypes
import logging


class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        mime_type, _ = mimetypes.guess_type(path)
        if path.endswith(".js"):
            return "application/javascript"
        logging.info(f"Serving {path} with MIME type {mime_type}")
        logging.info(self.extensions_map)
        return mime_type


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
    PORT = 8877

    Handler = MyRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serving at port", PORT)
        httpd.serve_forever()
