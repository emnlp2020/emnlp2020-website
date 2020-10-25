import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import PageHelmet from "../components/PageHelmet";
import StandardPageTemplate from "../components/StandardPageTemplate";
import "../styles/generic.scss";
import "../styles/schedule-page.scss";
import moment from "moment";

const scheduleTimeOffset = '-04:00'

const Subsession = ({paperID, paperTitle, paperAuthors}) => (
    <li className="paper-title" title={`${paperID}: ${paperAuthors}. ${paperTitle}`}>{paperTitle}</li>
)

const Session = ({sessionName, subsessions}) => (
    <div className="session-cell">
      <h4 className="session-name">{sessionName}</h4>
      <ul className="session-subsessions">{subsessions.map(ss => <Subsession {...ss} key={ss.paperID}/>)}</ul>
    </div>
)

const ScheduleLine = ({startMoment, endMoment, parallelSessions}) => (
    <tr className="session-row">
      <td className="session-time">
        <div className="date">{startMoment.format("MMM Do")}</div>
        <div className="time">{startMoment.format("HH:mm")}</div>
        <div className="zone">[UTC]</div>
      </td>
      <td className="session">
        {parallelSessions.map(ps => <Session {...ps} key={ps.sessionNumber}/>)}
      </td>
    </tr>
)

const ConferenceSchedule = ({allSessionInfo}) => (
    <table className="conference-schedule">
      {allSessionInfo.map(asi => <ScheduleLine {...asi} key={asi.startMoment.toISOString()}/>)}
    </table>
)

const parseDateAndTime = (date, time) => {
  const parsedMoment = moment.utc(`${date}T${time}:00${scheduleTimeOffset}`)
  return (time === '00:00') ? parsedMoment.add(24, 'hours') : parsedMoment
}

const normalizeSession = (singleSessionGroupGql) => {
  const {groupNodes} = singleSessionGroupGql
  const sessionProto = groupNodes[0]
  const {startTime, endTime, date, sessionNumber, sessionName} = sessionProto
  const startMoment = parseDateAndTime(date, startTime)
  const endMoment = parseDateAndTime(date, endTime)
  const subsessions = groupNodes.map(({paperID, paperTitle, paperAuthors}) => ({paperID, paperTitle, paperAuthors}))
  return {startMoment, endMoment, subsessions, sessionNumber, sessionName}
}

const sessionInfoFromGql = (allSessionGroups) => {
  const normalizedSessions = allSessionGroups.map(normalizeSession)
  const byStartTime = {}
  normalizedSessions.forEach(ses => {
    const {startMoment, endMoment, subsessions, sessionNumber, sessionName} = ses
    const timeKey = ses.startMoment.toISOString();
    const existing = byStartTime[timeKey];
    if (existing === undefined) {
      byStartTime[timeKey] = {startMoment, endMoment, parallelSessions: []}
    }
    byStartTime[timeKey].parallelSessions.push({subsessions, sessionNumber, sessionName})
  })
  const sessions = Object.values(byStartTime)
  sessions.sort((ses1, ses2) => ses1.startMoment.unix() - ses2.startMoment.unix())
  return sessions
}

const SchedulePage = ({data}) => {
  const {markdownRemark: page, footerData, navbarData, secondaryNavData, site, allScheduleCsv} = data;
  const {allSessionGroups} = allScheduleCsv
  
  return (
      <Layout {...{footerData, navbarData, secondaryNavData, site}}>
        <PageHelmet page={page}/>
        <StandardPageTemplate page={{...page}}>
          <HTMLContent className="default-content" content={page.html}/>
          <ConferenceSchedule allSessionInfo={sessionInfoFromGql(allSessionGroups)}/>
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
          startTime
          endTime
          date
          format
          sessionName
          sessionNumber
          paperID
          paperTitle
          paperAuthors
        }
      }
    }
    ...LayoutFragment
    secondaryNavData: allMarkdownRemark(filter: { frontmatter: { forSection: { eq: "program" } } }) {
      ...NavbarFieldsFragment
    }
  }
`