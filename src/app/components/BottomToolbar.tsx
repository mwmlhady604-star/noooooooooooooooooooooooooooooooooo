import React from "react";
import { SessionStatus } from "@/app/types";
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
  if (isConnected) return <PhoneOff className="w-5 h-5 text-red-500" />;
  if (isConnecting) return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />;
  return <Phone className="w-5 h-5 text-green-500" />;
}

 function getConnectionButtonClasses() {
  const baseClasses = 'text-white text-base p-2 w-36 rounded-md h-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const cursorClass = isConnecting ? 'cursor-not-allowed' : 'cursor-pointer';

  if (isConnected) {
    // Connected -> label "Disconnect" -> red
    return `${baseClasses} bg-red-600 hover:bg-red-700 focus:ring-red-500 ${cursorClass}`;
  }
  // Disconnected or connecting -> label is either "Connect" or "Connecting" -> black
  return `${baseClasses} bg-black hover:bg-gray-900 focus:ring-gray-500 ${cursorClass}`;
}
const BottomToolbar: React.FC<BottomToolbarProps> = ({ onToggleConnection }) => {
  return (
    <div className="fixed bottom-0 w-full p-4 bg-gray-700 text-white flex justify-center  hidden  ">
      <button
        onClick={onToggleConnection}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Toggle Connection
      </button>
    </div>
  );
};
  return (
    <div className="p-4 flex flex-row items-center justify-center gap-x-8   hidden  ">
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
          className="w-4 h-4"
        />
        <label
          htmlFor="push-to-talk"
          className="flex items-center cursor-pointer   hidden"
        >
          Push to talk
        </label>
        <button
          onMouseDown={handleTalkButtonDown}
          onMouseUp={handleTalkButtonUp}
          onTouchStart={handleTalkButtonDown}
          onTouchEnd={handleTalkButtonUp}
          disabled={!isPTTActive}
          className={
            (isPTTUserSpeaking ? "bg-gray-300" : "bg-gray-200") +
            " py-1 px-4 cursor-pointer rounded-md" +
            (!isPTTActive ? " bg-gray-100 text-gray-400" : "")
          }
        >
          Talk
        </button>
      </div>

      <div className="flex flex-row items-center gap-1">
        <input
          id="audio-playback"
          type="checkbox"
          checked={isAudioPlaybackEnabled}
          onChange={(e) => setIsAudioPlaybackEnabled(e.target.checked)}
          disabled={!isConnected}
          className="w-4 h-4"
        />
        <label
          htmlFor="audio-playback"
          className="flex items-center cursor-pointer hidden   "
        >
          Audio playback
        </label>
      </div>
<div  className="hidden   ">  
      <div className="flex flex-row items-center gap-2  hidden">
        <input
          id="logs"
          type="checkbox"
          checked={isEventsPaneExpanded}
          onChange={(e) => setIsEventsPaneExpanded(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="logs" className="flex items-center cursor-pointer hidden    ">
          Logs
        </label>
      </div>
 </div>
      <div className="flex flex-row items-center gap-2">
        <div>Codec:</div>
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
          className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
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
