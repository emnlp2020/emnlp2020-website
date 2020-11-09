import slug from 'slug'
import React, { useState } from "react";
import "../styles/papers-page.scss";
import { domIdForPaper } from "./shared";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import Layout from "../components/Layout";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import HTMLContent from "../components/Content";
import ReactMarkdown from "react-markdown";
import { graphql, Link } from "gatsby";

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
            placeholder="Author, title or ID filter"
            onChange={(event) => setText(event.target.value)}
            size="30"
        />
      </div>
  )
}

const ScheduleLink = ({paper}) => (
    <Link
        className="schedule-link"
        to={`/schedule#${domIdForPaper(paper.submissionID)}`}
        state={{highlightId: domIdForPaper(paper.submissionID)}}
    >
      <FontAwesomeIcon icon={faCalendarDay}/>
    </Link>
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

const idForLength = (length) => slug(length, {lower: true});

const VenuePaperListing = ({papers, length, searchText, linkToSchedule}) => {
  const searcher = new PaperSearcher(searchText)
  
  if (searchText.length > 3 || searchText.match(/^\d+$/)) {
    papers = papers.filter(p => searcher.matchesPaper(p))
  }
  
  if (papers.length === 0)
    return null;
  
  return (
      <section className="track-paper-listing">
        <h3 className="track-name" id={idForLength(length)}>{length}</h3>
        <ul className="papers-in-track">
          {papers.map(p => <SinglePaperListing paper={p} key={p.submissionID} linkToSchedule={linkToSchedule}/>)}
        </ul>
      </section>
  );
};

const LengthSummary = ({count, length}) => (
  <>
    {' '}
    <a className="paper-length-summary" href={`#${idForLength(length)}`}>{`${count} ${length}`}</a>
    {' '}
  </>
)

const OverallSummary = ({papersByLength, summarySuffix}) => {
  const counts = {}
  papersByLength.forEach(({papers, length}) => {counts[length] = papers.length})
  return (
      <article className="summary">
        There were
        <LengthSummary count={counts["Long Papers"]} length="Long Papers"/>
        and
        <LengthSummary count={counts["Short Papers"]} length="Short Papers"/>
        accepted to {' '}
        {<ReactMarkdown renderers={{paragraph: 'span'}}>{summarySuffix}</ReactMarkdown>}
      </article>
  )
}


const AllPaperListing = ({papersByLength, linkToSchedule, summarySuffix}) => {
  const [searchText, setSearchText] = useState("");
  
  return (
      <>
        <OverallSummary papersByLength={papersByLength} summarySuffix={summarySuffix} />
        <SearchBox text={searchText} setText={setSearchText}/>
        {papersByLength.map(
            ({papers, length}) => <VenuePaperListing {...{papers, length, searchText, linkToSchedule}}/>)}
      </>
  );
}

function getPapersByLength(byLengthFromGql) {
  return byLengthFromGql.map(({edges: paperNodes, fieldValue: length}) =>
      ({papers: paperNodes.map(pn => pn.node), length: lengths[length]}))
}

const PapersPage = ({data, location}) => {
  const {footerData, navbarData, site, markdownRemark: page, secondaryNavData} = data;
  const {linkToSchedule, summarySuffix} = page.frontmatter;
  const byLength = getPapersByLength(data.groupedPapers.group)
  
  return (
      <Layout {...{footerData, navbarData, secondaryNavData, site, location}}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}} className="papers-container">
          <HTMLContent className="default-content" content={page.html}/>
          <AllPaperListing papersByLength={byLength} linkToSchedule={linkToSchedule} summarySuffix={summarySuffix} />
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
        summarySuffix
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
