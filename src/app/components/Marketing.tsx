import React from 'react';

const Marketing: React.FC = () => {
  const features = [
    'Fast Registration',
    'Guided Process',
    'Compliant',
    'Reliable'
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12">
            Simplifying Company Registration with AI, Built for Iraq
          </h2>

          {/* Bullet Points */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-3 h-3 bg-primary-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-primary-900">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketing;