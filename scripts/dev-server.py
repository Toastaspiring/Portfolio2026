#!/usr/bin/env python3
"""Serveur de dev statique pour le SPA du portfolio.

`python -m http.server` sert le depot brut : il ne connait pas les URLs en
forme de chemin que le routeur ecrit (/blog/slug/, /projects/, ...), donc un
F5 sur un post renvoie 404 en local. En production, le build genere un fichier
pre-rendu par route, ce qui masque le probleme.

Ce serveur ajoute le fallback SPA qui manque : si le chemin demande ne
correspond a aucun fichier reel ET n'a pas d'extension (donc c'est une route,
pas un asset), on sert index.html avec un 200. Le routeur cote client fait
ensuite le reste (il lit le pathname). Les assets manquants (.png, .css, ...)
gardent un vrai 404.

Usage : python scripts/dev-server.py [port]   (defaut 8765)
"""

import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        target = self.translate_path(self.path)
        if not os.path.exists(target):
            _, ext = os.path.splitext(target)
            if not ext:  # ressemble a une route, pas a un fichier -> shell SPA
                self.path = "/index.html"
        return super().send_head()

    def end_headers(self):
        # Pas de cache en dev, pour voir les modifs sans vider le cache a la main.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("127.0.0.1", PORT), SPAHandler) as httpd:
        print(f"SPA dev server on http://127.0.0.1:{PORT}  (root: {ROOT})")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
