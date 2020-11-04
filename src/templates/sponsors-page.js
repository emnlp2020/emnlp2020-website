import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/sponsors-page.scss";
import Img from "gatsby-image";

// const imagePathForName = (name) => `people/org-committee/${imageStem(name)}`;

const imageStem = (name) => `${name.toLowerCase().replace(/ /g, '_')}`;

const SponsorLogo = ({ sharpImageData, name }) => (
  <div className="sponsor-logo-wrapper">
    <Img fixed={sharpImageData.fixed} alt={name} />
  </div>
);

const SponsorListing = ({ name, sharpImageData, link }) => (
  <a href={link}>
    <article className="sponsor">
      <SponsorLogo sharpImageData={sharpImageData} name={name} />
    </article>
  </a>
);

const LevelListing = ({ levelName, sponsors, images }) => (
  <section className="level-listing">
    <h3 className="level-name">{levelName}</h3>
    <div className="level-listing-sponsors">
      {sponsors.map(s => <SponsorListing {...s} sharpImageData={images.get(imageStem(s.name))} key={s.name} />)}
    </div>
  </section>
);

const CategorySponsorListing = ({ levels, images }) => (
  <section className="all-levels">
    {levels.map(l => <LevelListing {...l} key={l.levelName} images={images} />)}
  </section>
);

const SponsorsPage = ({ data, location }) => {
  const { markdownRemark: page, footerData, navbarData, site, levelSponsors, sponsorImages } = data;
  const { levels } = levelSponsors;
  const { images } = sponsorImages;
  const imagesByName = new Map(images.map(({ name, sharpImageData }) => [name, sharpImageData]));

  return (
    <Layout footerData={footerData} navbarData={navbarData} site={site} location={location}>
      <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        <CategorySponsorListing levels={levels} images={imagesByName} />
      </StandardPageTemplate>
    </Layout>
  );
};

SponsorsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SponsorsPage;

export const sponsorsPageQuery = graphql`
  query SponsorsPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        seo {
          browserTitle
          title
          description
        }
      }
    }
    levelSponsors: allSponsorsYaml {
      levels: nodes {
        levelName
        sponsors {
          name
          link
        }  
      }
    }
    sponsorImages: allFile(filter: {relativeDirectory: {eq: "sponsors"}, sourceInstanceName: {eq: "images"}}) {
      images: nodes {
        name
        sharpImageData: childImageSharp {
          fixed(width: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
    ...LayoutFragment
  }
`;
