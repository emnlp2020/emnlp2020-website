const remark = require('remark');
const strip = require('strip-markdown');
const html = require('remark-html');
const slug = require('slug');

const stripMarkdown = (markdownText) => {
  stripped = remark().use(strip).processSync(markdownText).contents;
  return stripped.slice(0, stripped.length - 1);
}

const htmlifyMarkdown = (markdownText) => {
  return remark().use(html).processSync(markdownText).contents;
}

module.exports = {
  siteMetadata: {
    title: "EMNLP 2020 Conference",
    description: "2020 Conference on Empirical Methods in Natural Language Processing",
    siteUrl: "https://2020.emnlp.org"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sass",
    "gatsby-plugin-remove-trailing-slashes",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/img`,
        name: "images",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [`gatsby-remark-autolink-headers`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    "gatsby-transformer-csv",
    "gatsby-transformer-yaml",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {}
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/img/favicon.png",
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              const { siteUrl } = site.siteMetadata;

              return allMarkdownRemark.edges.map(edge => {
                const { node } = edge

                return Object.assign({}, node.frontmatter, {
                  description: node.title,
                  date: node.frontmatter.updated ? (node.frontmatter.updated[0].date || node.frontmatter.date) : node.frontmatter.date,
                  url: siteUrl + node.fields.slug,
                  guid: siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post-page"}}}, sort: {fields: frontmatter___date, order: DESC}) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        updated {
                          date
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/blog/rss.xml",
            title: "EMNLP 2020 Blog",
          },
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              const { siteUrl } = site.siteMetadata;

              return allMarkdownRemark.edges[0].node.frontmatter.newsItems.map(({text, date}) => {
                const bare = stripMarkdown(text)
                return {
                  title: bare,
                  date: date,
                  url: siteUrl,
                  guid: `${siteUrl}/news#${slug(bare).toLowerCase()}`,
                  custom_elements: [{ "content:encoded": htmlifyMarkdown(text) }],
                }
              });
            },
            query: `
              {
                allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "home-page" } } }) {
                  edges {
                    node {
                      frontmatter {
                        newsItems {
                          date
                          text
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/news/rss.xml",
            title: "EMNLP 2020 Latest News",
          },
        ],
      },
    },
    "gatsby-plugin-netlify", // make sure to keep it last in the array
  ],
};
