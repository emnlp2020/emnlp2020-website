export const domIdForPaper = (submissionId) => submissionId.startsWith('TACL') ? submissionId : `s${submissionId}`;