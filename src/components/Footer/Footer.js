import React from "react";
import "./styles.scss";
import { graphql } from "gatsby";

export const FooterTemplate = ({ frontmatter, site: _ }) => {
  const { logoImage } = frontmatter;

  return (
    <nav className="footer">
      <div className="footer-container  container">
        <div className="footer-top">
          <div className="footer-about">
            <h4 className="footer-aboutTitle">
              <a href={logoImage.orgLink}>
                <img
                  className="footer-aboutTitleImg"
                  src={logoImage.image}
                  alt={logoImage.imageAlt}
                />
              </a>
            </h4>
            <div className="footer-aboutDescription">
              {logoImage.taglines.map((tl, idx) => <p key={idx}>{tl}</p>)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({data, site}) => {
  if (!data) 
    return null;
  const frontmatter = data.edges[0].node.frontmatter;
  return <FooterTemplate frontmatter={frontmatter} site={site} />;
};

export const fieldsFragment = graphql`
  fragment FooterFieldsFragment on MarkdownRemarkConnection {
    edges {
      node {
        id
        frontmatter {
          logoImage {
            image
            imageAlt
            taglines
            orgLink
          }
        }
      }
    }
  }
`;

export { Footer };
