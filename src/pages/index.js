import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import PageHelmet from "../components/PageHelmet";
import RssIcon from "../components/RssIcon";
import ReactMarkdown from "react-markdown";
import "../styles/sponsors-page.scss";
import { Link } from "gatsby";

import Layout from "../components/Layout";
import "../styles/home.scss";
import HTMLContent from "../components/Content";

const MAX_BLOG_POSTS = 4
const RECENT_NEWS_ITEMS = 4

const NewsItem = ({ date, text }) => (
  <tr className="news-item">
    <td className="date">{date}</td>
    <td><ReactMarkdown className="news-text" source={text}/></td>
  </tr>
)

const BlogPostSummary = ({ date, title, link }) => (
  <tr className="blog-item">
    <td className="date">{date}</td>
    <td className="blog-text"><Link to={link}>{title}</Link></td>
  </tr>
)

const BlogPosts = ({ items }) => (
  <div className="blog-post-list-wrapper updates-section-wrapper">
    <section className="blog-post-list-section single-updates-section">
      <h4>Latest Blog Posts <RssIcon link="/blog/rss.xml"/></h4>
      <table className="blog-section-list">
        <tbody>
          {items.slice(0, MAX_BLOG_POSTS).map(i => <BlogPostSummary {...i} key={i.text}></BlogPostSummary>)}
        </tbody>
      </table>
      <p className="all-posts"><Link to="/blog">View all blog posts</Link></p>
    </section>
  </div>
)

const NewsSection = ({ items }) => (
  <div className="news-section-wrapper updates-section-wrapper">
    <section className="news-section single-updates-section">
      <h4>Latest News <RssIcon link="/news/rss.xml"/></h4>
      <table className="news-section-list">
        <tbody>
          {items.filter((i, idx) => idx < RECENT_NEWS_ITEMS || i.persist).map(i => <NewsItem {...i} key={i.text}/>)}
        </tbody>
      </table>
    </section>
  </div>
)

const renderableDateRange = (dateStart, dateEnd, delim = ' – ') => {
  if (!dateEnd)
    return dateStart;
  let commonPrefixLen = 0;
  const final = Math.max(dateStart.length, dateEnd.length);
  for (let i = 0; i < final; i++) {
    if (dateStart.charAt(i) === dateEnd.charAt(i))
      commonPrefixLen = i;
    else
      break;
  }
  let commonSuffixLen = 0;
  for (let i = 0; i < final ; i++) {
    if (dateStart.charAt(dateStart.length - i) === dateEnd.charAt(dateEnd.length - i))
      commonSuffixLen = i;
    else
      break;
  }
  const prefix = dateStart.substr(0, commonPrefixLen);
  const suffix = dateStart.substr(dateStart.length - commonSuffixLen);
  const startUniquePart = dateStart.substr(commonPrefixLen, dateStart.length - commonSuffixLen - commonPrefixLen);
  const endUniquePart = dateEnd.substr(commonPrefixLen, dateEnd.length - commonSuffixLen - commonPrefixLen);
  return `${prefix}${startUniquePart}${delim}${endUniquePart}${suffix}`;
}

const KeyDateListing = ({ date, dateEnd, event, formerly }) => (
  <>
    <dt className="date">{renderableDateRange(date, dateEnd)}</dt>
    <dd className="key-date-entry">
      <ReactMarkdown renderers={{paragraph: 'span'}} source={event}/>
      { formerly ? <span className="key-date-formerly"> (was: {formerly})</span>: null }
    </dd>
  </>
);

const KeyDates = ({ items: dates }) => (
  <div className="key-dates-section-wrapper">
    <section className="key-dates-section card">
      <h4>Key Dates</h4>
        <div className="key-dates-card-content">
          <dl className="key-dates-listing">
            {dates.map(d => <KeyDateListing {...d} key={d.event}/>)}
          </dl>
          <span className="extra-date-info">
            <p><strong>Updated April 8, 2020; June 1, 2020</strong> – the above dates have all been updated to reflect the new scheduled dates EMNLP in its online format, and to account for recent events.</p>
            <p>See the <a href="/call-for-papers">call for papers</a> for further important details about the submission process.</p>
            <p>All deadlines are 11.59 pm UTC -12h (“anywhere on Earth”).</p>
          </span>
      </div>
    </section>
  </div>
);


export const HomePageTemplate = ({ home, blogPosts }) => {
  return (
    <>
      <section className="header">
        <div className="header-container container">
          {home.headerImage && 
            <img className="header-image" src={home.headerImage.image} alt={home.headerImage.imageAlt} />
          }
          <div className="header-text" title="Image Credit: NASA">
            <h3 className="header-name">{home.title}</h3>
            <h4 className="header-tagline">
              <HTMLContent className="header-taglinePart" content={home.description}/>
            </h4>
            <div className="header-extra-info">
              {home.extraInfo.map((ei, idx) => <p key={idx}>{ei}</p>)}
            </div>
          </div>
        </div>
      </section>
      <section className="key-info-content">
      <KeyDates items={home.keyDates}/>
        <div className="updates-section">
          <BlogPosts items={blogPosts}/>
          <NewsSection items={home.newsItems}/>
        </div>
      </section>
     </>
  );
};

class HomePage extends React.Component {
  render() {
    const { data } = this.props;
    const {
      data: { footerData, navbarData, site },
    } = this.props;
    const { frontmatter: home } = data.homePageData.edges[0].node;
    const blogPosts = data.blogPostData.edges.map(({ node }) => 
      ({
        link: node.fields.slug,
        title: node.frontmatter.title,
        date: node.frontmatter.date
      })
    );
    return (
      <Layout footerData={footerData} navbarData={navbarData} site={site}>
        <PageHelmet page={{frontmatter: home}} />
        <HomePageTemplate home={home} blogPosts={blogPosts} />
      </Layout>
    );
  }
}

HomePage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageQuery {
    ...LayoutFragment
    homePageData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "home-page" } } }) {
      edges {
        node {
          frontmatter {
            title
            description
            extraInfo
            seo {
              browserTitle
              title
              description
            }
            newsItems {
              date(formatString: "MMMM D, YYYY")
              text
              persist
            }
            keyDates {
              date(formatString: "MMMM D, YYYY")
              dateEnd(formatString: "MMMM D, YYYY")
              event
              important
              formerly(formatString: "MMMM D")
            }
          }
        }
      }
    }
    blogPostData: allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post-page"}}}, sort: {fields: frontmatter___date, order: DESC}, limit: 3) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString:"MMMM D, YYYY")
          }
        }
      }
    }
  }
`;
