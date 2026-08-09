from playwright.sync_api import sync_playwright
import os

def test_mobile_menu(file_path):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 375, 'height': 812})
        page.goto(f'file:///{file_path}')
        
        menu = page.locator('#mobile-menu')
        btn = page.locator('#mobile-menu-btn')
        
        # Initially hidden
        assert not menu.is_visible(), f"Failed in {file_path}: Menu should be hidden initially"
        
        # Click to open
        btn.click()
        assert menu.is_visible(), f"Failed in {file_path}: Menu should be visible after first click"
        
        # Click to close
        btn.click()
        assert not menu.is_visible(), f"Failed in {file_path}: Menu should be hidden after second click"
        
        browser.close()
        print(f"Pass: Mobile menu toggles correctly in {file_path}")

base_path = "E:/All DELTA SYNTH Official Website/src"
test_mobile_menu(os.path.join(base_path, "index.html"))
test_mobile_menu(os.path.join(base_path, "about.html"))
