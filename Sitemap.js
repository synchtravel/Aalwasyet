// generateSitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname: 'https://alhijaztours.net' });
  // Add your React app's routes here

  const routes = [
  '/',
  '/about-us',
  '/contact-us',
  '/umrah-packages',
  '/package_invoice/:id',
  '/umrah-package/:id',
  '/search-tour',
  '/hotels',
  '/hotel_detail/:id',
  '/hotel_checkout',
  '/Flight_checkout',
  '/book_package',
  '/hotel_booking_invoice/:id',
  '/package_checkout',
  '/invoice_package/:id/:id/:id',
  '/Flight_search',
  '/Flight_invoice/:id',
  '/umrah_packages',
  '/faqs',
  '/privacy_policy',
  '/terms_and_conditions',
  '/complaint_policy'
];


  routes.forEach(route => {
    sitemap.write({ url: route, changefreq: 'weekly', priority: 0.7 });
    // You can customize changefreq and priority as needed
  });

  sitemap.end();

  const sitemapPath = './public/sitemap.xml'; // Adjust the path as needed
  await streamToPromise(sitemap).then((sm) => {
    fs.writeFileSync(sitemapPath, sm.toString());
    console.log(`Sitemap generated at ${sitemapPath}`);
  });
};

generateSitemap();