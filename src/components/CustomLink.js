import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CustomLink = ({ linkType, linkURL, children, className = "" }) => {
  if (linkType === "internal") {
    return (
      <Link className={className} to={linkURL}>
        {children}
      </Link>
    );
  } else {
    return (
      <a className={className} href={linkURL}>
        {children}
        <FontAwesomeIcon className="ext-link-icon" icon={faExternalLinkAlt}/>
      </a>
    );
  }
};

CustomLink.propTypes = {
  linkType: PropTypes.string,
};

export default CustomLink;
