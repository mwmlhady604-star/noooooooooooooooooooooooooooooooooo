import React from 'react';

const Partners: React.FC = () => {
  const partners = [
    'Ministry of Trade',
    'Chamber of Commerce',
    'Legal Associates',
    'Accounting Firms',
    'Business Incubators'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-900 mb-12">
          Trusted by Government Agencies and Legal Partners
        </h2>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <span className="text-primary-700 font-semibold text-center">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;