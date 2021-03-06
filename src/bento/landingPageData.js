import gql from 'graphql-tag';
// import Test from '../assets/header/CTDC_Logo.svg';

// The ideal image size of landingPageHero 1400x600px
// Tile1 Tile2 Tile3 images 293x349 px
// Tile4 image optimum size 600x 436 px
export const landingPageData = {
  callToActionTitle: 'The TARGET Data Portal.',
  callToActionDescription: 'TARGET applies a comprehensive genomic approach to determine molecular changes that drive childhood cancers.',
  callToActionButtonText: 'EXPLORE',
  callToActionLink: '/cases',
  landingPageHero: {
    alt: 'Alt tag1',
    img: 'https://raw.githubusercontent.com/CBIIT/bento-brand-artifacts/main/bento-demo/GDC-Bento.Hero-white.jpg',
  },
  landingPageStatsBar: [
    {
      statTitle: 'Programs',
      statAPI: 'numberOfPrograms',
    },
    {
      statTitle: 'Projects',
      statAPI: 'numberOfProjects',
    },
    {
      statTitle: 'Cases',
      statAPI: 'numberOfSubjects',
    },
    {
      statTitle: 'samples',
      statAPI: 'numberOfSamples',
    },
    {
      statTitle: 'files',
      statAPI: 'numberOfFiles',
    },
  ],
  tile1: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/bento-brand-artifacts/main/bento-demo/GDC.About.png',
    titleText: 'The Bento Framework',
    descriptionText: 'Effective data management is key to scientific discovery. Bento is an open source framework, developed by the Frederick National Laboratory for Cancer Research, to support the creation of data sharing platforms, that adhere to the FAIR principles of scientific data management. The TARGET Data Portal has been implemented in Bento.',
    callToActionText: 'Read More',
    callToActionLink: '/bento', // This links to the "About" static page.
  },
  tile2: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/bento-brand-artifacts/main/bento-demo/GDC.Programs.png',
    titleText: 'Programs',
    descriptionText: 'TARGET generates genomic data on childhood cancers.',
    callToActionText: 'View',
    callToActionLink: '/programs', // This links to the Programs Listing Page.
  },
  tile3: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/bento-brand-artifacts/main/bento-demo/GDC.Analytics.png',
    titleText: 'Resources',
    descriptionText: 'Use Bento to build your own data sharing platform.',
    callToActionText: 'Read More',
    callToActionLink: '/resources', // Link to the "Resources" Static Page
  },
  tile4: {
    alt: '',
    img: 'https://raw.githubusercontent.com/CBIIT/bento-frontend/master/src/assets/landing/tileCases.png',
    titleText: 'Analytics',
    descriptionText: 'Analyze cases from the TARGET program.',
    callToActionText: 'Explore',
    callToActionLink: '/cases', // This links to the cases dashboard.
  },
};

// --------------- GraphQL query - Retrieve Landing page data --------------
export const GET_LANDING_PAGE_DATA_QUERY = gql`{
  numberOfPrograms
  numberOfProjects
  numberOfSubjects
  numberOfSamples
  numberOfFiles
  }
  `;
