const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const redirects = [
  {fromPath: '/templates', toPath: '/files/emnlp2020-templates.zip'}
]

exports.createPages = ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              acceptanceStatusKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    redirects.forEach(r => createRedirect(r));

    // Filter out the footer, navbar, and meetups so we don't create pages for those
    const postOrPage = result.data.allMarkdownRemark.edges.filter(edge => {
      const { templateKey } = edge.node.frontmatter;
      return (templateKey !== "navbar" && templateKey !== "footer");
    });

    postOrPage.forEach(edge => {
      let component, pathName;
      if (edge.node.frontmatter.templateKey === "home-page") {
        pathName = "/";
        component = path.resolve(`src/pages/index.js`);
      } else {
        pathName = edge.node.fields.slug;
        component = path.resolve(`src/templates/${String(edge.node.frontmatter.templateKey)}.js`);
      }
      const id = edge.node.id;
      createPage({
        path: pathName,
        component,
        // additional data can be passed via context
        context: {
          id,
          ...edge.node.frontmatter
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};


exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Sponsor implements Node {
      name: String!
      longName: String
      link: String!
      image: String!
      level: String!
    }

    type SiteSiteMetadata implements Node {
      title: String!
      siteUrl: String!
      sponsors: [Sponsor!]!
      sponsorLevels: [String!]
    }
  `
  createTypes(typeDefs)
}