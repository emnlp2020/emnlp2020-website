
import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/all-events-page.scss";

const TutorialListing = ({ title, authors, url }) => (
  <article className="event-listing">
    <h3>{title}</h3>
    <div className="event-organizers">{authors}</div>
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

const AllTutorialsPage = ({ data }) => {
  const { markdownRemark: page, footerData, navbarData, site, allTutorialsCsv, secondaryNavData } = data;
  const { tutorialsByDate } = allTutorialsCsv
  const datesAndTutorials = tutorialsByDate.map(({tutorials}) => ({ date: tutorials[0].date, tutorials }))

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

export const allWorkshopsPageQuery = graphql`
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
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`;
