# BigClock - Digital Alarm Clock

A feature-rich digital alarm clock with a large LED-style display, YouTube music support, and an intuitive web interface.

<img width="833" height="578" alt="BigClock" src="https://github.com/user-attachments/assets/d9649be8-0e0d-4e02-a93e-1716a6e52424" />

## Features

### Large Digital Display
- Massive LED-style time display with glowing neon effect
- Shows hours, minutes, and seconds with animated colon separators
- Current date displayed above the time
- Smooth glow animation for visual appeal
- Fully responsive design that works on desktop and mobile

### Alarm Management
- Set multiple alarms with custom labels
- Enable/disable alarms with a single toggle
- Edit or delete existing alarms
- Alarms persist between sessions using localStorage
- Visual indicators show which alarms have YouTube music

<img width="892" height="550" alt="BigClock2" src="https://github.com/user-attachments/assets/084700ff-c835-4ef1-ab87-063c77ce45fc" />

### Test Alarm
- Preview your alarm sound before setting it
- Click "Test Alarm" to hear the default sound or YouTube music
- Automatic stop after 10 seconds
- Useful for testing your alarm configuration

### YouTube Music Integration
- Paste any YouTube URL to use as your alarm sound
- Supports standard video URLs: `https://www.youtube.com/watch?v=VIDEO_ID`
- Supports short URLs: `https://youtu.be/VIDEO_ID`
- Supports embed URLs: `https://www.youtube.com/embed/VIDEO_ID`
- Supports playlists - plays the first video and loops
- Automatic fallback to default sound if YouTube fails to load

### Alarm Actions
- **Snooze**: Adds 9 minutes to your alarm time (preserves YouTube setting)
- **Dismiss**: Stops the alarm and resets for the next day
- Visual and audio alerts when alarm triggers
- Pulsing red overlay for clear visual notification

## How to Run

### Option 1: Use the Live URL (Easiest)

Simply open your browser to the deployed version:

```
https://w1r05trg8bf6.space.minimax.io
```

No installation required - works from anywhere with internet access.

### Option 2: Run Locally with Python Server

#### Step 1: Install Python (If Needed)

If you don't have Python installed, you can get it for free from the Microsoft Store:

1. Open the **Microsoft Store** app
2. Search for "Python"
3. Install **Python 3.11** or newer
4. During installation, make sure to check **"Add Python to PATH"**

#### Step 2: Start the Server

1. Open **Command Prompt** or **PowerShell**
2. Navigate to the project folder:

```cmd
cd \workspace\alarm-clock
```

3. Start the Python HTTP server:

```cmd
python -m http.server 8080
```

4. You should see a message like: "Serving HTTP on 0.0.0.0 port 8080"

#### Step 3: Open in Browser

1. Open your web browser
2. Go to: `http://localhost:8080`
3. The alarm clock should load and display the current time

#### Step 4: Stop the Server

When you're done, press `Ctrl+C` in the Command Prompt window to stop the server.

#### Step 5: Create a Windows Launcher (Optional)

Create a batch file to start the server with a single double-click:

1. Create a new file called `start.bat` in your project folder
2. Add the following content:

```batch
@echo off
echo Open - Press and hold Ctrl and click URL: http://localhost:8000/index.html
echo.
echo YouTube Test URL example: https://music.youtube.com/watch?v=dNibWP8f5PQ
echo.

python -m http.server 8000
```

3. Save the file
4. Double-click `start.bat` to start the server
5. Hold Ctrl and click the URL shown to open the alarm clock
6. Press `Ctrl+C` in the command window when done to stop the server

**Tip:** Change the port number in both the batch file and URL if you prefer a different port (e.g., 8080).

### Option 3: Alternative Methods

#### Using Node.js (If Installed)

```cmd
cd \workspace\alarm-clock
npx serve
```

#### Using VS Code Live Server

1. Open the project folder in VS Code
2. Install the "Live Server" extension
3. Right-click on `index.html` and select "Open with Live Server"

#### Running Directly (Limited Features)

You can open `index.html` directly in your browser by double-clicking it, but:
- YouTube music will not work due to browser security restrictions
- The default alarm sound will still function properly

## Usage Guide

### Setting an Alarm

1. Click the **+** button to create a new alarm
2. Select the **Time** using the time picker
3. (Optional) Enter a **Label** like "Wake Up" or "Work"
4. (Optional) Paste a **YouTube URL** to use custom music
5. Click **Save**

### Testing an Alarm

1. Click the **Test Alarm** button
2. You'll hear the default sound or YouTube music if configured
3. Click **Stop** to end the test early

### Managing Alarms

1. Click **My Alarms** to view your alarm list
2. Use the toggle switch to enable/disable an alarm
3. Click the pencil icon to edit an alarm
4. Click the trash icon to delete an alarm

### When an Alarm Rings

- The screen will pulse with a red animation
- You'll hear your alarm sound (YouTube music or default beep)
- Click **Snooze** to delay by 9 minutes
- Click **Dismiss** to stop the alarm

## File Structure

```
alarm-clock/
├── index.html      # Main application file
├── README.md       # This file
├── start.bat       # Windows launcher script
├── test.js         # Playwright tests
└── dist/           # Production build
    └── index.html
```

## Browser Compatibility

Tested and working on:
- Google Chrome (recommended)
- Microsoft Edge
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Limitations

- YouTube integration requires an HTTP server (not file:// protocol)
- The deployed URL is public - anyone with the link can access it
- Alarm storage is local to your browser (no cloud sync)
- Some browsers may block audio autoplay until user interaction

## Credits

Built with vanilla HTML, CSS, and JavaScript. Uses:
- **JetBrains Mono** font for the digital clock display
- **YouTube IFrame API** for music playback
- **Web Audio API** for the default alarm sound

## License

This project is free to use and modify.
