"""Serve the production build on a temporary port for Chromium tests."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
import unittest

from playwright.sync_api import sync_playwright


class StaticFiles(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class BrowserSite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        dist = Path(__file__).resolve().parents[1] / "dist"
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), partial(StaticFiles, directory=dist))
        Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(executable_path=which("chromium"))

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
