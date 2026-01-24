"use-client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TranscriptItem } from "../types";
import Image from "next/image";
import { useTranscript } from "../contexts/TranscriptContext";
import { DownloadIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { GuardrailChip } from "./GuardrailChip";

export interface TranscriptProps {
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  downloadRecording: () => void;
}

function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
  downloadRecording,
}: TranscriptProps) {
  const { transcriptItems, toggleTranscriptItemExpand } = useTranscript();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (transcriptRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        // Adding a small delay to ensure content is fully rendered
        setTimeout(() => {
          if (transcriptRef.current) {
            transcriptRef.current.scrollTo({
              top: transcriptRef.current.scrollHeight,
              behavior: "smooth"
            });
          }
        }, 0);
      });
    }
  }

  useEffect(() => {
    // Scroll to bottom when transcript items change
    scrollToBottom();
  }, [transcriptItems]);

  // Autofocus on text box input on load
  useEffect(() => {
    if (canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canSend]);

  const handleCopyTranscript = async () => {
    if (!transcriptRef.current) return;
    try {
      await navigator.clipboard.writeText(transcriptRef.current.innerText);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-0 rounded-xl font-montserrat h-full">
      <div className="flex flex-col flex-1 min-h-0 h-full">
        <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-10 text-base border-b bg-white rounded-t-xl">
          <span className="font-semibold text-dark-800">Transcript</span>
          <div className="flex gap-x-2">
            <button
              onClick={handleCopyTranscript}
              className="w-24 text-sm px-3 py-1 rounded-md bg-primary-100 hover:bg-primary-200 text-primary-500 flex items-center justify-center gap-x-1 hidden"
            >
              <ClipboardCopyIcon />
              {justCopied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={downloadRecording}
              className="w-40 text-sm px-3 py-1 rounded-md bg-primary-100 hover:bg-primary-200 text-primary-500 flex items-center justify-center gap-x-1 hidden"
            >
              <DownloadIcon />
              <span>Download Audio</span>
            </button>
          </div>

        </div>

        {/* Transcript Content */}
        <div
          ref={transcriptRef}
          className="overflow-y-auto p-4 flex flex-col gap-y-4 flex-1 min-h-0"
        >
          {[...transcriptItems]
            .sort((a, b) => a.createdAtMs - b.createdAtMs)
            .map((item) => {
              const {
                itemId,
                type,
                role,
                data,
                expanded,
                timestamp,
                title = "",
                isHidden,
                guardrailResult,
              } = item;

              if (isHidden) {
                return null;
              }

              if (type === "MESSAGE") {
                const isUser = role === "user";

                // Show typing indicator for assistant messages that are in progress
                if (!isUser && status === "IN_PROGRESS" && (!title || title.trim() === "")) {
                  return (
                    <div key={itemId} className="flex justify-start items-start">
                      <div className="bg-primary-50 text-dark-800 max-w-lg p-3 rounded-t-xl rounded-b-xl">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom" style={{ animationDelay: '0.4s' }}></div>
                          <span className="ml-2 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const containerClasses = `flex justify-end flex-col ${isUser ? "items-end" : "items-start"
                  }`;
                const bubbleBase = `max-w-lg p-3 ${isUser ? "bg-dark-800 text-white" : "bg-primary-50 text-dark-800"
                  }`;
                const isBracketedMessage =
                  title.startsWith("[") && title.endsWith("]");
                const messageStyle = isBracketedMessage
                  ? 'italic text-gray-400'
                  : '';
                const displayTitle = isBracketedMessage
                  ? title.slice(1, -1)
                  : title;

                return (
                  <div key={itemId} className={containerClasses}>
                    <div className="max-w-lg">
                      <div
                        className={`${bubbleBase} rounded-t-xl ${guardrailResult ? "" : "rounded-b-xl"
                          }`}
                      >
                        <div
                          className={`text-xs ${isUser ? "text-gray-400" : "text-gray-500"
                            } font-mono`}
                        >
                          {timestamp}
                        </div>
                        <div className={`whitespace-pre-wrap text-zinc-700 ${messageStyle}`}>
                          <ReactMarkdown>{displayTitle}</ReactMarkdown>
                        </div>
                      </div>
                      {guardrailResult && (
                        <div className="bg-gray-200 px-3 py-2 rounded-b-xl">
                          <GuardrailChip guardrailResult={guardrailResult} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else if (type === "BREADCRUMB") {
                // Hide breadcrumb items to show only the typing indicator
                return null;
              } else {
                // Fallback if type is neither MESSAGE nor BREADCRUMB
                return (
                  <div
                    key={itemId}
                    className="flex justify-center text-gray-500 text-sm italic font-mono"
                  >
                    Unknown item type: {type}{" "}
                    <span className="ml-2 text-xs">{timestamp}</span>
                  </div>
                );
              }
            })}
        </div>
      </div>

      <div className="p-4 flex items-center gap-x-2 flex-shrink-0 border-t border-gray-200">
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) {
              onSendMessage();
            }
          }}
          className="flex-1 px-4 py-2 focus:outline-none text-dark-800 bg-white border border-primary-200 rounded-lg"
          placeholder={canSend ? "Type your message or use voice..." : "Connect to start chatting..."}
          disabled={!canSend}
        />
        <button
          onClick={onSendMessage}
          disabled={!canSend || !userText.trim()}
          className="bg-primary-500 text-white rounded-full px-2 py-2 disabled:opacity-50 hover:bg-primary-600"
        >
          <Image src="arrow.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}

export default Transcript;