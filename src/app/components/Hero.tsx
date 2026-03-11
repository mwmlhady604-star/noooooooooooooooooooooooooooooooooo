import React, { useState, useRef, useEffect } from 'react';
import Button from './shared/Button';
import Counter from './shared/Counter';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import emailjs from '@emailjs/browser';
import styles from './Hero.module.css';

const QUICK_QUESTIONS = [
  { label: "أنواع تسجيل الشركات", question: "ما هي أنواع تسجيل الشركات المتاحة في العراق؟" },
  { label: "أقل تكلفة للتسجيل", question: "ما هو أقل تكلفة لتسجيل الشركة؟" },
  { label: "مدة التسجيل", question: "كم تستغرق عملية تسجيل الشركة؟" },
  { label: "فرق الصغيرة والمتوسطة", question: "ما الفرق بين الشركات الصغيرة والمتوسطة؟" },
  { label: "متطلبات التسجيل", question: "ما هي المتطلبات الأساسية لتسجيل شركة؟" },
  { label: "مشروع فردي", question: "كيف أسجل مشروعاً تجارياً فردياً؟" },
];

const Hero: React.FC<{
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  downloadRecording: () => void;
  onToggleConnection?: () => void;
  onQuickQuestion?: (question: string) => void;
}> = ({ userText, setUserText, onSendMessage, canSend, downloadRecording, onToggleConnection, onQuickQuestion }) => {
  const [open, setOpen] = useState(false);       // form modal
  const [openVideo, setOpenVideo] = useState(false); // video modal
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const form = useRef<HTMLFormElement>(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch('/api/email/send-brm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Guide sent successfully to ${email}! Please check your inbox.`);
        // Reset the form
        setEmail("");
        setPhone("");
      } else {
        console.error("Failed to send guide:", result.error);
        alert("Failed to send guide. Please try again.");
      }
    } catch (error) {
      console.error("Error sending guide:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          form.current,
          'YOUR_PUBLIC_KEY'
        )
        .then(
          (result) => {
            console.log(result.text);
            setStatus("Message sent successfully!");
            if (form.current) form.current.reset();
          },
          (error) => {
            console.log(error.text);
            setStatus("Failed to send message. Please try again.");
          }
        );
    }
  };

  const handleToggleConnection = () => {
    if (onToggleConnection) {
      onToggleConnection();
    }
  };

  return (
    <section className="bg-[color:var(--background)] py-0 font-sans relative overflow-hidden">
      {/* Floating particles (simulated with absolute divs and pulse/bounce) */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-orange-500 rounded-full opacity-30 animate-pulse duration-[4000ms]"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-orange-400 rounded-full opacity-30 animate-bounce duration-[5000ms]"></div>
      <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-orange-600 rounded-full opacity-40 animate-pulse duration-[6000ms]"></div>
      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-orange-500 rounded-full opacity-25 animate-pulse duration-[5000ms]"></div>
      <div className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-35 animate-bounce duration-[4500ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full opacity-20 animate-pulse duration-[5500ms]"></div>
      <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-orange-600 rounded-full opacity-30 animate-bounce duration-[4000ms]"></div>
      <div className="absolute bottom-40 left-1/5 w-1 h-1 bg-orange-400 rounded-full opacity-40 animate-pulse duration-[6000ms]"></div>
      <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-orange-500 rounded-full opacity-25 animate-bounce duration-[4500ms]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Main Content - Moved higher and increased title size */}
        <div className="mt-4 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Text Content - Smaller portion (1 unit) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg text-center lg:text-left">

              <h3 className={`text-5xl lg:text-6xl font-bold text-zinc-900 mt-2 leading-tight ${styles.bubbleGrow}`}>
                دليلك الذكي لتسجيل وإطلاق أعمالك في العراق
              </h3>
              <div className='mt-8'>
                <p className={`text-[17px] text-zinc-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${styles.pulseFade}`}>
                  احصل على مساعدة الخبراء وعمليات مبسطة لاحتياجات تسجيل أعمالك في العراق
                </p>
              </div>
              {/* CTA Button with expanding rings */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center ">
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-orange rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${styles.ringPulse}`}></div>
                  <div className="absolute -inset-1 rounded-full animate-ping opacity-20 bg-orange duration-1000"></div>
                  <button onClick={handleToggleConnection} className={`relative px-8 py-4 bg-orange text-white rounded-full font-bold shadow-lg shadow-orange/30 hover:shadow-xl hover:bg-orange-600 hover:scale-105 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out ${styles.hoverGlow} group`}>
                    <span className="relative z-10">اتصل الان</span>
                    <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 ${styles.shimmer}`}></div>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* added Hero Animation Timing
1.2s
Bubble Grow

cubic-bezier(0.25, 0.1, 0.25, 1)
1.5s
Ring Pulse

cubic-bezier(0.215, 0.61, 0.355, 1)
300ms
Hover Transitions

ease-in-out */}
          <div className="flex-[1.618] flex items-center justify-center ">
            <div className="w-full max-w-2xl flex items-center justify-center">
              <div className={styles.animationContainer}>
                <div className={`${styles.bubble} ${styles.bubble1}`}></div>
                <div className={`${styles.bubble} ${styles.bubble2}`}></div>
                <div className={`${styles.bubble} ${styles.bubble3}`}></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 opacity-25 blur-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section — 2 columns */}
      <div className="bg-[color:var(--background)] border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">أسئلة شائعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.label}
                onClick={() => onQuickQuestion?.(q.question)}
                className="group flex items-center justify-between text-left py-4 border-b border-zinc-100 hover:border-orange-200 transition-colors duration-150"
              >
                <span className="text-[15px] font-medium text-zinc-700 group-hover:text-orange-600 transition-colors">{q.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-400">
            لديك سؤال آخر؟{" "}
            <button
              onClick={() => onQuickQuestion?.("مرحباً، لدي سؤال")}
              className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2 transition-colors"
            >
              تحدث مع المساعد الذكي
            </button>
          </p>
        </div>
      </div>

      {/* Modal with Golden Ratio Proportions */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-down">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative mx-4 border border-zinc-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                ابدأ تسجيل الشركة
              </h2>
              <p className="text-zinc-500 text-sm">
                املأ النموذج أدناه وسنقوم بالرد عليك في غضون 24 ساعة
              </p>
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="الاسم الكامل"
                  required
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange transition-all duration-200 text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="البريد الإلكتروني"
                  required
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange transition-all duration-200 text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="أخبرنا عن احتياجات عملك..."
                  required
                  rows={4}
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange transition-all duration-200 resize-none text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full bg-orange hover:bg-orange-600 text-white rounded-full py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                إرسال الرسالة
              </Button>

              {status && (
                <p className={`text-sm mt-3 text-center ${status.includes("successfully") ? "text-green-600" : "text-red-600"
                  }`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;