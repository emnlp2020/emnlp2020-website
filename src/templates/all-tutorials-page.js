import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import slug from "slug"

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import Img from "gatsby-image";
import "../styles/all-events-page.scss";

const imageStem = (name) => `${name.toLowerCase().replace(/ /g, '_')}`;

const CourseMaterialsLink = ({link}) => (
    <div className="event-materials"><a href={link}>Course Materials</a></div>
)

const TutorialPhoto = ({name, sharpImageData}) => (
    sharpImageData ?
        <Img fixed={sharpImageData.fixed} alt={name} className="tutorial-author-photo" title={`Headshot of ${name}`}/>
        : null
)

const PhotoGallery = ({authors, images}) => (
    <div className="tutorial-author-photo-gallery">
      {authors.map(a => <TutorialPhoto name={a} sharpImageData={images.get(imageStem(a))} key={a}/>)}
    </div>
)

const TutorialListing = ({tutorialNumber, title, authors, abstract, materials, images}) => (
    <article className="event-listing" id={tutorialNumber}>
      <h3>{title}</h3>
      <div className="event-organizers">{authors.join(', ')}</div>
      <PhotoGallery authors={authors} images={images}/>
      <div className="event-abstract">{abstract}</div>
      {materials ? <CourseMaterialsLink link={materials}/> : null}
    </article>
);

const TutorialsForDate = ({date, tutorials, images}) => (
    <section className="events-for-date">
      <h2>{date}</h2>
      <section className="tutorials">
        {tutorials.map(t => <TutorialListing {...t} key={t.tutorialNumber} images={images}/>)}
      </section>
    </section>
);

const AllTutorialsByDate = ({datesAndTutorials, images}) => (
    <section className="all-events">
      {datesAndTutorials.map(({date, tutorials}) => <TutorialsForDate
          key={date}
          date={date}
          tutorials={tutorials}
          images={images}
      />)}
    </section>
);

const simpleTitle = (raw) => slug(raw, {lower: true}).slice(0, 15)

const AllTutorialsPage = ({data}) => {
  const {
    markdownRemark: page,
    footerData,
    navbarData,
    site,
    allTutorialsCsv,
    allTutorialDetailsCsv,
    secondaryNavData,
    tutorialImages
  } = data;
  const {tutorialsByDate} = allTutorialsCsv
  const {allTutorialDetails} = allTutorialDetailsCsv
  const tuteDetailsBySlug = Object.fromEntries(
      allTutorialDetails.map(({details}) => [simpleTitle(details.title), details]))
  const { images } = tutorialImages
  
  const augmentWithDetails = ({authors, tutorialNumber, title}) => {
    const {abstract, materials} = tuteDetailsBySlug[simpleTitle(title)]
    
    return {
      authors: authors.split(', '),
      title,
      tutorialNumber,
      abstract,
      materials
    }
  }
  
  const imagesByName = new Map(images.map(({name, sharpImageData}) => [name, sharpImageData]));
  
  const datesAndTutorials = tutorialsByDate.map(({tutorials}) => ({
    date: tutorials[0].date,
    tutorials: tutorials.map(augmentWithDetails)
  }))
  
  return (
      <Layout {...{footerData, navbarData, secondaryNavData, site}}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}}>
          <HTMLContent className="default-content" content={page.html}/>
          <AllTutorialsByDate datesAndTutorials={datesAndTutorials} images={imagesByName}/>
        </StandardPageTemplate>
      </Layout>
  );
};

AllTutorialsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AllTutorialsPage;

export const allTutorialsPageQuery = graphql`
  query TutorialsPage($id: String!) {
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
    allTutorialsCsv {
      tutorialsByDate: group(field: date) {
        tutorials: nodes {
          authors
          tutorialNumber
          title
          date(formatString: "MMMM D, YYYY")
        }
      }
    }
    allTutorialDetailsCsv {
      allTutorialDetails: edges {
        details: node {
          title
          abstract
          materials
        }
      }
    }
    tutorialImages: allFile(filter: {relativeDirectory: {eq: "tutorials"}, sourceInstanceName: {eq: "images"}}) {
      images: nodes {
        name
        sharpImageData: childImageSharp {
          fixed(height: 80) {
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
`;
