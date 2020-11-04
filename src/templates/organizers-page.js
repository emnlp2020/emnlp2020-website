import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/organizers-page.scss";
import "../styles/generic.scss";
import Img from "gatsby-image";
import slug from "slug";

const imageStem = (name) => `${name.toLowerCase().replace(/ /g, '_')}`;

const MemberPhoto = ({ sharpImageData, name }) => (
  <div className="member-photo-wrapper">
    <Img fixed={sharpImageData.fixed} alt={name} />
  </div>
);

const PlaceholderPhoto = () => (
  <div className="member-photo-wrapper placeholder"></div>
);

const MemberListing = ({ name, organization, sharpImageData }) => (
  <article className="member card">
    {sharpImageData ? <MemberPhoto sharpImageData={sharpImageData} name={name}/> : <PlaceholderPhoto />}
    <div className="member-text-details">
      <div className="member-name">{name}</div>
      <div className="member-org">{organization}</div>
    </div>
  </article>
);

const RoleListing = ({ title, members, images, subcommittee }) => (
  <section className="role-listing">
    <h3 className="role-title" id={slug(title, {lower: true})}>{title}</h3>
    <div className="role-listing-members">
      {members.map(m => <MemberListing {...m} sharpImageData={images.get(imageStem(m.name))} key={m.name}/>)}
    </div>
    {subcommittee && <SubCommitteeLink {...subcommittee}/>}
  </section>
);

const AllCommitteeRoles = ({ roles, images }) => (
  <section className="all-committee-roles">
    {roles.map(r => <RoleListing {...r} key={r.title} images={images} />)}
  </section>
);

const SubCommitteeLink = ({title, link}) => (
  <a class="subcommittee-link" href={link}>{title}</a>
)

const OrgCommitteePage = ({ data, location }) => {
  const { markdownRemark: page, footerData, navbarData, site, committee, committeeImages } = data;
  const { roles } = committee;
  const { images } = committeeImages;
  const imagesByName = new Map(images.map(({ name, sharpImageData }) => [name, sharpImageData]));

  return (
    <Layout footerData={footerData} navbarData={navbarData} site={site} location={location}>
      <PageHelmet page={page} />
      <StandardPageTemplate page={{ ...page }}>
        <HTMLContent className="default-content" content={page.html} />
        <AllCommitteeRoles roles={roles} images={imagesByName}/>
      </StandardPageTemplate>
    </Layout>
  );
};

OrgCommitteePage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OrgCommitteePage;

export const organizersPageQuery = graphql`
  query OrgCommitteePage($id: String!) {
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
    committee: allOrganizingCommitteeYaml {
      roles: nodes {
        title
        members {
          name
          organization
        }
        subcommittee {
          title
          link
        }
      }
    }
    committeeImages: allFile(filter: {relativeDirectory: {eq: "org-committee"}, sourceInstanceName: {eq: "images"}}) {
      images: nodes {
        name
        sharpImageData: childImageSharp {
          fixed(height: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
    ...LayoutFragment
  }
`;
