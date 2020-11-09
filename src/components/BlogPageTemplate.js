import React from "react";
import { Link } from "gatsby";

const BlogPageTemplate = props => {
  const { page, endContent } = props;
  const { title, date } = page.frontmatter;

  return (
    <article className="default blog">
      <div className="default-container container">
        <section className="post-header">
          <div className="all-posts-link"><Link to="/blog">❮ All Blog Posts</Link></div>
          <div className="post-date">{date}</div>
        </section>
        <section className="default-header">
          <div className="default-titleWrapper">
            <h1 className="default-title">{title}</h1>
          </div>
        </section>
        <section className="section">
          {props.children}
        </section>
      </div>
      {endContent}
    </article>
  );
};

export default BlogPageTemplate