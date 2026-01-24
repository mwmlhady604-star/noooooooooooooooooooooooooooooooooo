import React from "react";
import { SessionStatus } from "../types";
import { Phone, PhoneOff, Loader2 } from "lucide-react";

interface BottomToolbarProps {
  sessionStatus: SessionStatus;
  onToggleConnection: () => void;
  isPTTActive: boolean;
  setIsPTTActive: (val: boolean) => void;
  isPTTUserSpeaking: boolean;
  handleTalkButtonDown: () => void;
  handleTalkButtonUp: () => void;
  isEventsPaneExpanded: boolean;
  setIsEventsPaneExpanded: (val: boolean) => void;
  isAudioPlaybackEnabled: boolean;
  setIsAudioPlaybackEnabled: (val: boolean) => void;
  codec: string;
  onCodecChange: (newCodec: string) => void;
}

function BottomToolbar({
  sessionStatus,
  onToggleConnection,
  isPTTActive,
  setIsPTTActive,
  isPTTUserSpeaking,
  handleTalkButtonDown,
  handleTalkButtonUp,
  isEventsPaneExpanded,
  setIsEventsPaneExpanded,
  isAudioPlaybackEnabled,
  setIsAudioPlaybackEnabled,
  codec,
  onCodecChange,
}: BottomToolbarProps) {
  type BottomToolbarProps = {
    onToggleConnection: () => void;
  };
  const isConnected = sessionStatus === "CONNECTED";
  const isConnecting = sessionStatus === "CONNECTING";

  const handleCodecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCodec = e.target.value;
    onCodecChange(newCodec);
  };

  function getConnectionButtonLabel(isConnected: boolean, isConnecting: boolean) {
    if (isConnected) return <PhoneOff className="w-5 h-5 text-white" />;
    if (isConnecting) return <Loader2 className="w-5 h-5 animate-spin text-white" />;
    return <Phone className="w-5 h-5 text-white" />;
  }

  function getConnectionButtonClasses() {
    const baseClasses = 'text-white text-[17px] font-medium px-6 py-3 min-w-[144px] rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-zinc-900 font-sans flex items-center justify-center gap-2';
    const cursorClass = isConnecting ? 'cursor-not-allowed opacity-80' : 'cursor-pointer';

    if (isConnected) {
      // Connected -> label "Disconnect" -> red-500
      return `${baseClasses} bg-red-500 hover:bg-red-600 focus:ring-red-500 ${cursorClass}`;
    }
    // Disconnected or connecting -> label is either "Connect" or "Connecting" -> orange
    return `${baseClasses} bg-orange hover:bg-orange-400 focus:ring-orange-400 ${cursorClass}`;
  }
  const BottomToolbar: React.FC<BottomToolbarProps> = ({ onToggleConnection }) => {
    return (
      <div className="fixed bottom-0 w-full p-4 bg-gray-700 text-white flex justify-center  hidden  ">
        <button
          onClick={onToggleConnection}
          className="bg-green-600 px-4 py-2 rounded"
        >
          تبديل الاتصال
        </button>
      </div>
    );
  };
  return (
    <div className="p-4 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex flex-row items-center justify-center gap-x-8 text-zinc-50 shadow-2xl   hidden  ">
      <button
        onClick={onToggleConnection}
        className={getConnectionButtonClasses()}
        disabled={isConnecting}
      >
        {getConnectionButtonLabel(isConnected, isConnecting)}
      </button>

      <div className="flex flex-row items-center gap-2">
        <input
          id="push-to-talk"
          type="checkbox"
          checked={isPTTActive}
          onChange={(e) => setIsPTTActive(e.target.checked)}
          disabled={!isConnected}
          className="w-5 h-5 rounded-md border-zinc-500 text-orange focus:ring-orange-500 bg-zinc-800 cursor-pointer accent-orange"
        />
        <label
          htmlFor="push-to-talk"
          className="flex items-center cursor-pointer   hidden"
        >
          اضغط للتحدث
        </label>
        <button
          onMouseDown={handleTalkButtonDown}
          onMouseUp={handleTalkButtonUp}
          onTouchStart={handleTalkButtonDown}
          onTouchEnd={handleTalkButtonUp}
          disabled={!isPTTActive}
          className={
            (isPTTUserSpeaking ? "bg-orange-400 scale-105 shadow-orange/50" : "bg-orange") +
            " py-2 px-6 cursor-pointer rounded-full font-sans transition-all duration-300 shadow-md flex items-center justify-center " +
            (!isPTTActive ? " opacity-50 cursor-not-allowed bg-zinc-700 text-zinc-400 shadow-none scale-100" : " text-white hover:shadow-lg hover:scale-105")
          }
        >
          تحدث
        </button>
      </div>

      <div className="flex flex-row items-center gap-1">
        <input
          id="audio-playback"
          type="checkbox"
          checked={isAudioPlaybackEnabled}
          onChange={(e) => setIsAudioPlaybackEnabled(e.target.checked)}
          disabled={!isConnected}
          className="w-5 h-5 rounded-md border-zinc-500 text-orange focus:ring-orange-500 bg-zinc-800 cursor-pointer accent-orange"
        />
        <label
          htmlFor="audio-playback"
          className="flex items-center cursor-pointer hidden   "
        >
          تشغيل الصوت
        </label>
      </div>
      <div className="hidden   ">
        <div className="flex flex-row items-center gap-2  hidden">
          <input
            id="logs"
            type="checkbox"
            checked={isEventsPaneExpanded}
            onChange={(e) => setIsEventsPaneExpanded(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="logs" className="flex items-center cursor-pointer hidden    ">
            السجلات
          </label>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div>الترميز:</div>
        {/*
          Codec selector – Lets you force the WebRTC track to use 8 kHz 
          PCMU/PCMA so you can preview how the agent will sound 
          (and how ASR/VAD will perform) when accessed via a 
          phone network.  Selecting a codec reloads the page with ?codec=...
          which our App-level logic picks up and applies via a WebRTC monkey
          patch (see codecPatch.ts).
        */}
        <select
          id="codec-select"
          value={codec}
          onChange={handleCodecChange}
          className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange cursor-pointer text-zinc-100 font-sans text-[17px] shadow-sm transition-all hover:border-zinc-500"
        >
          <option value="opus">Opus (48 kHz)</option>
          <option value="pcmu">PCMU (8 kHz)</option>
          <option value="pcma">PCMA (8 kHz)</option>
        </select>
      </div>
    </div>
  );
}

export default BottomToolbar;
