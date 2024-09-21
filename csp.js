const policies = {
  'default-src': ["'self'", 'https://www.mamasushi.eu', 'https://mamasushi.eu'],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://maps.googleapis.com',
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    `https://tagmanager.google.com`,
  ],
  'child-src': [
    "'self'",
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://www.googletagmanager.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    `https://www.googletagmanager.com`,
    `https://tagmanager.google.com`,
    `https://fonts.googleapis.com`,
  ],
  'img-src': [
    "'self'",
    'https://raw.githubusercontent.com',
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://www.google-analytics.com',
    'https://www.facebook.com',
    `https://ssl.gstatic.com`,
    'https://www.googletagmanager.com',
    'https://fonts.gstatic.com',
    'data:',
  ].filter(Boolean),
  'font-src': [
    "'self'",
    'data:',
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://fonts.gstatic.com',
  ],
  'frame-src': [
    "'self'",
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://www.facebook.com/',
    'https://www.googletagmanager.com',
    'https://www.google.com/',
  ],
  'connect-src': [
    "'self'",
    'https://maps.googleapis.com',
    'https://www.mamasushi.eu',
    'https://mamasushi.eu',
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
  ],
};

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`;
    }
    return '';
  })
  .join('; ');
