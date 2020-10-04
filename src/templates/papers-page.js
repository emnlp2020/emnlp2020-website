import { graphql } from 'gatsby'
import slug from 'slug'
import StandardPageTemplate from "../components/StandardPageTemplate";
import React, { useState } from "react";
import Layout from "../components/Layout";
import PageHelmet from "../components/PageHelmet";
import HTMLContent from "../components/Content";
import "../styles/papers-page.scss";

const lengths = {
  "Long Paper": "Long Papers",
  "Short Paper": "Short Papers"
}

const SearchBox = ({text, setText}) => {
  return (
      <div className="search-wrapper">
        <input
            aria-roledescription="search papers"
            type="text"
            value={text}
            placeholder="Filter by author or title"
            onChange={(event) => setText(event.target.value)}
            size="25"
        />
      </div>
  )
}

const SinglePaperListing = ({paper}) => (
    <li className="single-paper-wrapper" key={paper.id} id={slug(paper.title, {lower: true})}>
      <article className="single-paper-listing">
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
    return this.matches(normalize(paper.title)) || this.matches(normalize(paper.authors));
  }
  
  matches(text) {
    return text.indexOf(this.searchText) > -1
  }
}

const VenuePaperListing = ({papers, length, searchText}) => {
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
          {papers.map(p => <SinglePaperListing paper={p} key={p.number}/>)}
        </ul>
      </section>
  );
};

const AllPaperListing = ({papersByLength}) => {
  const [searchText, setSearchText] = useState("");

  return (
      <>
        <SearchBox text={searchText} setText={setSearchText}/>
        {papersByLength.map(({papers, length}) => <VenuePaperListing {...{papers, length, searchText}}/>)}
      </>
  );
}

function getPapersByLength(byLengthFromGql) {
  return byLengthFromGql.map(({edges: paperNodes, fieldValue: length}) =>
      ({papers: paperNodes.map(pn => pn.node), length: lengths[length]}))
}

const PapersPage = ({data}) => {
  const {footerData, navbarData, site, markdownRemark: page, secondaryNavData} = data;
  const byLength = getPapersByLength(data.groupedPapers.group)
  
  return (
      <Layout footerData={footerData} navbarData={navbarData} secondaryNavData={secondaryNavData} site={site}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}} className="papers-container">
          <HTMLContent className="default-content" content={page.html}/>
          <AllPaperListing papersByLength={byLength}/>
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
      }
    }
    groupedPapers: allPapersCsv(filter: { acceptanceStatus: { eq: $acceptanceStatusKey }}) {
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
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "papers" } } }) {
      ...NavbarFieldsFragment
    }
  }
`
