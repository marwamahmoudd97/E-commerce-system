import React from 'react';
import { Music, Award, Users, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    {
      icon: Music,
      title: 'Wide Selection',
      description: 'Over 10,000 instruments from top brands worldwide'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Every product is inspected and verified by experts'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our team of musicians is here to help you'
    },
    {
      icon: Heart,
      title: 'Passion for Music',
      description: 'We love music as much as you do'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About MusicStore</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 mb-12">
          <p className="text-lg">
            Welcome to MusicStore, your premier destination for quality musical instruments since 2015.
            We're passionate about helping musicians of all levels find the perfect instrument to express their creativity.
          </p>
          
          <p>
            Founded by musicians, for musicians, we understand the importance of having the right tools
            to bring your musical vision to life. Our carefully curated selection includes everything from
            guitars and keyboards to drums and professional audio equipment.
          </p>
          
          <p>
            We work directly with manufacturers and authorized distributors to ensure authenticity and quality.
            Every instrument in our store is inspected by our team of experts before it reaches you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
