import React from "react";

const StandardPageTemplate = props => {
  const { page, endContent, className } = props;
  const { title } = page.frontmatter;

  return (
    <article className="default">
      <div className={`{${className || "default-container"}}  container`}>
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

export default StandardPageTemplate