import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export function SpeechSettingsPanel() {
  const { supported, settings, setAccent, setRate, speak } = useSpeechSynthesis()

  if (!supported) return null

  return (
    <section className="speech-settings panel">
      <div className="speech-settings-head">
        <div>
          <h3>发音设置</h3>
          <p>统一控制所有单词、短语和例句的发音口音与语速，设置会自动保存在本地。</p>
        </div>
        <button
          className="secondary-btn"
          type="button"
          onClick={() => speak('speech-preview', 'Basic English makes learning clear and easy.')}
        >
          试听
        </button>
      </div>
      <div className="speech-settings-grid">
        <div className="speech-setting-group">
          <span className="speech-setting-label">口音</span>
          <div className="speech-toggle-row">
            <button
              className={`speech-toggle ${settings.accent === 'en-US' ? 'active' : ''}`}
              type="button"
              onClick={() => setAccent('en-US')}
            >
              美音
            </button>
            <button
              className={`speech-toggle ${settings.accent === 'en-GB' ? 'active' : ''}`}
              type="button"
              onClick={() => setAccent('en-GB')}
            >
              英音
            </button>
          </div>
        </div>
        <div className="speech-setting-group">
          <div className="speech-rate-head">
            <span className="speech-setting-label">语速</span>
            <strong>{settings.rate.toFixed(2)}x</strong>
          </div>
          <input
            className="speech-rate-slider"
            type="range"
            min="0.7"
            max="1.4"
            step="0.05"
            value={settings.rate}
            onChange={(event) => setRate(Number(event.target.value))}
          />
          <div className="speech-rate-scale">
            <span>慢</span>
            <span>正常</span>
            <span>快</span>
          </div>
        </div>
      </div>
    </section>
  )
}
