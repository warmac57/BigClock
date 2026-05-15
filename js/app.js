/**
 * BigClock - Refactored Logic (Phase 1-3)
 */

const BigClock = (() => {
    // --- State Management ---
    const state = {
        alarms: [],
        settings: {
            use24HourFormat: false,
            snoozeDuration: 9, // Minutes
            masterVolume: 0.5   // 0 to 1
        },
        editingAlarmId: null,
        currentTriggeringAlarm: null,
        isAlarmPlaying: false,
        isTestAlarmPlaying: false,
        youtubeReady: false
    };

    // --- Audio Logic ---
    let audioContext;
    let alarmOscillator;
    let alarmGain;

    const initAudio = () => {
        console.log('Initializing audio...');
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Created new AudioContext');
        }
        if (audioContext.state === 'suspended') {
            console.log('AudioContext is suspended, resuming...');
            audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully. State:', audioContext.state);
            });
        } else {
            console.log('AudioContext state:', audioContext.state);
        }
    };

    const playDefaultAlarmSound = () => {
        initAudio();
        console.log('Attempting to play default alarm sound. Volume:', state.settings.masterVolume);
        
        if (state.isAlarmPlaying) {
            console.log('Alarm already playing, skipping play command');
            return;
        }

        try {
            alarmOscillator = audioContext.createOscillator();
            alarmGain = audioContext.createGain();

            alarmOscillator.connect(alarmGain);
            alarmGain.connect(audioContext.destination);

            alarmOscillator.type = 'sine';
            alarmOscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            
            // Use master volume
            const gainValue = state.settings.masterVolume * 0.6;
            console.log('Setting gain to:', gainValue);
            alarmGain.gain.setValueAtTime(gainValue, audioContext.currentTime);
            
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfo.frequency.value = 2;
            lfoGain.gain.value = 100;
            lfo.connect(lfoGain);
            lfoGain.connect(alarmOscillator.frequency);
            lfo.start();
            
            alarmOscillator.start();
            state.isAlarmPlaying = true;
            console.log('Oscillator started');
        } catch (e) {
            console.error('Error playing default alarm sound:', e);
        }
    };

    const stopDefaultAlarmSound = () => {
        console.log('Stopping default alarm sound');
        if (alarmOscillator) {
            alarmOscillator.stop();
            alarmOscillator = null;
        }
        state.isAlarmPlaying = false;
        state.isTestAlarmPlaying = false;
    };

    // --- YouTube Integration ---
    const parseYouTubeUrl = (url) => {
        const videoId = _parseYouTubeUrl(url);
        console.log('Parsed YouTube URL:', url, 'VideoID:', videoId);
        return videoId;
    };

    const _parseYouTubeUrl = (url) => {
        if (!url) return null;
        console.log('Parsing URL:', url);
        const patterns = [
            // Standard, Music, Embed, and Mobile URLs
            /(?:youtube\.com\/watch\?v=|music\.youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
            // Short URLs (youtu.be)
            /(?:youtu\.be\/)([^&\n?#]+)/,
            // Playlists (standard and music)
            /(?:youtube\.com\/playlist\?list=|music\.youtube\.com\/playlist\?list=)([^&\n?#]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                console.log('Match found with pattern:', pattern, 'VideoID:', match[1]);
                return match[1];
            }
        }
        console.log('No match found for URL');
        return null;
    };

    const playYouTubeVideo = (videoId) => {
        console.log('Attempting to play YouTube video:', videoId);
        if (!BigClock.state.youtubeReady || !window.youtubePlayer || !videoId) {
            console.log('YouTube not ready, player missing, or no videoId. youtubeReady:', BigClock.state.youtubeReady);
            playDefaultAlarmSound();
            return false;
        }
        try {
            console.log('Loading content into window.youtubePlayer. Volume:', state.settings.masterVolume * 100);
            
            // Ensure player is unmuted
            window.youtubePlayer.unMute();
            window.youtubePlayer.setVolume(state.settings.masterVolume * 100);

            if (videoId.length > 15 || videoId.startsWith('PL')) {
                console.log('Loading playlist:', videoId);
                window.youtubePlayer.loadPlaylist({
                    list: videoId,
                    listType: 'playlist',
                    index: 0,
                    startSeconds: 0,
                    suggestedQuality: 'default'
                });
            } else {
                console.log('Loading single video:', videoId);
                window.youtubePlayer.loadVideoById(videoId);
            }
            
            // Force play after a tiny delay to ensure load has started
            setTimeout(() => {
                if (window.youtubePlayer && window.youtubePlayer.playVideo) {
                    window.youtubePlayer.playVideo();
                    console.log('Force play command issued');
                }
            }, 100);
            
            document.getElementById('youtube-player-container').classList.add('visible');
            state.isAlarmPlaying = true;
            return true;
        } catch (e) {
            console.error('Error in playYouTubeVideo:', e);
            playDefaultAlarmSound();
            return false;
        }
    };

    const stopYouTubeVideo = () => {
        console.log('Stopping YouTube Video');
        if (window.youtubePlayer && BigClock.state.youtubeReady) {
            try {
                window.youtubePlayer.stopVideo();
            } catch (e) {
                console.error('Error stopping YouTube:', e);
            }
        }
        document.getElementById('youtube-player-container').classList.remove('visible');
    };

    // --- Persistence ---
    const loadState = () => {
        const savedAlarms = localStorage.getItem('alarms');
        if (savedAlarms) state.alarms = JSON.parse(savedAlarms);

        const savedSettings = localStorage.getItem('bigClockSettings');
        if (savedSettings) {
            state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
        }
        
        // Sync UI with loaded settings
        document.getElementById('timeFormatToggle').checked = state.settings.use24HourFormat;
    };

    const saveAlarms = () => {
        localStorage.setItem('alarms', JSON.stringify(state.alarms));
    };

    const saveSettings = () => {
        localStorage.setItem('bigClockSettings', JSON.stringify(state.settings));
    };

    // --- UI Rendering ---
    const renderAlarms = () => {
        const alarmsList = document.getElementById('alarmsList');
        const alarmsCount = document.getElementById('alarmsCount');
        
        if (state.alarms.length === 0) {
            alarmsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⏰</div>
                    <p>No alarms set</p>
                    <p>Click + to add one</p>
                </div>
            `;
        } else {
            alarmsList.innerHTML = state.alarms.map(alarm => `
                <div class="alarm-item ${alarm.active ? '' : 'inactive'} ${alarm.youtubeUrl ? 'youtube' : ''}">
                    <div class="alarm-info">
                        <div class="alarm-time">${formatTime(alarm.time)}</div>
                        ${alarm.label ? `<div class="alarm-label">${alarm.label}</div>` : ''}
                        ${alarm.youtubeUrl ? `
                            <div class="alarm-youtube">
                                <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                YouTube
                            </div>
                        ` : ''}
                    </div>
                    <div class="alarm-actions">
                        <button class="btn-edit" data-id="${alarm.id}" title="Edit">✏️</button>
                        <label class="toggle-switch">
                            <input type="checkbox" ${alarm.active ? 'checked' : ''} data-id="${alarm.id}" class="alarm-toggle">
                            <span class="toggle-slider"></span>
                        </label>
                        <button class="btn-delete" data-id="${alarm.id}" title="Delete">🗑️</button>
                    </div>
                </div>
            `).join('');

            // Re-attach listeners to dynamic elements
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.onclick = () => editAlarm(parseInt(btn.dataset.id));
            });
            document.querySelectorAll('.alarm-toggle').forEach(input => {
                input.onchange = () => toggleAlarm(parseInt(input.dataset.id));
            });
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.onclick = () => deleteAlarm(parseInt(btn.dataset.id));
            });
        }
        alarmsCount.textContent = `${state.alarms.length} alarm${state.alarms.length !== 1 ? 's' : ''}`;
    };

    const formatTime = (time24, showAmPm = true) => {
        const [hours, minutes] = time24.split(':');
        const hoursInt = parseInt(hours);
        if (state.settings.use24HourFormat) {
            return `${String(hoursInt).padStart(2, '0')}:${minutes}`;
        } else {
            const ampm = hoursInt >= 12 ? 'PM' : 'AM';
            const hours12 = hoursInt % 12 || 12;
            return showAmPm ? `${hours12}:${minutes} ${ampm}` : `${hours12}:${minutes}`;
        }
    };

    // --- Core Functionality ---
    const updateClock = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        let displayHours = String(hours).padStart(2, '0');
        if (!state.settings.use24HourFormat) {
            displayHours = String(hours % 12 || 12);
        }

        document.getElementById('hours').textContent = displayHours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-US', options);

        checkAlarms(now);
    };

    const checkAlarms = (now) => {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        state.alarms.forEach(alarm => {
            if (alarm.active && alarm.time === currentTime && alarm.lastTriggered !== currentTime) {
                alarm.lastTriggered = currentTime;
                saveAlarms();
                triggerAlarm(alarm);
            }
        });
    };

    const triggerAlarm = (alarm) => {
        state.currentTriggeringAlarm = alarm;
        document.getElementById('triggerTime').textContent = formatTime(alarm.time, false);
        document.getElementById('triggerLabel').textContent = alarm.label || 'Alarm';
        document.getElementById('alarmTriggerOverlay').classList.add('active');

        if (alarm.youtubeUrl) {
            const videoId = parseYouTubeUrl(alarm.youtubeUrl);
            if (videoId) {
                if (!playYouTubeVideo(videoId)) playDefaultAlarmSound();
            } else {
                playDefaultAlarmSound();
            }
        } else {
            playDefaultAlarmSound();
        }
    };

    const stopAlarm = () => {
        stopDefaultAlarmSound();
        stopYouTubeVideo();
        document.getElementById('alarmTriggerOverlay').classList.remove('active');
        state.currentTriggeringAlarm = null;
    };

    const snoozeAlarm = () => {
        const alarmToSnooze = state.currentTriggeringAlarm;
        stopAlarm();
        
        const now = new Date();
        now.setMinutes(now.getMinutes() + state.settings.snoozeDuration);
        const snoozeTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const existingSnooze = state.alarms.find(a => a.isSnooze);
        if (existingSnooze) {
            existingSnooze.time = snoozeTime;
            existingSnooze.active = true;
            existingSnooze.lastTriggered = null;
        } else {
            state.alarms.push({
                id: Date.now(),
                time: snoozeTime,
                label: 'Snooze',
                youtubeUrl: alarmToSnooze ? alarmToSnooze.youtubeUrl : null,
                active: true,
                isSnooze: true,
                lastTriggered: null
            });
        }
        
        saveAlarms();
        renderAlarms();
    };

    // --- Alarm Management ---
    const editAlarm = (id) => {
        const alarm = state.alarms.find(a => a.id === id);
        if (alarm) {
            state.editingAlarmId = id;
            document.getElementById('modalTitle').textContent = 'Edit Alarm';
            document.getElementById('alarmTimeInput').value = alarm.time;
            document.getElementById('alarmLabelInput').value = alarm.label || '';
            document.getElementById('alarmYoutubeInput').value = alarm.youtubeUrl || '';
            document.getElementById('alarmModal').classList.add('active');
        }
    };

    const toggleAlarm = (id) => {
        const alarm = state.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.active = !alarm.active;
            alarm.lastTriggered = null;
            saveAlarms();
            renderAlarms();
        }
    };

    const deleteAlarm = (id) => {
        if (confirm('Delete this alarm?')) {
            state.alarms = state.alarms.filter(a => a.id !== id);
            saveAlarms();
            renderAlarms();
        }
    };

    const saveAlarmFromModal = () => {
        const time = document.getElementById('alarmTimeInput').value;
        const label = document.getElementById('alarmLabelInput').value.trim();
        const youtubeUrl = document.getElementById('alarmYoutubeInput').value.trim();

        if (!time) return alert('Please select a time');
        if (youtubeUrl && !parseYouTubeUrl(youtubeUrl)) return alert('Please enter a valid YouTube URL');

        if (state.editingAlarmId !== null) {
            const index = state.alarms.findIndex(a => a.id === state.editingAlarmId);
            if (index !== -1) {
                state.alarms[index] = { ...state.alarms[index], time, label, youtubeUrl: youtubeUrl || null, lastTriggered: null };
            }
        } else {
            state.alarms.push({ id: Date.now(), time, label, youtubeUrl: youtubeUrl || null, active: true, lastTriggered: null });
        }

        saveAlarms();
        renderAlarms();
        document.getElementById('alarmModal').classList.remove('active');
    };

    // --- Settings Management (Phase 3) ---
    const openSettings = () => {
        document.getElementById('snoozeDurationInput').value = state.settings.snoozeDuration;
        document.getElementById('volumeInput').value = state.settings.masterVolume * 100;
        document.getElementById('settingsModal').classList.add('active');
    };

    const saveSettingsFromModal = () => {
        state.settings.snoozeDuration = parseInt(document.getElementById('snoozeDurationInput').value) || 9;
        state.settings.masterVolume = parseInt(document.getElementById('volumeInput').value) / 100;
        saveSettings();
        document.getElementById('settingsModal').classList.remove('active');
    };

    // --- Event Listeners Setup ---
    const setupEventListeners = () => {
        document.getElementById('addAlarmBtn').onclick = () => {
            initAudio();
            state.editingAlarmId = null;
            document.getElementById('modalTitle').textContent = 'Set Alarm';
            document.getElementById('alarmTimeInput').value = '';
            document.getElementById('alarmLabelInput').value = '';
            document.getElementById('alarmYoutubeInput').value = '';
            document.getElementById('alarmModal').classList.add('active');
        };

        document.getElementById('viewAlarmsBtn').onclick = () => {
            const section = document.getElementById('alarmsSection');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
            if (section.style.display === 'block') renderAlarms();
        };

        document.getElementById('testAlarmBtn').onclick = () => {
            if (state.isTestAlarmPlaying) {
                stopTestAlarm();
                return;
            }
            initAudio();
            document.getElementById('testToast').classList.add('active');
            const btn = document.getElementById('testAlarmBtn');
            btn.classList.add('playing');
            btn.textContent = 'Stop';
            state.isTestAlarmPlaying = true;

            const alarmWithYoutube = state.alarms.find(a => a.youtubeUrl);
            if (alarmWithYoutube) {
                const videoId = parseYouTubeUrl(alarmWithYoutube.youtubeUrl);
                if (videoId) {
                    playYouTubeVideo(videoId);
                    setTimeout(() => { if (state.isTestAlarmPlaying) stopTestAlarm(); }, 10000);
                    return;
                }
            }
            playDefaultAlarmSound();
            setTimeout(() => { if (state.isTestAlarmPlaying) stopTestAlarm(); }, 10000);
        };

        window.stopTestAlarm = () => {
            stopDefaultAlarmSound();
            stopYouTubeVideo();
            document.getElementById('testToast').classList.remove('active');
            const btn = document.getElementById('testAlarmBtn');
            btn.classList.remove('playing');
            btn.textContent = 'Test Alarm';
            state.isTestAlarmPlaying = false;
        };

        document.getElementById('timeFormatToggle').onchange = (e) => {
            state.settings.use24HourFormat = e.target.checked;
            saveSettings();
            renderAlarms();
        };

        document.getElementById('cancelModalBtn').onclick = () => document.getElementById('alarmModal').classList.remove('active');
        document.getElementById('saveAlarmBtn').onclick = saveAlarmFromModal;
        document.getElementById('snoozeBtn').onclick = snoozeAlarm;
        document.getElementById('dismissBtn').onclick = stopAlarm;
        document.getElementById('stopTestBtn').onclick = () => stopTestAlarm();
        
        document.getElementById('openSettingsBtn').onclick = openSettings;
        document.getElementById('cancelSettingsBtn').onclick = () => document.getElementById('settingsModal').classList.remove('active');
        document.getElementById('saveSettingsBtn').onclick = saveSettingsFromModal;

        // Close modals on overlay click
        window.onclick = (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
            }
        };
    };

    // --- Initialization ---
    const init = () => {
        loadState();
        setupEventListeners();
        
        // Protocol check
        if (window.location.protocol === 'file:') {
            console.error('BIGCLOCK: YouTube integration will NOT work on file:// protocol. Please use the included "START ALARM.bat" or a local web server.');
            alert('YouTube music will not work when opening the file directly. Please use "START ALARM.bat" to run the clock correctly.');
        }

        // Dynamically load YouTube API
        console.log('Loading YouTube API...');
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        setInterval(updateClock, 1000);
        updateClock();
        renderAlarms();
    };

    return { 
        init, 
        state, 
        playDefaultAlarmSound 
    }; 
})();

// Move callback out of the closure to ensure YouTube can find it globally
window.onYouTubeIframeAPIReady = () => {
    console.log('YouTube IFrame API is ready. Initializing player...');
    
    // Safely determine origin
    let origin = window.location.origin;
    if (origin === 'null' || !origin) origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    window.youtubePlayer = new YT.Player('youtube-player-container', {
        height: '360', 
        width: '640',
        playerVars: { 
            autoplay: 0, 
            controls: 1, 
            modestbranding: 1, 
            rel: 0, 
            loop: 1, 
            playlist: '',
            origin: origin
        },
        events: {
            onReady: () => { 
                console.log('YouTube Player is fully ready');
                BigClock.state.youtubeReady = true; 
            },
            onStateChange: (event) => { 
                if (event.data === YT.PlayerState.ENDED) window.youtubePlayer.playVideo(); 
            },
            onError: (e) => { 
                console.error('YouTube Player Error Code:', e.data);
                if (BigClock.state.isAlarmPlaying) {
                    console.log('Falling back to default sound due to YouTube error');
                    BigClock.playDefaultAlarmSound(); 
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', BigClock.init);
