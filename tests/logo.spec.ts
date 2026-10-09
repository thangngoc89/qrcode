import { test, expect } from '@playwright/test';

test.describe('Logo QR and Preset Icons on First Click', () => {
  // Helper to count non-white, non-black colored pixels in the center of the QR code canvas
  const countCenterColoredPixels = async (page: any) => {
    return await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;
      const ctx = canvas.getContext('2d');
      if (!ctx) return 0;
      // Sample 80x80 area at the center of the canvas
      const size = 80;
      const x = Math.floor(canvas.width / 2 - size / 2);
      const y = Math.floor(canvas.height / 2 - size / 2);
      const data = ctx.getImageData(x, y, size, size).data;
      let nonWhiteNonBlack = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const isWhite = r > 240 && g > 240 && b > 240;
        const isBlack = r < 20 && g < 20 && b < 20;
        if (!isWhite && !isBlack) {
          nonWhiteNonBlack++;
        }
      }
      return nonWhiteNonBlack;
    });
  };

  test('default clean load has no logo (classic QR)', async ({ page }) => {
    await page.goto('/');
    const coloredPixels = await countCenterColoredPixels(page);
    expect(coloredPixels).toBe(0);
  });

  test('clicking Logo QR toggle immediately renders a logo on first click', async ({ page }) => {
    await page.goto('/');
    // Clean initial state
    expect(await countCenterColoredPixels(page)).toBe(0);

    // Click Logo QR button directly
    const logoQRBtn = page.locator('button', { hasText: 'Logo QR' }).first();
    await logoQRBtn.click();

    // Canvas center must immediately have colored pixels from the default logo
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(100);

    // Switching back to Classic QR immediately clears the logo
    const classicQRBtn = page.locator('button', { hasText: 'Classic QR' }).first();
    await classicQRBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBe(0);
  });

  test('clicking preset icons updates the center logo on the very first click', async ({ page }) => {
    await page.goto('/');

    // Switch to Logo subtab directly
    const logoSubTabBtn = page.locator('button', { hasText: 'Logo' }).first();
    await logoSubTabBtn.click();

    // Click Love Heart icon on first click
    const heartBtn = page.locator('button:has(img[alt="Love Heart"])');
    await heartBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(500);

    // Click WiFi icon on first click
    const wifiBtn = page.locator('button:has(img[alt="WiFi"])');
    await wifiBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(500);

    // Click WhatsApp icon on first click
    const whatsappBtn = page.locator('button:has(img[alt="WhatsApp"])');
    await whatsappBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(100);

    // Click Instagram icon on first click
    const instagramBtn = page.locator('button:has(img[alt="Instagram"])');
    await instagramBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(500);

    // Click Remove Logo button and verify logo is cleared
    const removeBtn = page.locator('button', { hasText: 'Remove Logo' }).first();
    await removeBtn.click();
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBe(0);
  });

  test('custom logo upload immediately renders on first file selection', async ({ page }) => {
    await page.goto('/');

    // Click Logo subtab
    await page.locator('button', { hasText: 'Logo' }).first().click();

    // Prepare a 40x40 solid magenta-red PNG buffer
    const redPngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAcElEQVR4AezSwQkAIBADQbFH+y9FKwgE9nPgCr7uAjJm33Xu5LvX8OMD6QcpqCAVoHk7qCAVoHk7qCAVoHk7qCAVoHk7qCAVoPlfOkidcl7BbNNNFOyc8paC2aabKNg55S0Fs003UbBzylsKZptu8gAAAP//a9n+9AAAAAZJREFUAwAkRl1J7TB4WAAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(redPngBase64, 'base64');

    // Upload via file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'red-square.png',
      mimeType: 'image/png',
      buffer,
    });

    // Verify center contains red / colored pixels immediately
    await expect.poll(async () => await countCenterColoredPixels(page), { timeout: 3000 }).toBeGreaterThan(200);
  });
});
