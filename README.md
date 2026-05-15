# BigClock - Digital Alarm Clock

A professional, feature-rich digital alarm clock with a high-contrast LED display, YouTube Music integration, and customizable settings.

<img width="833" height="578" alt="BigClock" src="https://github.com/user-attachments/assets/d9649be8-0e0d-4e02-a93e-1716a6e52424" />

## 🌟 New in This Version (Refactor & Enhancements)

This version features a major architectural refactor and several powerful new features:
- **Separated Architecture:** Clean separation of HTML, CSS (`css/style.css`), and Logic (`js/app.js`) for better performance and maintainability.
- **Master Settings Menu:** A new centralized settings modal to control global behavior.
- **Configurable Snooze:** Choose your preferred snooze duration (1-60 minutes).
- **Master Volume Control:** Unified volume slider for both the default alarm beep and YouTube music.
- **Enhanced YouTube Support:** Improved parsing for standard YouTube, YouTube Music, and Playlists.
- **Robust Fallback:** Intelligent error handling that triggers a default alarm if YouTube fails to load.

---

## 🚀 How to Run (Recommended)

### **The Easy Way (Windows)**
1.  Navigate to the project folder.
2.  Double-click **`START ALARM.bat`**.
3.  Your default browser will automatically open to `http://localhost:8000`.
    *   *Note: This is required for YouTube integration to work correctly.*

### **Other Methods**
*   **Python:** `python -m http.server 8000`
*   **Node.js:** `npx serve`
*   **VS Code:** Use the "Live Server" extension.

> [!IMPORTANT]
> Opening `index.html` directly via `file://` will disable YouTube music due to browser security restrictions. Always use the provided batch file or a local web server.

---

## ✨ Features

### **Large Digital Display**
- High-visibility glowing neon effect.
- Animated colon separators.
- Responsive design for Desktop and Mobile.
- Toggle between **12-hour** and **24-hour** formats.

### **Alarm Management**
- **Multiple Alarms:** Create as many alarms as you need.
- **YouTube Music:** Paste any link from YouTube or YouTube Music as your alarm sound.
- **Persistence:** Alarms and settings are saved automatically to your browser.
- **Test Alarm:** Preview your sound and volume before the real alarm goes off.

### **Advanced Settings**
- **Snooze Duration:** Custom 1-60 minute delay.
- **Volume Slider:** Precise control over your wake-up volume.

---

## 🛠️ Project Structure
```text
BigClock/
├── index.html          # Clean entry point
├── START ALARM.bat     # One-click launcher
├── css/
│   └── style.css       # All styles and animations
├── js/
│   └── app.js          # Refactored modular logic
└── test.js             # Playwright automated tests
```

---

## 📋 Usage Guide

1.  **Set an Alarm:** Click the **+** button, pick a time, and optionally paste a YouTube link.
2.  **Adjust Volume:** Click the ⚙️ icon to open Settings and set your master volume.
3.  **Test:** Click **Test Alarm** to ensure your volume and music are perfect.
4.  **Wake Up:** When the alarm triggers, the screen pulses red. Click **Snooze** or **Dismiss**.

---

## 📜 License
This project is free to use and modify for personal use.

---
*Built with Vanilla JS, Web Audio API, and YouTube IFrame API.*
