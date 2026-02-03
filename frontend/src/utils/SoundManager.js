class SoundManager {
    constructor() {
        this.context = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
    }

    init() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSiren() {
        if (this.isPlaying) return;
        this.init();
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        this.isPlaying = true;

        // Create nodes
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();

        // Configure "Sci-Fi" Siren (Modulated Sine Wave)
        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.value = 880; // Start high

        // Modulation (The "Whoop Whoop" effect)
        const now = this.context.currentTime;
        this.oscillator.frequency.setValueAtTime(800, now);
        this.oscillator.frequency.linearRampToValueAtTime(1200, now + 0.3); // Up
        this.oscillator.frequency.linearRampToValueAtTime(800, now + 0.6); // Down
        this.oscillator.frequency.linearRampToValueAtTime(1200, now + 0.9); // Up

        // Volume Envelope
        this.gainNode.gain.setValueAtTime(0.1, now);
        this.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);

        // Connect
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);

        // Start/Stop
        this.oscillator.start(now);
        this.oscillator.stop(now + 1);

        this.oscillator.onended = () => {
            this.isPlaying = false;
        };
    }
}

export const soundManager = new SoundManager();
