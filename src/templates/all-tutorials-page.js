
import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import slug from "slug"

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/all-events-page.scss";

const TutorialListing = ({ title, authors, abstract, extraMaterials }) => (
  <article className="event-listing">
    <h3>{title}</h3>
    <div className="event-organizers">{authors}</div>
    <div className="event-abstract">{abstract}</div>
  </article>
);

const TutorialsForDate = ({ date, tutorials }) => (
  <section className="events-for-date">
    <h2>{date}</h2>
    <section className="tutorials">
      {tutorials.map(t => <TutorialListing {...t} key={t.tutorialNumber} />)}
    </section>
  </section>
);

const AllTutorialsByDate = ({ datesAndTutorials }) => (
  <section className="all-events">
    {datesAndTutorials.map(({ date, tutorials }) => <TutorialsForDate key={date} date={date} tutorials={tutorials} />)}
  </section>
);

const simpleTitle = (raw) => slug(raw, {lower: true}).slice(0, 15)

const AllTutorialsPage = ({ data }) => {
  const { markdownRemark: page, footerData, navbarData, site, allTutorialsCsv, allTutorialDetailsCsv, secondaryNavData } = data;
  const { tutorialsByDate } = allTutorialsCsv
  const { allTutorialDetails } = allTutorialDetailsCsv
  const tuteDetailsBySlug = Object.fromEntries(allTutorialDetails.map(({details}) => [simpleTitle(details.title), details]))
  
  const augmentWithDetails = ({authors, tutorialNumber, title}) => {
    const {abstract, materials} = tuteDetailsBySlug[simpleTitle(title)]

    return {
      authors,
      title,
      tutorialNumber,
      abstract,
      materials
    }
  }
  
  const datesAndTutorials = tutorialsByDate.map(({tutorials}) => ({
    date: tutorials[0].date,
    tutorials: tutorials.map(augmentWithDetails)
  }))
  
  return (
    <Layout {...{footerData, navbarData, secondaryNavData, site}}>
      <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        <AllTutorialsByDate datesAndTutorials={datesAndTutorials} />
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
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`;
