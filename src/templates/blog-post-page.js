import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import "../styles/default-page.scss";
import BlogPageTemplate from "../components/BlogPageTemplate";

const BlogPage = ({ data }) => {
  const { markdownRemark: page, footerData, navbarData, site } = data;
  const { organizers: _ } = page.frontmatter;

  return (
    <Layout footerData={footerData} navbarData={navbarData} site={site}>
      <PageHelmet page={page} />
      <BlogPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
      </BlogPageTemplate>
    </Layout>
  );
};

BlogPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default BlogPage;

export const blogPageQuery = graphql`
  query BlogPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        seo {
          browserTitle
          title
          description
        }
        date(formatString: "MMMM Do, YYYY")
      }
    }
    ...LayoutFragment
  }
`;
