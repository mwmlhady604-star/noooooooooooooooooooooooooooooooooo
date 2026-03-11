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
  onSendQuickMessage?: (text: string) => void;
}

const STEPS_KEYWORDS = ["الخطوات", "إجراءات", "خطوة", "تسجيل", "المتطلبات", "الوثائق", "المستندات"];

function isStepsMessage(title: string, isUser: boolean): boolean {
  if (isUser || title.length < 200) return false;
  return STEPS_KEYWORDS.some(kw => title.includes(kw));
}

function printMessageAsPdf(content: string) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);
  const html = `<!DOCTYPE html><html dir="rtl"><head>
    <meta charset="utf-8"/>
    <title>خطوات التسجيل</title>
    <style>
      body { font-family: Arial, sans-serif; direction: rtl; padding: 40px; color: #111; line-height: 1.8; }
      h1 { color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 8px; }
      p, li { font-size: 14px; }
      @media print { body { padding: 20px; } }
    </style>
  </head><body>
    <h1>خطوات تسجيل المشروع — دليل ILO</h1>
    <div>${content.replace(/\n/g, '<br/>')}</div>
  </body></html>`;
  iframe.contentDocument!.open();
  iframe.contentDocument!.write(html);
  iframe.contentDocument!.close();
  setTimeout(() => {
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 300);
}

function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
  downloadRecording,
  onSendQuickMessage,
}: TranscriptProps) {
  const [emailInputItemId, setEmailInputItemId] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
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

                // Read citation stored via consumePendingCitation → updateTranscriptItem
                const citationTag: string | undefined = !isUser ? data?.citation : undefined;
                const refMatch = citationTag
                  ? citationTag.match(/\[REF:([^|]+)\|([^\]]+)\]/)
                  : null;
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
                      {refMatch && (
                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[11px] text-zinc-400 leading-none">
                            دليل ILO للتسجيل التجاري
                            <span className="mx-1 text-zinc-300">·</span>
                            {refMatch[1]}
                            <span className="mx-1 text-zinc-300">·</span>
                            {refMatch[2]}
                          </span>
                        </div>
                      )}
                      {isStepsMessage(title, isUser) && (
                        <div className="mt-2 flex flex-col gap-1.5 px-1" dir="rtl">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEmailInputItemId(emailInputItemId === itemId ? null : itemId)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              إرسال للبريد
                            </button>
                            <button
                              onClick={() => printMessageAsPdf(displayTitle)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                              </svg>
                              تحميل PDF
                            </button>
                          </div>
                          {emailInputItemId === itemId && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (emailValue.trim() && onSendQuickMessage) {
                                  onSendQuickMessage(`أريد إرسال هذه الخطوات إلى بريدي الإلكتروني: ${emailValue.trim()}`);
                                  setEmailInputItemId(null);
                                  setEmailValue("");
                                }
                              }}
                              className="flex gap-2 mt-1"
                            >
                              <input
                                type="email"
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)}
                                placeholder="أدخل بريدك الإلكتروني"
                                className="flex-1 text-[12px] px-3 py-1.5 border border-zinc-200 rounded-lg outline-none focus:border-orange-400 text-right"
                                autoFocus
                              />
                              <button
                                type="submit"
                                disabled={!emailValue.trim()}
                                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[12px] font-medium hover:bg-orange-600 disabled:opacity-40 transition-colors"
                              >
                                إرسال
                              </button>
                            </form>
                          )}
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