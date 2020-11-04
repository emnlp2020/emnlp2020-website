import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";

import "../styles";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const TemplateWrapper = ({ footerData = null, navbarData = null, site = null, secondaryNavData = null, children }) => (
  <div>
    <Helmet>
      <html lang="en" />
      <meta name="keywords" content="conference nlp natural language processing emnlp 2020 acl" />
    </Helmet>
    <Navbar data={navbarData} />
    <main>
      {secondaryNavData ? <div id="secondary-nav" className="secondary"><Navbar data={secondaryNavData} /></div> : null}
      {children}
    </main>
    <Footer data={footerData} site={site} />
  </div>
);



export const query = graphql`
  fragment LayoutFragment on Query {
    footerData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "footer" } } }) {
      ...FooterFieldsFragment
    }
    navbarData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "navbar" } } }) {
      ...NavbarFieldsFragment
    }
  }
`;

export default TemplateWrapper;
