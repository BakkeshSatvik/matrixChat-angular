export class RingTone {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  play(): void {
    if (this.isPlaying) {
      return;
    }

    try {
      this.audioContext = new AudioContext();
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Create a simple ring tone pattern
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);

      this.oscillator.start();
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to play ring tone:', error);
    }
  }

  stop(): void {
    if (!this.isPlaying) {
      return;
    }

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }

      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }

      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to stop ring tone:', error);
    }
  }
}
