import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/all-events-page.scss";

const WorkshopListing = ({ title, summary, authors, url, numDays }) => (
  <article className="event-listing">
    <h3><a href={url}>{title}</a></h3>
    <div className="event-organizers">{authors}</div>
    <p className="event-summary">    
      {numDays > 1 ? <div className="event-duration">{numDays} days</div> : null}
      {summary}
    </p>
  </article>
);

const WorkshopsForDate = ({ date, workshops }) => (
  <section className="events-for-date">
    <h2>{date}</h2>
    <section className="workshops">
      {workshops.map(w => <WorkshopListing {...w} key={w.workshopId} />)}
    </section>
  </section>
);

const AllWorkshopsByDate = ({ datesAndWorkshops }) => (
  <section className="all-events">
    {datesAndWorkshops.map(({ date, workshops }) => <WorkshopsForDate key={date} date={date} workshops={workshops} />)}
  </section>
);


const AllWorkshopsPage = ({ data }) => {
  const { markdownRemark: page, footerData, navbarData, site, allWorkshopsCsv } = data;
  const { workshopsByDate } = allWorkshopsCsv
  const datesAndWorkshops = workshopsByDate.map(({workshops}) => ({ date: workshops[0].startDate, workshops }))

  return (
    <Layout footerData={footerData} navbarData={navbarData} site={site}>
      <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        <AllWorkshopsByDate datesAndWorkshops={datesAndWorkshops}/>
      </StandardPageTemplate>
    </Layout>
  );
};

AllWorkshopsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AllWorkshopsPage;

export const allWorkshopsPageQuery = graphql`
  query WorkshopsPage($id: String!) {
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
    allWorkshopsCsv {
      workshopsByDate: group(field: startDate) {
        workshops: nodes {
          authors
          workshopNumber
          url
          title
          summary
          startDate(formatString: "MMMM D, YYYY")
          numDays
        }
      }
    }
    ...LayoutFragment
  }
`;
