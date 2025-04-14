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
  AboutUsDesigns,
  FeaturesDesigns,
  TestimonialsDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

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
      name: 'Real-Time Analytics',
      description:
        'Gain insights into your operations with real-time data analytics. Make informed decisions to enhance productivity and efficiency.',
      icon: 'mdiChartLine',
    },
    {
      name: 'Seamless Integration',
      description:
        'Integrate ${projectName} with your existing systems effortlessly. Enjoy a unified platform that enhances workflow and reduces complexity.',
      icon: 'mdiPuzzleOutline',
    },
    {
      name: 'Customizable Dashboards',
      description:
        'Tailor your dashboard to display the metrics that matter most. Stay informed and in control with personalized views.',
      icon: 'mdiViewDashboardOutline',
    },
  ];

  const testimonials = [
    {
      text: '${projectName} has transformed our operations. The efficiency and ease of use are unparalleled. Highly recommend!',
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
        <title>{`About Us - ${projectName}`}</title>
        <meta
          name='description'
          content={`Learn more about ${projectName}, our mission, values, and the innovative ERP solutions we offer to transform the manufacturing industry.`}
        />
      </Head>
      <WebSiteHeader projectName={'Test Editor'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'Test Editor'}
          image={['Team collaborating in office']}
          mainText={`Discover the Heart of ${projectName}`}
          subTitle={`Dive into the story behind ${projectName}. Learn about our mission, values, and the innovative solutions we bring to the manufacturing industry.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Explore Our Journey`}
        />

        <AboutUsSection
          projectName={'Test Editor'}
          image={['Team brainstorming in conference room']}
          mainText={`Our Mission and Vision at ${projectName}`}
          subTitle={`At ${projectName}, we are committed to revolutionizing the manufacturing industry with cutting-edge ERP solutions. Our vision is to empower businesses with tools that drive efficiency and innovation.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More About Us`}
        />

        <FeaturesSection
          projectName={'Test Editor'}
          image={['ERP dashboard on a screen']}
          withBg={1}
          features={features_points}
          mainText={`Explore ${projectName} Core Features`}
          subTitle={`Discover the powerful features of ${projectName} that streamline your manufacturing operations and drive success.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <TestimonialsSection
          projectName={'Test Editor'}
          design={TestimonialsDesigns.HORIZONTAL_CAROUSEL_DIVERSITY || ''}
          testimonials={testimonials}
          mainText={`Hear from Our Satisfied ${projectName} Clients `}
        />
      </main>
      <WebSiteFooter projectName={'Test Editor'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
