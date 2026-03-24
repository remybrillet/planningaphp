/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/planning',
          '/agents',
          '/conges',
          '/remplacements',
          '/rapports',
          '/parametres',
          '/admin',
          '/api',
        ],
        allow: [
          '/login',
          '/mentions-legales',
          '/politique-confidentialite',
        ],
      },
    ],
  },
  exclude: [
    '/planning/*',
    '/agents/*',
    '/conges/*',
    '/remplacements/*',
    '/rapports/*',
    '/parametres/*',
    '/admin/*',
    '/api/*',
  ],
}
