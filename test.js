const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const errors = [];

    // Collect console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    // Collect page errors
    page.on('pageerror', err => {
        errors.push(err.message);
    });

    const filePath = path.join(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    // Wait for page to load and time to render
    await page.waitForTimeout(2000);

    // Check if main elements are visible
    const timeDisplay = await page.$('.time-display');
    const dateDisplay = await page.$('.date-display');
    const addAlarmBtn = await page.$('#addAlarmBtn');
    const testAlarmBtn = await page.$('#testAlarmBtn');

    if (!timeDisplay) {
        errors.push('Time display not found');
    }

    if (!dateDisplay) {
        errors.push('Date display not found');
    }

    if (!addAlarmBtn) {
        errors.push('Add alarm button not found');
    }

    if (!testAlarmBtn) {
        errors.push('Test alarm button not found');
    }

    // Test clicking add alarm button
    await addAlarmBtn.click();
    await page.waitForTimeout(500);

    const modalVisible = await page.$eval('#alarmModal', el => el.classList.contains('active'));
    if (!modalVisible) {
        errors.push('Modal did not open when add alarm button clicked');
    }

    // Check for YouTube input field
    const youtubeInput = await page.$('#alarmYoutubeInput');
    if (!youtubeInput) {
        errors.push('YouTube input field not found');
    }

    // Close modal
    await page.click('#cancelModalBtn');
    await page.waitForTimeout(300);

    // Test clicking test alarm button
    await testAlarmBtn.click();
    await page.waitForTimeout(500);

    const testToastVisible = await page.$eval('#testToast', el => el.classList.contains('active'));
    if (!testToastVisible) {
        errors.push('Test alarm toast did not appear');
    }

    const testBtnText = await page.$eval('#testAlarmBtn', el => el.textContent);
    if (testBtnText !== 'Stop') {
        errors.push('Test alarm button did not change to Stop');
    }

    // Click stop
    await page.click('#testToast button');
    await page.waitForTimeout(300);

    const testBtnTextAfter = await page.$eval('#testAlarmBtn', el => el.textContent);
    if (testBtnTextAfter !== 'Test Alarm') {
        errors.push('Test alarm button did not revert to Test Alarm');
    }

    // Test clicking view alarms button
    await page.click('#viewAlarmsBtn');
    await page.waitForTimeout(300);

    const alarmsSectionVisible = await page.$eval('#alarmsSection', el => el.style.display !== 'none');
    if (!alarmsSectionVisible) {
        errors.push('Alarms section did not toggle');
    }

    await browser.close();

    if (errors.length > 0) {
        console.log('Test FAILED with errors:');
        errors.forEach(err => console.log(`  - ${err}`));
        process.exit(1);
    } else {
        console.log('All tests PASSED!');
        process.exit(0);
    }
})();
