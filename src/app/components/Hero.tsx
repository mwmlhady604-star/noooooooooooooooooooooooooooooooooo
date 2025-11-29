import React, { useState, useRef, useEffect } from 'react';
import Button from './shared/Button';
import Counter from './shared/Counter';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import emailjs from '@emailjs/browser';

const Hero: React.FC<{ 
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  downloadRecording: () => void;
}> = ({ userText, setUserText, onSendMessage, canSend, downloadRecording }) => {
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

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-0 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center pt-8 pb-4">
          <Counter end={1000} duration={3000} />
        </div>

        {/* Main Content - Moved higher and increased title size */}
        <div className="mt-4 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Text Content - Smaller portion (1 unit) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-dark-800 mt-2 leading-tight">
                BRM  
              </h2>
              <h3 className="text-2xl lg:text-3xl font-semibold text-dark-800 mt-2 leading-tight">
                Your smart guide to registering and launching your business in Iraq
              </h3>
              <div className='mt-8'>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Get expert assistance and streamlined processes for your business registration needs in Iraq
              </p>
              </div>
              {/* CTA Button with golden ratio proportions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                
              </div>
            </div>
          </div>
          
          {/* Lottie Animation - Larger portion (1.618 units) */}
          <div className="flex-[1.618] flex items-center justify-center">
            <div className="w-full max-w-2xl flex items-center justify-center">
              <DotLottieReact
                src="/Audio&Voice-A-001.lottie"
                loop
                autoplay
                className="w-full max-w-[500px] h-auto aspect-square"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal with Golden Ratio Proportions */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative mx-4">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            
            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-800 mb-2">
                Start Company Registration
              </h2>
              <p className="text-gray-700 text-sm">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Full Name"
                  required
                  className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-dark-800"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Email Address"
                  required
                  className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-dark-800"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Tell us about your business needs..."
                  required
                  rows={4}
                  className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-dark-800"
                />
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                type="submit"
                className="w-full hover:scale-105 transition-transform duration-200"
              >
                Send Message
              </Button>
              
              {status && (
                <p className={`text-sm mt-3 text-center ${
                  status.includes("successfully") ? "text-green-600" : "text-red-600"
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