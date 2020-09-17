---
templateKey: blog-post-page
title: "How to fix your reviewer profiles"
date: 2020-05-09
updated: 
  - date: 2020-06-11
    details: "Clarified details of reviewer profile fields that are needed."
seo:
  title: "How to fix your reviewer profiles"
  description: >- 
    A number of issues have come up with reviewer profiles entered into Softconf. Here we explain how to fix them.
---

Thank you to everyone who has filled in their reviewer profiles [on Softconf](https://www.softconf.com/emnlp2020/papers/user/scmd.cgi?scmd=updateProfile). 
Unfortunately there are few common issues with many peoples' profiles.
This can happen easily, as Softconf does not catch these problems automatically.
Our system automatically parses your profile data for the purposes of automatic conflict of interest checking (for authors & reviewers), and for assigning reviewers to papers (replacing the bidding step for reviewers). 
Your data needs to be entered correctly for the system to work smoothly. 
Bear in mind that these values are processed by an automatic system, not a human, hence the need to follow the instructions to the letter.

Here are the most common problems we see:

1. **Internet domain names** must be supplied for the *Affiliations - Past and Present* field, not human-readable text, full email addresses etc. These should be the domain name of your current and past employers, e.g., cmu.edu or similar. The instructions within the Global Profile form explain how to specify the domain name. This might be the suffix of your work email address (but we don't want generic domains like *gmail.com* for obvious reasons), or the suffix of your work's website (e.g., *unimelb.edu.au*, being careful to provide the most general one, as in this instance there may be COIs between different faculties that we would miss if you specified a more specific domain like *cis.unimelb.edu.au*).
1. *Affiliations - Past and Present* must include at least one entry, for your current affiliation. If supplying multiple entries, these should be on separate lines. These should be *internet domain names*, as explained above.
1. The *Year of Graduation* field requires a 4 digit number (not a string). This field was changed recently and is now split into: Highest Degree Earned (or to be earned); and Year Awarded (to be awarded). For instance, if you have a PhD or are enrolled in PhD study, please enter “PhD” in the first field, and your date of (expected) completion in the latter. If you have no degree and are not studying for a degree, please enter ‘n/a’ in both fields.
1. *Semantic Scholar ID* must be present and correctly formatted. This is the most important field in your profile and is used to find your recent papers for automatic COI against co-authors and for reviewer-paper matching. Our software only works with semantic scholar, so please don't provide google scholar, dblp etc URLs. An example ID for Noam Chomsky is: https://www.semanticscholar.org/author/Noam-Chomsky/2329142  Make sure not to include any commas or semi-colons; in case of no publications, please write ‘n/a’. If your Semantic Scholar page exists and includes much of your recent work, please provide the link even if some papers are missing or the page includes papers from other researchers outside of NLP. If the page has little of your work, or mixes in papers from other authors in NLP, then please write 'n/a'. A poor page that mixes your papers with other non-NLP authors will be acceptable for our purposes, and this will mean you get better paper assignments and better COI handling than if we have no access to you publication history. Optionally, if you wish to correct the mistakes, see https://www.semanticscholar.org/faq#claim-author-instructions but we stress that this is not a requirement.
1. The list of COIs must include semantic scholar URLs of the form above, not names or links to google scholar etc. 
1. You should provide a secondary email address, and it should be different from your primary email. We will only use the secondary email as a last resort, e.g., when your primary emails bounce, or you are slow to respond to an urgent request.
1. The local conference questions have not been answered. A couple of people reported problems after clicking "Submit Data" where the responses are lost, which was resolved by using a different browser.

To correct the errors, please [update your local profile on Softconf](https://www.softconf.com/emnlp2020/papers/user/scmd.cgi?scmd=updateProfile). Your Global Profile information can be updated using the link entitled “Please click here to update your global user information.”
