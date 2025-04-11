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
  FeaturesDesigns,
  TestimonialsDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import TestimonialsSection from '../../components/WebPageComponents/TestimonialsComponent';

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
      name: 'Advanced Production Planning',
      description:
        'Optimize your production schedules with our advanced planning tools. Ensure timely delivery and efficient resource allocation.',
      icon: 'mdiCalendarClock',
    },
    {
      name: 'Comprehensive Inventory Control',
      description:
        'Maintain optimal inventory levels with real-time tracking and automated alerts. Reduce waste and improve stock management.',
      icon: 'mdiWarehouse',
    },
    {
      name: 'Integrated Supplier Management',
      description:
        'Streamline supplier interactions with integrated management tools. Enhance communication and ensure timely material delivery.',
      icon: 'mdiHandshakeOutline',
    },
    {
      name: 'Dynamic Workforce Management',
      description:
        'Manage your workforce efficiently with tools for scheduling, payroll, and performance tracking. Boost productivity and employee satisfaction.',
      icon: 'mdiAccountGroup',
    },
    {
      name: 'Robust Quality Assurance',
      description:
        'Implement rigorous quality checks at every stage of production. Ensure compliance and maintain high product standards.',
      icon: 'mdiCheckCircle',
    },
    {
      name: 'Real-Time Data Analytics',
      description:
        'Gain insights into your operations with real-time analytics. Make informed decisions to enhance efficiency and growth.',
      icon: 'mdiChartLineVariant',
    },
  ];

  const testimonials = [
    {
      text: '${projectName} has completely transformed our production process. The efficiency and ease of use are unparalleled. Highly recommend!',
      company: 'TechnoCraft Solutions',
      user_name: 'Alice Johnson, Operations Manager',
    },
    {
      text: 'With ${projectName}, our inventory management is seamless. We can now focus on growth rather than logistics.',
      company: 'Innovate Manufacturing',
      user_name: 'Bob Smith, Inventory Specialist',
    },
    {
      text: "The quality control features in ${projectName} have ensured our products meet the highest standards. It's a game-changer!",
      company: 'Precision Products Co.',
      user_name: 'Cathy Lee, Quality Assurance Lead',
    },
    {
      text: 'Our supplier relationships have improved significantly with ${projectName}. The transparency and organization are top-notch.',
      company: 'SupplyChain Dynamics',
      user_name: 'David Brown, Supplier Coordinator',
    },
    {
      text: 'Managing our workforce has never been easier. ${projectName} provides all the tools we need to keep our team productive.',
      company: 'Efficient Enterprises',
      user_name: 'Emma Wilson, HR Director',
    },
    {
      text: "The comprehensive dashboard in ${projectName} gives us a 360-degree view of our operations. It's an invaluable tool for decision-making.",
      company: 'Global Manufacturing Group',
      user_name: 'Frank Miller, Manufacturing Admin',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Our Services - ${projectName}`}</title>
        <meta
          name='description'
          content={`Explore the comprehensive services offered by ${projectName} to enhance your manufacturing operations. Discover how our ERP solutions can streamline processes and drive success.`}
        />
      </Head>
      <WebSiteHeader projectName={'Test Editor'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'Test Editor'}
          image={['Factory floor with machinery']}
          mainText={`Transform Your Operations with ${projectName}`}
          subTitle={`Discover the range of services offered by ${projectName} to streamline your manufacturing processes. Our ERP solutions are designed to enhance efficiency and drive growth.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Explore Our Services`}
        />

        <FeaturesSection
          projectName={'Test Editor'}
          image={['ERP system interface on screen']}
          withBg={0}
          features={features_points}
          mainText={`Unleash the Power of ${projectName} Services`}
          subTitle={`Explore the key features of ${projectName} that are designed to optimize your manufacturing operations and drive success.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS_DIVERSITY || ''}
        />

        <TestimonialsSection
          projectName={'Test Editor'}
          design={TestimonialsDesigns.MULTI_CARD_DISPLAY || ''}
          testimonials={testimonials}
          mainText={`What Our Clients Say About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'Test Editor'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
