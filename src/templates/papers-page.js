import { graphql } from 'gatsby'
import slug from 'slug'
import StandardPageTemplate from "../components/StandardPageTemplate";
import React, { useState } from "react";
import Layout from "../components/Layout";
import PageHelmet from "../components/PageHelmet";
import HTMLContent from "../components/Content";
import "../styles/papers-page.scss";
import { domIdForPaper } from "./shared";

const lengths = {
  "Long Paper": "Long Papers",
  "Short Paper": "Short Papers"
}

const SearchBox = ({text, setText}) => {
  return (
      <div className="search-wrapper">
        <input
            aria-roledescription="search papers"
            type="search"
            value={text}
            placeholder="Filter by author or title"
            onChange={(event) => setText(event.target.value)}
            size="25"
        />
      </div>
  )
}

const ScheduleLink = ({paper}) => (
    <a className="schedule-link" href={`/schedule#${domIdForPaper(paper.submissionID)}`}>Schedule</a>
)

const SinglePaperListing = ({paper, linkToSchedule}) => (
    <li className="single-paper-wrapper" key={paper.submissionID} id={slug(paper.title, {lower: true})}
      title={`${paper.title}: ${paper.abstract}`}>
      <article className="single-paper-listing">
        {linkToSchedule ? <ScheduleLink paper={paper}/> : null}
        <span className="paper-title">{paper.title}. </span>
        <span className="paper-authors">{paper.authors}.</span>
      </article>
    </li>
);

const normalize = (text) => (text.toLowerCase())

class PaperSearcher {
  constructor(searchText) {
    this.searchText = normalize(searchText);
  }
  
  matchesPaper(paper) {
    return this.matches(normalize(paper.title))
        || this.matches(normalize(paper.authors))
        || this.searchText === paper.submissionID;
  }
  
  matches(text) {
    return text.indexOf(this.searchText) > -1
  }
}

const VenuePaperListing = ({papers, length, searchText, linkToSchedule}) => {
  const searcher = new PaperSearcher(searchText)
  
  if (searchText.length > 3) {
    papers = papers.filter(p => searcher.matchesPaper(p))
  }
  
  if (papers.length === 0)
    return null;
  
  return (
      <section className="track-paper-listing">
        <h3 className="track-name" id={slug(length, {lower: true})}>{length}</h3>
        <ul className="papers-in-track">
          {papers.map(p => <SinglePaperListing paper={p} key={p.submissionID} linkToSchedule={linkToSchedule}/>)}
        </ul>
      </section>
  );
};

const AllPaperListing = ({papersByLength, linkToSchedule}) => {
  const [searchText, setSearchText] = useState("");

  return (
      <>
        <SearchBox text={searchText} setText={setSearchText}/>
        {papersByLength.map(({papers, length}) => <VenuePaperListing {...{papers, length, searchText, linkToSchedule}}/>)}
      </>
  );
}

function getPapersByLength(byLengthFromGql) {
  return byLengthFromGql.map(({edges: paperNodes, fieldValue: length}) =>
      ({papers: paperNodes.map(pn => pn.node), length: lengths[length]}))
}

const PapersPage = ({data}) => {
  const {footerData, navbarData, site, markdownRemark: page, secondaryNavData} = data;
  const {linkToSchedule} = page.frontmatter;
  const byLength = getPapersByLength(data.groupedPapers.group)
  
  return (
      <Layout {...{footerData, navbarData, secondaryNavData, site}}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}} className="papers-container">
          <HTMLContent className="default-content" content={page.html}/>
          <AllPaperListing papersByLength={byLength} linkToSchedule={linkToSchedule} />
        </StandardPageTemplate>
      </Layout>
  );
};

export default PapersPage;

export const submissionsQuery = graphql`
  query Submissions($id: String!, $acceptanceStatusKey: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        seo {
          browserTitle
          title
          description
        }
        linkToSchedule
      }
    }
    groupedPapers: allPapersCsv(filter: { acceptanceStatus: { eq: $acceptanceStatusKey }}) {
      group(field: submissionType) {
        edges {
          node {
            submissionID
            authors
            title
            abstract
            track
          }
        }
        fieldValue
      }
    }
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`
