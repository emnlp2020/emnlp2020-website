import { graphql } from 'gatsby'
import StandardPageTemplate from "../components/StandardPageTemplate";
import React from "react";
import Layout from "../components/Layout";
import PageHelmet from "../components/PageHelmet";
import HTMLContent from "../components/Content";
import "../styles/papers-page.scss";

const lengths = {
  "Long Paper": "Long Papers",
  "Short Paper": "Short Papers"
}

const SinglePaperListing = ({ paper }) => (
  <article className="single-paper-listing" title={paper.abstract}>
    <span className="paper-authors">{paper.authors}</span>
    <span className="paper-title">{paper.title}</span>
  </article>
);

const VenuePaperListing = ({ venue, papers, length }) => (
  <section className="track-paper-listing">
    <h3 className="track-name">{venue}: {length}</h3>
    <section className="papers-in-track">
      { papers.map(p => <SinglePaperListing paper={p} key={p.number} />) }
    </section>
  </section>
);

function getPapersByLength(byLengthFromGql) {
  return byLengthFromGql.map(({ edges: paperNodes, fieldValue: length}) => 
    ({papers: paperNodes.map(pn => pn.node), length: lengths[length]}))
}

const PapersPage = ({ data }) => {
  const { footerData, navbarData, site, markdownRemark: page } = data;
  const { group: byLengthFromGql } = data.mainConference;

  const byLengthMain = getPapersByLength(data.mainConference.group)

  const byLengthFindings = getPapersByLength(data.findings.group)
  
  return (
    <Layout footerData={footerData} navbarData={navbarData} site={site}>
      <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        {byLengthMain.map(({papers, length}) => <VenuePaperListing venue="Main Conference" papers={papers} length={length}/>)}
        {byLengthFindings.map(({papers, length}) => <VenuePaperListing venue="Findings" papers={papers} length={length}/>)}
      </StandardPageTemplate>
    </Layout>
  );
};

export default PapersPage;

export const submissionsQuery = graphql`
  query Submissions($id: String!) {
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
    mainConference: allPapersCsv(filter: {acceptanceStatus: {eq: "Accept"}}) {
      group(field: submissionType) {
        edges {
          node {
            authors
            title
          }
        }
        fieldValue
      }
    }
    findings: allPapersCsv(filter: {acceptanceStatus: {eq: "Accept-Findings"}}) {
      group(field: submissionType) {
        edges {
          node {
            authors
            title
          }
        }
        fieldValue
      }
    }
    ...LayoutFragment
  }
`
