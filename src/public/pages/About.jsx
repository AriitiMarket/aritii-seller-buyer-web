import React from 'react';
import PublicPageLayout from '@/public/layout/PublicPageLayout';
import SectionHeader from '@/public/components/SectionHeader';
import Breadcrumb from '@/public/components/Breadcrumb';

const AboutPage = () => {
  return (
    <PublicPageLayout>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      
      <SectionHeader
        title="About Aritii Market"
        description="Ethiopia's trusted multi-vendor marketplace"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Aritii Market connects customers with local sellers and makes trusted commerce accessible across Ethiopia.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-400">To build a reliable, inclusive marketplace where buyers and independent businesses can grow together.</p>
        </div>

        <div className="bg-gradient-to-br from-[#75d04b]/10 to-[#5ac12f]/10 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A marketplace built around trust</h3>
          <p className="text-gray-600 dark:text-gray-400">Browse verified products, discover independent shops, and manage your purchases in one customer experience.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Trust', 'Local Growth', 'Simple Shopping', 'Customer First'].map((value) => (
            <div key={value} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default AboutPage;