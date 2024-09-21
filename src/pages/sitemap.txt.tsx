import request, { gql } from 'graphql-request';
import { GetServerSideProps } from 'next';
function generateSiteMap({
  locales,
  groupsSlugs,
  newsSlugs,
  productsSlugs,
}: {
  locales: string[];
  groupsSlugs: { slug: string }[];
  newsSlugs: { slug: string }[];
  productsSlugs: { slug: string }[];
}) {
  const PAGES_SLUGS = ['about-us', 'delivery', 'news'];
  const PAGES_URLS: string[] = PAGES_SLUGS.map(slug => {
    const withLocale = locales
      .map(locale => {
        if (locale === 'pl') return '';
        return `${locale}/${slug}`;
      })
      .filter(Boolean);

    return [...withLocale, slug];
  }).flat();
  const getUrlsForAllLocales = (el: { slug: string }[], rootSlug: string) => {
    return el
      .map(item => {
        const withLocale = locales
          .map(locale => {
            if (locale === 'pl') return '';
            return `${locale}/${rootSlug}/${item.slug}`;
          })
          .filter(Boolean);
        return [...withLocale, `${rootSlug}/${item.slug}`];
      })
      .flat();
  };
  const groupUrls = getUrlsForAllLocales(groupsSlugs, 'group');
  const newsUrls = getUrlsForAllLocales(newsSlugs, 'news');
  const productUrls = getUrlsForAllLocales(productsSlugs, 'product');
  const allUrls = [...groupUrls, ...newsUrls, ...productUrls, ...PAGES_URLS];

  return `${`${process.env.SERVER_URL}`}\n${allUrls
    .map(loc => {
      return `${`${process.env.SERVER_URL}/${loc}`}`;
    })
    .join('\n')}`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}
const getGroupsSlugs = async (): Promise<{ slug: string }[]> => {
  const res = await request<{ Collections: { docs: { slug: string }[] } }>(
    process.env.SERVER_URL + '/api/graphql',
    gql`
      {
        Collections(limit: 99999) {
          docs {
            slug
          }
        }
      }
    `
  ).then(res => res.Collections.docs);
  return res;
};
const getNewsSlugs = async (): Promise<{ slug: string }[]> => {
  const res = await request<{ allNews: { docs: { slug: string }[] } }>(
    process.env.SERVER_URL + '/api/graphql',
    gql`
      {
        allNews(limit: 99999) {
          docs {
            slug
          }
        }
      }
    `
  ).then(res => res.allNews.docs);
  return res;
};
const getProductsSlugs = async (): Promise<{ slug: string }[]> => {
  const res = await request<{ Products: { docs: { slug: string }[] } }>(
    process.env.SERVER_URL + '/api/graphql',
    gql`
      {
        Products(limit: 99999) {
          docs {
            slug
          }
        }
      }
    `
  ).then(res => res.Products.docs);
  return res;
};

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  locales,
}) {
  // We make an API call to gather the URLs for our site
  const groupsSlugs = await getGroupsSlugs();
  const newsSlugs = await getNewsSlugs();
  const productsSlugs = await getProductsSlugs();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap({
    locales: locales as string[],
    groupsSlugs,
    newsSlugs,
    productsSlugs,
  });

  res.setHeader('Content-Type', 'text/plain');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
