import React, { useState } from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/generic.scss";
import "../styles/schedule-page.scss";
import moment from "moment";
import { domIdForPaper } from "./shared";

const localOffset = moment().format("Z");

const Subsession = ({paperID, paperTitle, paperAuthors, highlight, abstract}) => (
    <li
        className={`paper-title`}
        id={domIdForPaper(paperID)}
        title={`${paperID}: ${paperAuthors}. ${paperTitle}: ${abstract || ''}`}
    >
      <span className={highlight ? "highlight" : ""}>
        {paperTitle}
      </span>
    </li>
)

const SessionChair = ({chair}) =>
    <span className="session-chair-info">
      <strong>Chair:</strong> {chair}
    </span>

const Session = ({sessionDisplayName, subsessions, highlightId, sessionChair}) => (
    <article className="session-cell">
      <h4 className="session-name">{sessionDisplayName}</h4>
      {sessionChair ? <SessionChair {...sessionChair} /> : null}
      <ul className="session-subsessions">{subsessions.map(ss =>
          <Subsession {...ss} key={ss.paperID} highlight={domIdForPaper(ss.paperID) === highlightId}/>)
      }
      </ul>
    </article>
)

const ScheduleLine = ({startMoment, endMoment, parallelSessions, tzName, highlightId}) => {
  const isLocal = tzName === "local"
  const startTimeInZone = isLocal ? startMoment.local() : startMoment.utc()
  const offset = isLocal ? localOffset : "";
  return (
      <tr className="session-row">
        <td className="session-time">
          <div className="date">{startTimeInZone.format("MMM Do")}</div>
          <div className="time">{startTimeInZone.format("HH:mm")}</div>
          <div className="zone">[UTC{offset}]</div>
          <div className="duration">{endMoment.diff(startMoment, 'minutes')} minutes</div>
        </td>
        <td className="session">
          {parallelSessions.map(ps => <Session {...ps} key={ps.sessionNumber} highlightId={highlightId}/>)}
        </td>
      </tr>
  );
}

const TimezoneChooser = ({tz, setTz}) => {
  return (
      <div className="timezone-chooser-wrapper">
        <article className="timezone-chooser">
          <span className="timezone-chooser-label">Show times in:</span>
          <select value={tz} onChange={(event) => setTz(event.target.value)} className="timezone-chooser-select">
            <option key="local" value="local">Your local time (UTC{localOffset})</option>
            <option key="utc" value="utc">UTC</option>
          </select>
        </article>
      </div>
  );
}

const ConferenceSchedule = ({allSessionInfo, highlightId}) => {
  const [tz, setTz] = useState("local");
  
  return (
      <>
        <TimezoneChooser tz={tz} setTz={setTz}/>
        <table className="conference-schedule">
          <thead>
          </thead>
          <tbody>
          {allSessionInfo.map(asi => <ScheduleLine {...asi} key={asi.startMoment.toISOString()} tzName={tz} highlightId={highlightId} />)}
          </tbody>
        </table>
      </>
  );
}

const parseUtcTime = (utcTime) => moment.utc(utcTime, 'DD/MM/YYYY HH:mm:ss')

const normalizeSession = (singleSessionGroupGql, abstractsById) => {
  const {groupNodes} = singleSessionGroupGql
  const sessionProto = groupNodes[0]
  const {startUtc, endUtc, sessionNumber, sessionName, sessionLongName} = sessionProto
  const startMoment = parseUtcTime(startUtc)
  const endMoment = parseUtcTime(endUtc)
  const subsessions = groupNodes.map(({paperID, paperTitle, paperAuthors}) => (
      {paperID, paperTitle, paperAuthors, abstract: abstractsById[paperID]})
  )
  const sessionDisplayName = sessionLongName || sessionName;
  return {startMoment, endMoment, subsessions, sessionNumber, sessionDisplayName}
}

const sessionInfoFromGql = (allSessionGroups, sessionChairs, papers) => {
  const abstractsById = {}
  papers.forEach(({paperID, abstract}) => {
    abstractsById[paperID] = abstract
  })
  
  const normalizedSessions = allSessionGroups.map(group => normalizeSession(group, abstractsById))
  
  const chairsBySessionName = {}
  sessionChairs.forEach(({sessionLongName, chair}) => {
    chairsBySessionName[sessionLongName] = {chair}
  })
  
  const byStartTime = {}
  normalizedSessions.forEach(ses => {
    const {startMoment, endMoment, subsessions, sessionNumber, sessionDisplayName} = ses
    const timeKey = ses.startMoment.toISOString();
    const existing = byStartTime[timeKey];
    if (existing === undefined) {
      byStartTime[timeKey] = {startMoment, endMoment, parallelSessions: []}
    }
    byStartTime[timeKey].parallelSessions.push({subsessions, sessionNumber, sessionDisplayName, sessionChair: chairsBySessionName[sessionDisplayName]});
  })
  const sessions = Object.values(byStartTime)
  sessions.sort((ses1, ses2) => ses1.startMoment.unix() - ses2.startMoment.unix())
  return sessions
}

const SchedulePage = ({data, location}) => {
  const {
    markdownRemark: page,
    footerData,
    navbarData,
    secondaryNavData,
    site,
    allScheduleCsv,
    allSessionChairsCsv,
    allPapersCsv
  } = data;
  const {allSessionGroups} = allScheduleCsv
  const {sessionChairs} = allSessionChairsCsv
  const {papers} = allPapersCsv
  const locState = location.state
  
  return (
      <Layout {...{footerData, navbarData, secondaryNavData, site, location}}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}}>
          <HTMLContent className="default-content" content={page.html}/>
          <ConferenceSchedule
              allSessionInfo={sessionInfoFromGql(allSessionGroups, sessionChairs, papers)}
              highlightId={locState ? locState.highlightId || null : null}
          />
        </StandardPageTemplate>
      </Layout>
  );
};

export default SchedulePage;

export const schedulePageQuery = graphql`
  query SchedulePage($id: String!) {
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
    allScheduleCsv {
      allSessionGroups: group(field: sessionName) {
        groupNodes: nodes {
          startUtc
          endUtc
          format
          sessionName
          sessionLongName
          sessionNumber
          paperID
          paperTitle
          paperAuthors
        }
      }
    }
    allSessionChairsCsv {
      sessionChairs: nodes {
        sessionLongName
        chair
      }
    }
    allPapersCsv {
      papers: nodes {
        paperID: submissionID
        abstract
      }
    }
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`