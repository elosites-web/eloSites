"""Run after npm run build: python tests/navigation.py (Playwright + Chromium)."""
from contextlib import contextmanager
import unittest

from playwright.sync_api import expect
from site_browser import BrowserSite


class NavigationTests(BrowserSite):
    @contextmanager
    def page_at(self, path, width=1440, height=900):
        page = self.browser.new_page(viewport={"width": width, "height": height},
                                     has_touch=width < 600, reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        try:
            page.goto(f"http://127.0.0.1:{self.server.server_port}/{path}")
            yield page
            self.assertEqual(errors, [])
        finally:
            page.close()

    def active(self, nav, route):
        selection = nav.locator('a[aria-current="page"]')
        expect(selection).to_have_count(1)
        expect(selection).to_have_attribute("href", "#" + route)
        return selection

    def test_mobile_reopening_history_and_resize(self):
        with self.page_at("#inicio", 390, 844) as page:
            opener = page.locator("#menu-de-navegacao-btn")
            drawer = page.get_by_role("dialog", name="Menu de navegação")
            current = "inicio"
            for target in ("servicos", "avaliacoes", "orcamento", "portfolio", "faq"):
                opener.click()
                expect(self.active(drawer, current)).to_be_focused()
                drawer.locator(f'a[href="#{target}"]').click()
                expect(drawer).to_have_count(0)
                self.assertEqual(page.url.split("#")[-1], target)
                current = target
            page.go_back()
            opener.click()
            expect(self.active(drawer, "portfolio")).to_be_focused()
            page.keyboard.press("Escape")
            expect(opener).to_be_focused()
            page.go_forward()
            opener.click()
            expect(self.active(drawer, "faq")).to_be_focused()
            page.set_viewport_size({"width": 1440, "height": 900})
            desktop = page.get_by_role("navigation", name="Navegação institucional")
            expect(self.active(desktop, "faq")).to_be_focused()
            expect(drawer).to_have_count(0)

    def test_desktop_routes_and_fast_changes(self):
        with self.page_at("#case/jv-salvaia/mobile") as page:
            nav = page.get_by_role("navigation", name="Navegação institucional")
            expect(page.locator("#project-image-view")).to_be_visible()
            self.active(nav, "portfolio")
            nav.locator('a[href="#servicos"]').click()
            self.active(nav, "servicos")
            nav.locator('a[href="#avaliacoes"]').click()
            self.active(nav, "avaliacoes")
            page.go_back()
            self.active(nav, "servicos")
            page.go_back()
            expect(page.locator("#project-image-view")).to_be_visible()
            self.active(nav, "portfolio")
            page.evaluate("""() => ['faq','portfolio','inicio'].forEach(id =>
                document.querySelector('header nav a[href="#' + id + '"]').click())""")
            self.active(nav, "inicio")
            expect(page.locator("#inicio")).to_be_visible()

    def test_founder_specialties_and_old_links(self):
        with self.page_at("#inicio") as page:
            expect(page.locator("#home-offer-title")).to_be_visible()
            expect(page.locator("#fundador")).to_have_count(0)
            nav = page.get_by_role("navigation", name="Navegação institucional")
            nav.locator('a[href="#faq"]').click()
            expect(page.locator("#technical-specialties-heading")).to_be_attached()
            ids = page.locator("#faq, #contato, #fundador, #base-tecnica-especialidades").evaluate_all(
                "(elements) => elements.map(e => e.id)")
            self.assertEqual(ids, ["faq", "contato", "fundador", "base-tecnica-especialidades"])
            expect(page.locator("#cartao-digital")).to_have_count(0)
            for route, target in (("sobre", "#fundador"), ("base-tecnica", "#base-tecnica-especialidades")):
                page.evaluate("route => location.hash = route", route)
                expect(page.locator(target)).to_be_in_viewport()
                self.active(nav, "faq")
            page.locator('#fundador a[href="/cartao/"]').last.click()
            expect(page.get_by_role("heading", name="Everton Lopes")).to_be_visible()
            page.go_back()
            self.active(nav, "faq")
            page.evaluate("location.hash = 'cartao-digital'")
            expect(page.get_by_role("heading", name="Everton Lopes")).to_be_visible()
            self.assertTrue(page.url.endswith("/cartao/"))


if __name__ == "__main__":
    unittest.main()
