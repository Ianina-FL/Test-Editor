import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../stores/hooks';
import LayoutGuest from '../layouts/Guest';
import WebSiteHeader from '../components/WebPageComponents/Header';
import WebSiteFooter from '../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FeaturesDesigns,
  AboutUsDesigns,
  TestimonialsDesigns,
  ContactFormDesigns,
} from '../components/WebPageComponents/designs';

import HeroSection from '../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../components/WebPageComponents/FeaturesComponent';

import AboutUsSection from '../components/WebPageComponents/AboutUsComponent';

import TestimonialsSection from '../components/WebPageComponents/TestimonialsComponent';

import ContactFormSection from '../components/WebPageComponents/ContactFormComponent';

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

  const features_points = [
    {
      name: 'Inventory Management',
      description:
        'Maintain an organized inventory of raw materials and finished goods. Set reorder levels to ensure optimal stock and prevent shortages.',
      icon: 'mdiWarehouse',
    },
    {
      name: 'Work Order Automation',
      description:
        'Create and manage work orders effortlessly. Allocate materials, labor, and machinery efficiently to ensure smooth production runs.',
      icon: 'mdiClipboardCheck',
    },
    {
      name: 'Quality Control Checks',
      description:
        'Implement quality checks at various production stages. Maintain compliance records and address issues promptly to ensure high standards.',
      icon: 'mdiCheckCircleOutline',
    },
  ];

  const testimonials = [
    {
      text: '${projectName} has revolutionized our production process. The efficiency and ease of use are unmatched. Highly recommend!',
      company: 'TechnoCraft Industries',
      user_name: 'John Doe, Production Manager',
    },
    {
      text: 'Thanks to ${projectName}, our inventory management is seamless. We can now focus on growth rather than logistics.',
      company: 'Innovate Manufacturing',
      user_name: 'Jane Smith, Inventory Manager',
    },
    {
      text: "The quality control features in ${projectName} have ensured our products meet the highest standards. It's a game-changer!",
      company: 'Precision Products Co.',
      user_name: 'Emily Johnson, Quality Control Lead',
    },
    {
      text: 'Our supplier relationships have improved significantly with ${projectName}. The transparency and organization are top-notch.',
      company: 'SupplyChain Solutions',
      user_name: 'Michael Brown, Supplier Coordinator',
    },
    {
      text: 'Managing our workforce has never been easier. ${projectName} provides all the tools we need to keep our team productive.',
      company: 'Efficient Enterprises',
      user_name: 'Sarah Lee, HR Manager',
    },
    {
      text: "The comprehensive dashboard in ${projectName} gives us a 360-degree view of our operations. It's an invaluable tool for decision-making.",
      company: 'Global Manufacturing Group',
      user_name: 'David Wilson, Manufacturing Admin',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Comprehensive ERP Solution for Manufacturing`}</title>
        <meta
          name='description'
          content={`Discover our robust ERP solution tailored for the manufacturing industry. Streamline production, inventory, and workforce management with ease.`}
        />
      </Head>
      <WebSiteHeader projectName={'Test Editor'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'Test Editor'}
          image={['Modern factory with machinery']}
          mainText={`Revolutionize Manufacturing with ${projectName} ERP`}
          subTitle={`Experience seamless production, inventory, and workforce management with ${projectName}. Our ERP solution is designed to simplify complexities and enhance efficiency in the manufacturing industry.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Get Started Now`}
        />

        <FeaturesSection
          projectName={'Test Editor'}
          image={['Dashboard showing ERP metrics']}
          withBg={1}
          features={features_points}
          mainText={`Unlock Efficiency with ${projectName} Features`}
          subTitle={`Explore the powerful features of ${projectName} designed to streamline your manufacturing operations and boost productivity.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <AboutUsSection
          projectName={'Test Editor'}
          image={['Team collaborating in modern office']}
          mainText={`Empowering Manufacturing with ${projectName}`}
          subTitle={`At ${projectName}, we are dedicated to transforming the manufacturing industry with our innovative ERP solutions. Our mission is to simplify complex processes and enhance operational efficiency for businesses worldwide.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More About Us`}
        />

        <TestimonialsSection
          projectName={'Test Editor'}
          design={TestimonialsDesigns.MULTI_CARD_DISPLAY || ''}
          testimonials={testimonials}
          mainText={`What Our Clients Say About ${projectName} `}
        />

        <ContactFormSection
          projectName={'Test Editor'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on a laptop']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`Reach out to us anytime for inquiries or support. Our team at ${projectName} is here to assist you promptly and efficiently.`}
        />
      </main>
      <WebSiteFooter projectName={'Test Editor'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
