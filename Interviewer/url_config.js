// 主机域名
// let host = "http://104.208.108.134:8000";
// let host = "http://az.ccdesue.tech";
// let host = "https://dob.ccdesue.tech";
let host = "https://recruit-system.be.wizzstudio.com";

// 各个接口的url
let url = {
    host,

    interviewer: {
        larkLogin: `${host}/api/interviewer/larkLogin`,
        fakeLogin: `${host}/api/test/fakeInterviewerLogin`,
        refreshToken: `${host}/api/interviewer/refreshToken`,
        getInfo: `${host}/api/interviewer/getInterviewerInfo`,
        updateInfo: `${host}/api/interviewer/updateInterviewerInfo`,
        feedback: `${host}/api/interviewer/createFeedback`,
    },

    interview: {
        getAll: `${host}/api/interviewer/getInterviews`,
        getByStatus: `${host}/api/interviewer/getInterviewsByStatus`,
        read: `${host}/api/interviewer/changeInterviewStatus`,
        finish: `${host}/api/interviewer/finishInterview`,
        getResume: `${host}/api/interviewer/getDetailResumeById`,
        getResult: `${host}/api/interviewer/getInterviewResultByInterviewId`,

        // 将简历推送给其他面试官
        getOtherInterviewers: `${host}/api/interviewer/getInterviewersWithSamePosition`,
        change: `${host}/api/interviewerchangeInterviewer`,



    },

    analysis: {
        // 需要 project_id 作为 query 参数
        getProjectInfo: `${host}/api/info/getProjects`,
        getLatesProject: `${host}/api/info/getLatestProject`,
        getSubmitData: `${host}/api/interviewer/getSubmitDataByProjectId`,
        getReferrerData: `${host}/api/interviewer/getRefererDataByProjectId`,
        getMsgFromData: `${host}/api/interviewer/getMsgFromDataByProjectId`,
        getScoreData: `${host}/api/interviewer/getInterviewScoresByProjectId`
    }


};


module.exports = url;