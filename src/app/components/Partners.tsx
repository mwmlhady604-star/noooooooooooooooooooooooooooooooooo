import React from 'react';

const Partners: React.FC = () => {
  const partners = [
    '',
    '',
    '',
    '',
    ''
  ];

  return (
    <section className="py-16 bg-white relative font-montserrat">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/republic-of-iraq-ministry-of-trade-logo-png_seeklogo-369016.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '400px',
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        

       

        {/* Manual Book Section */}
        <div className="row d-flex justify-content-center mt-16" id="manual-book">
          <div className="col-lg-10">
            <div 
              style={{ 
                position: 'relative', 
                paddingTop: 'max(60%, 324px)', 
                width: '100%', 
                height: 0,
                backgroundImage: "url('/republic-of-iraq-ministry-of-trade-logo-png_seeklogo-369016.png')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '400px',
              }}
            >
              <iframe 
                style={{ position: 'absolute', border: 'none', width: '100%', height: '100%', left: 0, top: 0 }} 
                src="https://online.fliphtml5.com/bfjkx/ecwy/" 
                seamless
                scrolling="no" 
                frameBorder="0" 
                allowTransparency={true} 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;