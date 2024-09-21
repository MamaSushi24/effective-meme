/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const ContentSecurityPolicy = require('./csp');
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // REDIRECTS,

  redirects: async () => [
    {
      source: '/:path*',
      destination: 'https://www.mamasushi.eu/:path*',
      has: [
        {
          type: 'host',
          value: 'mamasushi.eu',
        },
      ],
      permanent: true,
    },
  ],

  // HEADERS
  async headers() {
    const headers = [];
    // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
    // It works by explicitly whitelisting trusted sources of content for your website
    // This will block all inline scripts and styles except for those that are allowed
    headers.push({
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: ContentSecurityPolicy,
        },
      ],
    });

    return headers;
  },

  webpack(config) {
    // SVGR
    {
      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find(rule =>
        rule.test?.test?.('.svg')
      );

      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          // issuer: /\.[jt]sx?$/,
          resourceQuery: { not: /url/ }, // exclude if *.svg?url
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                        },
                      },
                    },
                    {
                      name: 'prefixIds',
                      active: true,
                    },
                    {
                      name: 'removeDimensions',
                      active: true,
                    },
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                  removeViewBox: false,
                  removeDimensions: true,
                  typescript: true,
                  ref: true,
                },
              },
            },
          ],
        }
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;
    }
    config.optimization = {
      ...config.optimization,
      // usedExports: true,
      sideEffects: true,
      innerGraph: true,
    };
    return config;
  },

  // SASS
  sassOptions: {
    prependData: `@import "@/styles/variables.scss";`,
  },

  // Images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200, 1600, 1920],
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_SERVER_URL,
      process.env.NEXT_PUBLIC_PROD_URL,
    ]
      .filter(Boolean)
      .map(url => url.replace(/https?:\/\//, '')),
    loader: 'custom',
    loaderFile: './src/utils/image-loader.js',
  },
  // i18n
  i18n,
  trailingSlash: false,
  transpilePackages: [
    'swiper',
    'gsap',
    'gsap/ScrollTrigger',
    'antd',
    '@ant-design',
    'rc-pagination',
    'rc-picker',
    'rc-util',
  ],
  experimental: {
    webpackBuildWorker: true,
  },

  // ENV
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL,
    NEXT_PUBLIC_API_GRAPHQL_URL: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  },

  // assetPrefix: isProd ? process.env.NEXT_PUBLIC_PROD_URL : undefined,
  // ...other config
};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
// module.exports = nextConfig;
