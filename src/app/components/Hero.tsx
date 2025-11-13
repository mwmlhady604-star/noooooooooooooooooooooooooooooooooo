import React, { useState } from 'react';
import Button from './shared/Button';
import Counter from './shared/Counter';

const Hero: React.FC = () => {
  const [open, setOpen] = useState(false);       // form modal
  const [openVideo, setOpenVideo] = useState(false); // video modal
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const response = await fetch("https://formspree.io/f/mwpngwze", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setStatus("✅ Your request has been sent successfully.");
      form.reset();
    } else {
      setStatus("❌ There was an error sending your request. Please try again.");
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-6">
            Iraq's First AI Assistant for Company Registration Services.
          </h1>

          {/* Supporting Line */}
          <p className="text-xl md:text-2xl text-primary-700 mb-8 max-w-3xl mx-auto">
            Available 24/7 to guide you through company registration processes and connect you with experts when needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
              Register Your Company
            </Button>
            <Button variant="outline" size="lg" onClick={() => setOpenVideo(true)}>
              See How It Works
            </Button>
          </div>

          {/* Dynamic Counter */}
          <div className="text-primary-600">
            <p className="text-lg">
              Helping <Counter end={5000} /> businesses register successfully across Iraq.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-primary-800 mb-4">Start Company Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              />
              <Button variant="primary" size="lg" type="submit">
                Send Request
              </Button>
              {status && <p className="text-sm text-primary-600 mt-2">{status}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {openVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative p-4">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setOpenVideo(false)}
            >
              ✕
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-96 rounded-lg"
                src="https://www.youtube.com/embed/ZFPGo70-bnU?si=aJmmNi_XtIcUQ1cC"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
