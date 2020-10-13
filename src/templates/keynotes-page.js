import React from "react";
import { graphql } from "gatsby";
import ReactMarkdown from "react-markdown";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/keynotes-page.scss";
import "../styles/generic.scss";
import Img from "gatsby-image";
import slug from "slug";

const imageStem = (name) => `${name.toLowerCase().replace(/ /g, '_')}`;

const KeynotePhoto = ({ sharpImageData, name }) => (
  <div className="keynote-photo-wrapper">
    <Img fixed={sharpImageData.fixed} alt={name} />
  </div>
);

const KeynoteListing = ({ name, bio, title, abstract, sharpImageData }) => (
  <article className="keynote card" id={slug(name)}>
    <KeynotePhoto sharpImageData={sharpImageData} name={name}/>
    <div className="keynote-details">
      <div className="speaker-name">{name}</div>
      <h3 className="talk-title">{title}</h3>
      <div className="abstract">{abstract}</div>
      <ReactMarkdown className="bio">{bio}</ReactMarkdown>
    </div>
  </article>
);

const AllKeynotes = ({ keynotes, images }) => (
  <section className="all-keynotes">
    {keynotes.map(k => <KeynoteListing {...k} key={k.title} sharpImageData={images.get(imageStem(k.name))} />)}
  </section>
);

const KeynotesPage = ({ data }) => {
  const { markdownRemark: page, footerData, navbarData, site, keynoteData, keynoteImages, secondaryNavData } = data;
  const { keynotes } = keynoteData;
  const { images } = keynoteImages;
  const imagesByName = new Map(images.map(({ name, sharpImageData }) => [name, sharpImageData]));

  return (
    <Layout {...{footerData, navbarData, secondaryNavData, site}}>
    <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        <AllKeynotes keynotes={keynotes} images={imagesByName}/>
      </StandardPageTemplate>
    </Layout>
  );
};

export default KeynotesPage;

export const keynotesPageQuery = graphql`
  query KeynotesPage($id: String!) {
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
    keynoteData: allKeynotesYaml {
      keynotes: nodes {
        name
        bio
        abstract
        title
      }
    }
    keynoteImages: allFile(filter: {relativeDirectory: {eq: "keynotes"}, sourceInstanceName: {eq: "images"}}) {
      images: nodes {
        name
        sharpImageData: childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`