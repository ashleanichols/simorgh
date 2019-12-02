import React from 'react';
import { render } from '@testing-library/react';
import { shouldMatchSnapshot } from '@bbc/psammead-test-helpers';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import BulletinContainer from '.';

const tvBulletinItem = {
  name: 'Test TV Bulletin promo',
  summary: 'Test TV summary',
  indexImage: {
    id: '63711781',
    subType: 'index',
    href: 'http://b.files.bbci.co.uk/4917/test/_63711781_clinton.jpg',
    path: '/cpsdevpb/4917/test/_63711781_clinton.jpg',
    height: 371,
    width: 660,
    altText: 'Clinton',
    caption: 'Clinton',
    copyrightHolder: 'BBC',
  },
  uri: 'https://www.bbc.co.uk/news',
  contentType: 'TVBulletin',
  assetTypeCode: 'PRO',
  timestamp: 1565085977000,
  type: 'link',
};

const liveTvBulletinItem = {
  ...tvBulletinItem,
  isLive: true,
};

const radioBulletinItem = {
  name: 'Test Radio Bulletin promo',
  summary: 'Test Radio summary',
  indexImage: {
    id: '63711781',
    subType: 'index',
    href: 'http://b.files.bbci.co.uk/4917/test/_63711781_clinton.jpg',
    path: '/cpsdevpb/4917/test/_63711781_clinton.jpg',
    height: 371,
    width: 660,
    altText: 'Clinton',
    caption: 'Clinton',
    copyrightHolder: 'BBC',
  },
  uri: 'https://www.bbc.co.uk/news',
  contentType: 'RadioBulletin',
  assetTypeCode: 'PRO',
  timestamp: 1571655919000,
  type: 'link',
};

const liveRadioBulletinItem = {
  ...radioBulletinItem,
  isLive: true,
};

const BulletinWithContext = item => (
  <ServiceContextProvider service="igbo">
    <BulletinContainer item={item} />
  </ServiceContextProvider>
);

describe('Bulletin Container', () => {
  describe('snapshots', () => {
    shouldMatchSnapshot(
      'should render a TV bulletin correctly',
      BulletinWithContext(tvBulletinItem),
    );

    shouldMatchSnapshot(
      'should render a Live TV bulletin correctly',
      BulletinWithContext(liveTvBulletinItem),
    );

    shouldMatchSnapshot(
      'should render a Radio bulletin correctly',
      BulletinWithContext(radioBulletinItem),
    );

    shouldMatchSnapshot(
      'should render a Live Radio bulletin correctly',
      BulletinWithContext(liveRadioBulletinItem),
    );
  });

  describe('assertion tests', () => {
    it('should render the LIVE offscreen text', () => {
      const { container } = render(BulletinWithContext(liveTvBulletinItem));
      const span = container.getElementsByTagName('span')[2];

      expect(span.getAttribute('aria-hidden')).toBeDefined();
      expect(span.getAttribute('aria-hidden')).toEqual('true');
      expect(span.textContent).toEqual('LIVE');
    });
  });
});
