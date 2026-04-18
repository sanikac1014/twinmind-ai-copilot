export default function TranscriptPanel({
  transcript,
  finalTranscript,
  previewText,
  isRecording,
  onToggleRecording,
}) {
  const speechSupported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="h-full rounded-xl border border-blue-900/35 bg-slate-900/90 p-4 shadow-lg shadow-blue-950/20">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-white">Transcript</h2>
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold shadow-md transition-all duration-200 active:scale-[0.97] ${
            isRecording
              ? "border border-red-400/40 bg-red-600 text-white hover:bg-red-500"
              : "border border-blue-500/40 bg-blue-600 text-white hover:border-orange-400 hover:shadow-[0_0_14px_rgba(249,115,22,0.35)]"
          }`}
          onClick={onToggleRecording}
        >
          {isRecording ? "Stop" : "Start"}
        </button>
      </div>
      <div className="h-[80vh] space-y-3 overflow-auto">
        <div
          className={`min-h-[3rem] rounded-lg border bg-slate-950 p-3 text-sm leading-relaxed text-slate-100 transition-all duration-200 ${
            isRecording
              ? "border-orange-500/35 shadow-[0_0_0_1px_rgba(249,115,22,0.12)]"
              : "border-slate-700/90"
          }`}
        >
          <span>{finalTranscript}</span>
          {finalTranscript && previewText ? <span> </span> : null}
          {previewText ? (
            <span className="text-slate-400 transition-opacity duration-200" aria-live="polite">
              {previewText}
            </span>
          ) : null}
          {isRecording && !previewText && !finalTranscript ? (
            <span className="text-slate-500">
              {!speechSupported ? "Listening… (use Chrome for live preview)" : "Listening…"}
            </span>
          ) : null}
        </div>
        {transcript.map((item, idx) => (
          <div
            key={`${item.timestamp}-${idx}`}
            className="rounded-lg border border-slate-800/80 bg-slate-800/60 p-2 text-sm text-slate-200 transition-colors duration-200 hover:border-blue-800/50"
          >
            <div className="text-xs text-slate-500">{item.timestamp}</div>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
