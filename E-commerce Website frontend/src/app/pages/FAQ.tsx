import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-7 business days. Express shipping is available and takes 1-2 business days. Free shipping is offered on orders over $99.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all products in their original condition. If you\'re not satisfied with your purchase, you can return it for a full refund or exchange.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please contact us for specific information about your country.'
    },
    {
      question: 'Are your products authentic?',
      answer: 'Yes, all our instruments are 100% authentic and sourced directly from manufacturers or authorized distributors. Every product comes with a certificate of authenticity.'
    },
    {
      question: 'Do you offer warranties?',
      answer: 'Yes, all our products come with manufacturer warranties. The warranty period varies by product and brand. Extended warranties are also available for purchase.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you\'ll receive a tracking number via email. You can also track your order status in your account dashboard.'
    },
    {
      question: 'Do you offer financing options?',
      answer: 'Yes, we partner with several financing companies to offer flexible payment plans. Options include 0% APR for qualified purchases. Check at checkout for available offers.'
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 24 hours of placement. After that, the order enters processing and cannot be changed. Please contact us immediately if you need to make changes.'
    },
    {
      question: 'Do you price match?',
      answer: 'Yes, we offer price matching on identical products sold by authorized dealers. Contact us with proof of the lower price, and we\'ll match it.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and financing through our partner companies.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Please contact our customer support team.
          </p>
          <a href="/contact" className="text-primary hover:underline font-medium">
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
};
