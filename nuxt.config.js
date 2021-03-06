const parseArgs = require('minimist');
const postcssImport = require('postcss-import');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCustomMedia = require('postcss-custom-media');
const postcssNested = require('postcss-nested');
const postcssColorHexAlpha = require('postcss-color-hex-alpha');
const postcssFixes = require('postcss-fixes');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');

const parties = require('./src/static/parties.json');

const googleAnalyzeID = 'UA-116314029-1';
const argv = parseArgs(process.argv.slice(2), {
  alias: { H: 'hostname', p: 'port' },
  string: ['H'],
  unknown: _parameter => false,
});
const port = argv.port || process.env.PORT || process.env.npm_package_config_nuxt_port || '3000';
const host = argv.hostname || process.env.HOST || process.env.npm_package_config_nuxt_host || 'localhost';
const postcss = [
  postcssImport(),
  postcssCustomProperties({ preserve: false }),
  postcssCustomMedia(),
  postcssNested(),
  postcssColorHexAlpha(),
  postcssFixes(),
  postcssUrl(),
  autoprefixer(),
];
// 動的ルーティングのページをある程度静的に吐き出したい箇所はここにセット
const routes = parties.map(({ date }) => `/parties/${date}`);

/*
 * meta
 */
const title = "TWWARR - Tokai web worker's association for rare restaurants.";
const description = "TWWARR (Tokai web worker's association for rare restaurants) official site";
const metaImage = 'https://dummyimage.com/300x200/3b8070/fff.png&text=Nuxt.js+template';
const baseUrl = process.env.BASE_URL || `http://${host}:${port}`;
const og = [
  // { property: 'og:type', content: '' },
  // { property: 'og:image', content: '' },
  // { property: 'og:url', content: '' },
  // { property: 'og:site_name', content: '' },
];
const twitter = [
  // { property: 'twitter:card', content: '' },
  // { property: 'twitter:site', content: '' },
];
const meta = [
  { charset: 'utf-8' },
  { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { hid: 'description', name: 'description', content: description },
  { hid: 'itempropName', itemprop: 'name', content: title },
  { hid: 'itempropDesc', itemprop: 'description', content: description },
  { hid: 'itempropImage', itemprop: 'image', content: metaImage },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  ...og,
  ...twitter,
];

/*
 * sitemap
 */
const sitemap = {
  path: '/sitemap.xml',
  hostname: baseUrl,
  cacheTime: 1000 * 60 * 15,
  generate: true, // Enable me when using nuxt generate
  exclude: [
    // '/members/show',
    // '/members/edit'
  ],
  routes,
};

/*
 * plugins
 */
const plugins = [];

module.exports = {
  srcDir: 'src/',
  env: { baseUrl },
  head: {
    title,
    meta,
    script: [
      { defer: true, src: 'https://use.fontawesome.com/releases/v5.0.8/js/all.js' },
      { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDspMziJyIA1Ka7ztMUITLEa60iNXqc8wk' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https//fonts.googleapis.com/css?family=Oswald:400,700,900|Roboto:400,700' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
   * generate command configration
   */
  generate: { routes },
  /*
   * sitemap configuration
   */
  sitemap,
  plugins,
  /*
  ** Build configuration
  */
  // ここでvariablesを渡しても、postcss-custom-propertiesが発動しない
  css: [].map(src => ({ src, lang: 'postcss' })),
  build: {
    postcss,
    vendor: ['babel-polyfill', 'whatwg-fetch'],
  },
  modules: [
    '@nuxtjs/sitemap',
    ['@nuxtjs/google-analytics', { id: googleAnalyzeID }],
    '~~/modules/imagemin.js',
    '~~/modules/typescript.js',
  ],
  extractCSS: true, // 別途CSSを出力するのではなく、htmlのstyleタグに埋め込まれる
};
