import React from 'react';
import Card from './shared/Card';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Document Preparation',
      description: 'AI-assisted preparation of all required registration documents'
    },
    {
      title: 'Legal Guidance',
      description: 'Step-by-step guidance through Iraqi company registration laws'
    },
    {
      title: 'Progress Tracking',
      description: 'Real-time tracking of your registration application status'
    },
    {
      title: 'Expert Consultation',
      description: 'Connect with legal experts for complex registration cases'
    },
    {
      title: 'Post-Registration Support',
      description: 'Ongoing support for license renewals and compliance'
    }
  ];

  return (
    <section className="py-16 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900">
            Registration Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-3">
                {service.title}
              </h3>
              <p className="text-primary-600">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;