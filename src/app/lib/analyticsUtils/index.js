import Cookie from 'js-cookie';
import pathOr from 'ramda/src/pathOr';
import onClient from '../utilities/onClient';

export const getDestination = statsDestination => {
  const destinationIDs = {
    NEWS_PS: 598285,
    NEWS_LANGUAGES_PS: 598291,
    NEWS_GNL: 598287,
    NEWS_LANGUAGES_GNL: 598289,
    NEWS_PS_TEST: 598286,
    NEWS_LANGUAGES_PS_TEST: 598292,
    NEWS_LANGUAGES_GNL_TEST: 598290,
    NEWS_GNL_TEST: 598288,
    WS_NEWS_LANGUAGES: 598342,
    WS_NEWS_LANGUAGES_TEST: 598343,
    PLACEHOLDER: 598295,
    PLACEHOLDER_TEST: 598297,
  };

  return destinationIDs[statsDestination] || destinationIDs.NEWS_PS;
};

export const getAppType = platform =>
  platform === 'amp' ? 'amp' : 'responsive';

export const isLocServeCookieSet = platform => {
  if (platform === 'amp') {
    return false;
  }

  if (onClient()) {
    return !!Cookie.get('loc_serve');
  }

  return null;
};

export const getScreenInfo = platform => {
  if (platform === 'amp') {
    return `\${screenWidth}x\${screenHeight}x\${screenColorDepth}`;
  }

  if (onClient()) {
    const { width, height, colorDepth, pixelDepth } = window.screen;
    const orderArray = [
      width || 0,
      height || 0,
      colorDepth || 0,
      pixelDepth || 0,
    ];

    return orderArray.join('x');
  }

  return null;
};

export const getBrowserViewPort = platform => {
  if (platform === 'amp') {
    return `\${availableScreenWidth}x\${availableScreenHeight}`;
  }

  if (onClient()) {
    const { innerWidth, innerHeight } = window;

    return [innerWidth || 0, innerHeight || 0].join('x');
  }

  return null;
};

export const getCurrentTime = platform => {
  if (platform === 'amp') {
    return `\${timestamp}`;
  }

  if (onClient()) {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();

    return [hours, mins, secs].join('x');
  }

  return null;
};

export const getDeviceLanguage = platform => {
  if (platform === 'amp') {
    // Using browserlanguage since AMP doesn't have access to device language
    return `\${browserLanguage}`;
  }

  if (onClient() && navigator.language) {
    return navigator.language;
  }

  return null;
};

export const getHref = platform => {
  if (platform === 'amp') {
    return `\${sourceUrl}`;
  }

  if (onClient() && window.location.href) {
    const { href } = window.location;
    return href.replace('#', '%23');
  }

  return null;
};

export const getReferrer = (platform, origin, previousPath) => {
  if (platform === 'amp') {
    return `\${documentReferrer}`;
  }

  if (onClient() && (document.referrer || previousPath)) {
    return previousPath ? `${origin}${previousPath}` : document.referrer;
  }

  return null;
};

export const getAtUserId = () => {
  if (onClient()) {
    const atuserid = Cookie.getJSON('atuserid');
    return pathOr(null, ['val'], atuserid);
  }

  return null;
};

export const sanitise = initialString =>
  initialString ? initialString.trim().replace(/\s/g, '+') : null;

const isValidDateTime = dateTime => !isNaN(dateTime); // eslint-disable-line no-restricted-globals

const getISODate = unixTimestamp => {
  const date = new Date(unixTimestamp);
  return date.toISOString();
};

export const getPublishedDatetime = (attribute, data) => {
  const publishedDatetime = pathOr(null, ['metadata', attribute], data);

  return publishedDatetime && isValidDateTime(publishedDatetime)
    ? getISODate(publishedDatetime)
    : null;
};

export const getProducer = service => {
  const producers = {
    igbo: '53',
    news: '64',
    persian: '69',
    pidgin: '70',
    thai: '90',
    yoruba: '107',
  };

  return producers[service] || 0;
};

export const getAtiUrl = (data = []) => {
  const cleanedValues = data.filter(({ value }) => value);

  const parsedAtiValues = cleanedValues.map(({ key, value, wrap }) =>
    wrap ? `${key}=[${value}]` : `${key}=${value}`,
  );

  return parsedAtiValues.join('&');
};

export const getEventInfo = (
  pageIdentifier,
  { service, componentName, componentInfo, type, variantTesting, userId },
) => {
  const campaignId = `${service}-${componentName}`;
  const creationLabel = pathOr('', ['creationLabel'], componentInfo);
  const url = pathOr('', ['url'], componentInfo);
  const elementPositioning = componentInfo.positioning
    ? `PAR=${componentInfo.positioning.parent}::name~CHD=${componentInfo.positioning.child}`
    : '';
  const metadata = elementPositioning;
  const result = url;
  const finalVariantTesting = variantTesting || '';
  const finalUserId = userId || '';

  const atiParamString = `PUB-[${campaignId}]-[${creationLabel}~${type}]-[${finalVariantTesting}]-[${metadata}]-[${pageIdentifier}]-[${finalUserId}]-[responsive_web~news-simorgh]-[${result}]`;
  return atiParamString;
};

export const getComponentInfo = ({ url, componentName, componentData }) => {
  const creationLabel = componentData.creationLabel
    ? `${componentName}-${componentData.creationLabel}`
    : componentName;

  return {
    creationLabel,
    url,
    adId: pathOr('', ['adId'], componentData),
    positioning: {
      parent: `container-${componentName}`,
      child: pathOr('', ['child'], componentData),
    },
  };
};
