import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FaqDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'Test Editor';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);
  const pages = [
    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/about',
      label: 'about',
    },

    {
      href: '/services',
      label: 'services',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },
  ];

  const faqs = [
    {
      question: 'What industries can benefit from ${projectName}?',
      answer:
        '${projectName} is designed for the manufacturing industry, but its flexible features can be adapted to other sectors that require efficient production, inventory, and workforce management.',
    },
    {
      question: 'How does ${projectName} improve inventory management?',
      answer:
        '${projectName} offers real-time tracking of raw materials and finished goods, automated reorder alerts, and comprehensive reports to help maintain optimal inventory levels and reduce waste.',
    },
    {
      question: 'Is ${projectName} customizable to fit our specific needs?',
      answer:
        'Yes, ${projectName} is highly customizable. You can tailor dashboards, reports, and workflows to match your unique business processes and requirements.',
    },
    {
      question: 'What kind of support does ${projectName} offer?',
      answer:
        'We provide 24/7 customer support, including live chat, email, and phone assistance. Our team is dedicated to helping you make the most of ${projectName}.',
    },
    {
      question: 'How secure is the data within ${projectName}?',
      answer:
        '${projectName} employs advanced security measures, including encryption and regular backups, to ensure your data is protected and accessible only to authorized users.',
    },
    {
      question: 'Can ${projectName} integrate with other software?',
      answer:
        'Yes, ${projectName} supports integration with various third-party applications, allowing seamless data exchange and enhanced functionality across your existing systems.',
    },
    {
      question: 'What is the pricing model for ${projectName}?',
      answer:
        '${projectName} offers flexible pricing plans based on the size of your organization and the features you need. Contact us for a customized quote that fits your budget.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Frequently Asked Questions - ${projectName}`}</title>
        <meta
          name='description'
          content={`Find answers to common questions about ${projectName} and our ERP solutions. Get the information you need to make the most of our services.`}
        />
      </Head>
      <WebSiteHeader projectName={'Test Editor'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'Test Editor'}
          image={['Person reading a FAQ document']}
          mainText={`Your Questions Answered with ${projectName}`}
          subTitle={`Explore our comprehensive FAQ section to find answers to your questions about ${projectName}. Get the insights you need to maximize the benefits of our ERP solutions.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Explore FAQs`}
        />

        <FaqSection
          projectName={'Test Editor'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Common Questions About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'Test Editor'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
