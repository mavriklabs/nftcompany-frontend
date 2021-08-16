module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  images: {
    domains: ['ui8-crypter-nft-html.herokuapp.com']
  },
  async headers() {
    return [
      {
        source: '/(.*).jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=180, s-maxage=180, stale-while-revalidate=180'
          }
        ]
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=180, s-maxage=180, stale-while-revalidate=180'
          }
        ]
      }
    ];
  }
};
