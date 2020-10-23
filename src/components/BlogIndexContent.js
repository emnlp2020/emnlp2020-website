import React from "react";
import { Link } from "gatsby";
import RssIcon from "../components/RssIcon";

const BlogIndexListing = ({ post }) => {
  const { title, date, updated, seo } = post.frontmatter;
  const { description } = seo
  const { slug } = post.fields
  return (<li>
    <p className="post-title">
      <Link to={slug}>{date}: {title}</Link>
      {(updated && updated.length > 0) ? <span className="blog-updated"> (Updated: {updated[0].date})</span> : null}
    </p>
    <p className="post-description">{description}</p>
  </li>);
};

const BlogIndexContent = ({ posts }) => (
  <article className="blog-posts default-content">
    <h2>All Posts</h2> 
    <ul>
      {posts.map(({ post }) => <BlogIndexListing post={post} key={post.title}/>)}
    </ul>
    <RssIcon link="/blog/rss.xml"/>
  </article>
);

export default BlogIndexContent;