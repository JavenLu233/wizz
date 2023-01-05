// 主机域名
let host = "http://az.ccdesue.tech";

// 各个接口的url
let url = {
    host,

    // 用于登录操作
    login: {

        larkLogin: `${host}/api/admin/larkLogin`,
    },

    // 用于项目操作
    project: {
        "getAll": `${host}/api/info/getProjects`,
        "getLastOne": `${host}/api/info/getLatestProject`,
        "create": `${host}/api/admin/createProject`
    },

    // 用于岗位操作
    position: {
        "getAll": `${host}/api/info/getPositions`,
        "getByName": `${host}/api/info/getPositionByName`,
        "create": `${host}/api/admin/createPosition`,
        "delete": `${host}/api/admin/deletePositionById`,
        "update": `${host}/api/admin/updatePositionById`
    },

    // 用于面试官操作
    interviewer: {
        "getAll": `${host}/api/admin/getInterviewers`,
        "getById": `${host}/api/admin/getInterviewerById`,
        "getByPosition": `${host}/api/admin/getInterviewersByPosition`,
        "create": `${host}/api/admin/createInterviewer`,
        "delete": `${host}/api/admin/deleteInterviewerById`,
        "update": `${host}/api/admin/updateInterviewer`,
        "changeStatus": `${host}/api/admin/changInterviewerStatus`
    },

    // 用于面试操作
    interview: {
        "getByProjectIdAndPage": `${host}/api/admin/getInterviewByPage`,
        "getByProjectIdAndStatus": `${host}/api/admin/getInterviewsByProjectIdAndStatus`,
        "getOfinterviewer": `${host}/api/admin/getInterviewsByProjectIdAndInterviewerIdAndStatus`,
        "change": `${host}/api/admin/changeInterviewer`,
        "getResumeByInterviewId": `${host}/api/admin/getIntervieweeDetailByInterviewId`,
        "getResultByInterviewId": `${host}/api/admin/getInterviewResultByInterviewId`
    },

    // 用于招新数据操作
    orientation: {
        "getSubmitData": `${host}/api/admin/getSubmitDataByProjectId`,
        "getRefferrerData": `${host}/api/admin/getRefererDataByProjectId`,
        "getMsgFromData": `${host}/api/admin/getMsgFromDataByProjectId`,
        "getFeedbackData": `${host}/api/admin/getFeedbacks`
    },


    // 用于成员库操作
    member: {
        "getAll": `${host}/api/admin/getMembers`,
        "getByPage": `${host}/api/admin/getMembersByPage`,
        "getByPageAndPosition": `${host}/api/admin/getMemberByPageAndPosition`,
        "update": `${host}/api/admin/updateMember`
    },

    // 用于测试
    test: {
        "fakeAdminLogin": `${host}/api/test/fakeAdminLogin`,
        "getPositions": `${host}/api/info/getPositions`,
        "getProjects": `${host}/api/info/getProjects`,
        "getLatestProject": `${host}/api/info/getLatestProject`,
        "createTestProject": `${host}/api/test/createTestProject`,
        "createTestPositions": `${host}/api/test/createTestPositions`,
        "createTestInterviewer": `${host}/api/test/createTestInterviewer`
    },

    // 用于获取通用信息
    info: {
        "getPositions": `${host}/api/info/getPositions`,
        "getProjects": `${host}/api/info/getProjects`,
        "getLatesProject": `${host}/api/info/getLatestProject`
    }


};


module.exports = url;