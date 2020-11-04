import React from "react";
import { graphql } from 'gatsby'
import "./styles.scss";
import CustomLink from "../CustomLink";

const locationMatches = (menuItem, location) => {
  if (location === undefined)
    return false
  return menuItem.linkURL === location.pathname || (menuItem.otherPatterns || []).some(p => location.pathname.match(`^${p}$`))
}

export const NavItem = ({menuItem, location}) => {
  const extraClassName = locationMatches(menuItem, location) ? " selected" : ""
  return (
      <li key={menuItem.linkURL} className={`navbar-menuItem ${extraClassName}`} title={menuItem.longLabel}>
        <CustomLink
            linkType={menuItem.linkType || 'internal'}
            linkURL={menuItem.linkURL}
            className={`navbar-menuLink ${extraClassName}`}
        >
          {menuItem.label}
        </CustomLink>
      </li>
  );
}

export const NavbarTemplate = ({data, location}) => (
    <nav className="navbar">
      <div className="container  navbar-container">
        {data.menuItems.length > 0 && (
            <ul className="navbar-menu">
              {data.menuItems.map(menuItem => <NavItem menuItem={menuItem} location={location} />)}
            </ul>
        )}
      </div>
    </nav>
);

const Navbar = ({data, location}) => {
  if (!data) {
    return null;
  }
  const frontmatterData = data.edges[0].node.frontmatter;
  return <NavbarTemplate data={frontmatterData} location={location}/>;
};

export const fieldsFragment = graphql`
  fragment NavbarFieldsFragment on MarkdownRemarkConnection {
    edges {
      node {
        id
        frontmatter {
          logoImage {
            image
            imageAlt
          }
          menuItems {
            label
            linkType
            linkURL
            longLabel
            otherPatterns
          }
        }
      }
    }
  }
`

export { Navbar };
