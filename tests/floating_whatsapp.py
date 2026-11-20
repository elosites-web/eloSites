"""Run after npm run build: python tests/floating_whatsapp.py (Playwright + Chromium)."""
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
import unittest

from playwright.sync_api import expect, sync_playwright


class StaticFiles(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class FloatingWhatsAppTests(unittest.TestCase):
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

    @contextmanager
    def session(self, route, mobile=False, motion="reduce"):
        page = self.browser.new_page(has_touch=mobile, is_mobile=mobile, reduced_motion=motion,
                                     service_workers="block", viewport={
                                         "width": 390 if mobile else 1440, "height": 844 if mobile else 900})
        errors, downloads = [], []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("request", lambda r: downloads.append(r.url) if "/FloatingWhatsApp-" in r.url else None)
        # Keep the production app and its chunks real. Isolate the third-party font stylesheet.
        page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(content_type="text/css", body=""))
        page.clock.install(time="2026-01-05T12:00:00Z")
        page.clock.pause_at("2026-01-05T12:00:01Z")
        page.add_init_script("""window.bubbleEvents = [];
          addEventListener('elosites-bubble-visibility', e => bubbleEvents.push(e.detail.isVisible));""")
        try:
            page.goto(f"http://127.0.0.1:{self.server.server_port}/#{route}")
            yield page, downloads
            self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), page.evaluate("innerWidth"))
            self.assertEqual(errors, [])
        finally:
            page.close()

    def bubble(self, page, visible):
        # The event follows logical closure even during the existing exit animation.
        self.assertEqual(page.evaluate("window.bubbleEvents.at(-1) ?? false"), visible)
        if visible:
            expect(page.get_by_role("region", name="Mensagem do WhatsApp")).to_be_visible()

    def advance(self, page, ms):
        page.clock.fast_forward(ms)
        page.wait_for_timeout(30)  # Flush React commits while virtual time stays fixed.

    def scroll(self, page, hero):
        page.evaluate("""hero => scrollTo({top: hero ? 0 :
          document.querySelector('#inicio').getBoundingClientRect().bottom + scrollY + 20, behavior:'instant'})""", hero)
        # Allow the browser to deliver the real IntersectionObserver while the app clock is paused.
        page.wait_for_timeout(80)

    def tab_visibility(self, page, hidden):
        # Headless Chromium keeps pages foregrounded. Exercise the Page Visibility API listener.
        page.evaluate("""hidden => {
          if (hidden) Object.defineProperty(document, 'hidden', {configurable: true, value: true});
          else delete document.hidden;
          document.dispatchEvent(new Event('visibilitychange'));
        }""", hidden)
        page.wait_for_timeout(30)

    def test_case_from_load_and_close_cycles(self):
        for mobile in (False, True):
            with self.subTest(mobile=mobile), self.session("case/jv-salvaia", mobile) as (page, downloads):
                expect(page.locator("#case-detail-page")).to_be_attached()
                self.advance(page, 29_999)
                self.assertEqual(downloads, [])
                with page.expect_request("**/FloatingWhatsApp-*.js"):
                    self.advance(page, 1)
                page.clock.run_for(1200)
                self.advance(page, 39_799)
                self.bubble(page, False)
                self.advance(page, 1)
                self.bubble(page, True)
                self.assertEqual(len(downloads), 1)
                close = page.get_by_role("button", name="Fechar mensagem")
                close.dispatch_event("click")
                self.bubble(page, False)
                self.advance(page, 141_999)
                self.bubble(page, False)
                self.advance(page, 1)
                self.bubble(page, True)
                close.focus()
                # Focus and hover overlap. Releasing just one must keep the clock paused.
                page.locator('.whatsapp-bubble-interactive').dispatch_event("mouseover")
                page.evaluate("document.activeElement.blur()")
                self.advance(page, 15_000)
                self.bubble(page, True)
                close.focus()
                page.locator('.whatsapp-bubble-interactive').dispatch_event("mouseout")
                self.advance(page, 15_000)
                self.bubble(page, True)
                close.press("Escape")
                self.bubble(page, False)
                self.advance(page, 142_000)
                self.bubble(page, True)
                self.advance(page, 9_999)
                self.bubble(page, True)
                self.advance(page, 1)
                self.bubble(page, False)
                self.advance(page, 142_000)
                self.bubble(page, True)

    def test_hero_and_hidden_tab_pause_open_and_waiting(self):
        with self.session("inicio", mobile=True) as (page, downloads):
            expect(page.locator("#inicio")).to_be_visible()
            self.advance(page, 240_000)
            self.assertEqual(downloads, [])
            expect(page.get_by_role("complementary", name="Atendimento rápido via WhatsApp")).to_have_count(0)
            self.assertGreater(page.locator('#inicio a[href*="whatsapp"]').count(), 0)
            self.scroll(page, False)
            page.clock.run_for(2000)
            self.advance(page, 18_000)
            self.scroll(page, True)
            aside = page.locator('aside[aria-label="Atendimento rápido via WhatsApp"]')
            expect(aside).to_be_hidden()
            self.advance(page, 200_000)
            self.scroll(page, False)
            expect(aside).to_be_visible()
            self.advance(page, 50_999)
            self.bubble(page, False)
            self.advance(page, 1)
            self.bubble(page, True)
            self.advance(page, 3_000)
            self.scroll(page, True)
            self.bubble(page, False)
            expect(aside).to_be_hidden()
            self.advance(page, 80_000)
            self.scroll(page, False)
            self.bubble(page, True)
            self.advance(page, 6_999)
            self.bubble(page, True)
            self.advance(page, 1)
            self.bubble(page, False)
            self.advance(page, 42_000)
            self.tab_visibility(page, hidden=True)
            expect(aside).to_be_hidden()
            self.advance(page, 300_000)
            self.tab_visibility(page, hidden=False)
            self.advance(page, 99_999)
            self.bubble(page, False)
            self.advance(page, 1)
            self.bubble(page, True)
            self.assertEqual(len(downloads), 1)

    def test_hidden_tab_during_initial_wait_and_open_bubble(self):
        with self.session("case/jv-salvaia") as (page, downloads):
            expect(page.locator("#case-detail-page")).to_be_attached()
            self.advance(page, 12_000)
            self.tab_visibility(page, hidden=True)
            self.advance(page, 90_000)
            self.assertEqual(downloads, [])
            self.tab_visibility(page, hidden=False)
            page.clock.run_for(1200)
            self.advance(page, 57_799)
            self.bubble(page, False)
            self.advance(page, 1)
            self.bubble(page, True)
            self.advance(page, 4_000)
            self.tab_visibility(page, hidden=True)
            self.bubble(page, False)
            self.advance(page, 300_000)
            self.tab_visibility(page, hidden=False)
            self.bubble(page, True)
            self.advance(page, 5_999)
            self.bubble(page, True)
            self.advance(page, 1)
            self.bubble(page, False)

    def test_resize_changes_the_hero_intersection(self):
        with self.session("inicio") as (page, _):
            hero = page.locator("#inicio")
            expect(hero).to_be_visible()
            self.advance(page, 40_000)
            # Disable scroll anchoring only in this fixture so resize tests the same Y.
            page.evaluate("document.documentElement.style.overflowAnchor='none'")
            self.scroll(page, False)
            page.clock.run_for(1200)
            aside = page.locator('aside[aria-label="Atendimento rápido via WhatsApp"]')
            expect(aside).to_be_visible()
            page.set_viewport_size({"width": 390, "height": 844})
            self.assertGreater(hero.evaluate("el => el.getBoundingClientRect().bottom"), 0)
            expect(aside).to_be_hidden()
            page.set_viewport_size({"width": 1440, "height": 900})
            self.assertLess(hero.evaluate("el => el.getBoundingClientRect().bottom"), 0)
            expect(aside).to_be_visible()

    def test_early_departure_menu_case_and_history(self):
        with self.session("inicio", motion="no-preference") as (page, downloads):
            expect(page.locator("#inicio")).to_be_visible()
            self.advance(page, 10_000)
            self.scroll(page, False)
            self.advance(page, 19_999)
            self.assertEqual(downloads, [])
            with page.expect_request("**/FloatingWhatsApp-*.js"):
                self.advance(page, 1)
            page.clock.run_for(2000)
            nav = page.get_by_role("navigation", name="Navegação institucional")
            nav.get_by_role("button", name="Portfólio").dispatch_event("click")
            page.clock.run_for(1000)
            expect(page.locator("#portfolio")).to_be_attached()
            page.evaluate("location.hash='case/jv-salvaia'")
            page.clock.run_for(1000)
            expect(page.locator("#case-detail-page")).to_be_attached()
            page.go_back()
            page.clock.run_for(1000)
            expect(page.locator("#portfolio")).to_be_attached()
            self.advance(page, 43_000)
            self.bubble(page, False)
            self.advance(page, 6_000)  # Includes time for the menu transition.
            self.bubble(page, True)
            page.go_back()
            page.clock.run_for(1000)
            self.scroll(page, True)
            expect(page.locator('aside[aria-label="Atendimento rápido via WhatsApp"]')).to_be_hidden()


if __name__ == "__main__":
    unittest.main()
