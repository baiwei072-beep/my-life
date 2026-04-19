#!/usr/bin/env python3
from contextlib import suppress
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright, expect
import os


HOST = "127.0.0.1"
PORT = 4173
BASE_URL = f"http://{HOST}:{PORT}"


def start_server() -> ThreadingHTTPServer:
    root = Path(__file__).resolve().parents[1]
    os.chdir(root)
    server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def run() -> None:
    server = start_server()
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            context = browser.new_context()
            page = context.new_page()

            page.goto(f"{BASE_URL}/login.html", wait_until="networkidle")
            expect(page.locator(".login-title")).to_contain_text("属于你自己的房间")

            page.locator('input[name="nickname"]').fill("Mike")
            page.locator('.js-auth-form[data-mode="wechat"] button[type="submit"]').click()
            page.wait_for_url(f"{BASE_URL}/index.html")

            overlay = page.locator(".js-avatar-picker")
            expect(overlay).to_be_hidden()

            avatar_trigger = page.locator(".js-avatar-trigger").first
            avatar_trigger.click()
            expect(overlay).to_be_visible()
            expect(page.locator(".avatar-option")).to_have_count(6)

            overlay.click(position={"x": 10, "y": 10})
            expect(overlay).to_be_hidden()

            expect(page.locator(".js-delete-post")).to_have_count(2)

            page.locator("#post-title").fill("今天突然想到一个商业点子")
            page.locator("#post-category").fill("随手记")
            page.locator("#post-excerpt").fill("先记下来，看看后面会不会长成项目。")
            page.locator("#post-body").fill("如果把语音记录和自动归档做成一个很轻的私人空间，也许会有人需要。")
            page.locator('#post-form button[type="submit"]').click()

            dynamic_delete = page.locator('.post-card[data-slug] .js-delete-post').first
            expect(dynamic_delete).to_be_visible()

            page.once("dialog", lambda dialog: dialog.accept())
            dynamic_delete.click()
            expect(page.locator('.post-card[data-slug]')).to_have_count(0)

            browser.close()
    finally:
        server.shutdown()
        with suppress(Exception):
            server.server_close()


if __name__ == "__main__":
    run()
