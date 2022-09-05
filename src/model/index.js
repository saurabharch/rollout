const subscriber = require("./subscriber");
const push = require("./push");
const domains = require("./domains");
const organization = require("./organization");
const reset = require("./reset");
const user = require("./user");
const role = require("./role");
const code = require("./code");
const client = require("./client");
const token = require("./token");
const pushsetting = require("./pushSetting");
const project = require("./project");
const session = require("./session");

//* chat Service data model*//

const analyticMesssageResult = require("./analyticMessagesResult");
const analyticResult = require("./analyticResult");
const analyticProject_userResult = require("./analyticProject_usersResult");
const auth = require("./auth");
const bot1 = require("./bot.1");
const channel = require("./channel");
const department = require("./department");
const faq_kb = require("./faq_kb");
const faq = require("./faq");
const firebaseSetting = require("./firebaseSetting");
const group = require("./group");
// const label = require("./label");
// const labelSingle = require("./labelSingle");
const lead = require("./lead");
const location = require("./location");
const message = require("./message");
const note = require("./note");
const pendingInvitation = require("./pending-invitation");
const presence = require("./presence");
const project_user = require("./project_user");
const projectnew = require("./projectnew");
const request = require("./request");
const requester = require("./requester");
const requestSnapsot = require("./requestSnapshot");
const requestStatus = require("./requestStatus");
const routerLogger = require("./routerLogger");
const setting = require("./setting");
const susbcription = require("./subscription");
const subscriptionLog = require("./subscriptionLog");
const tag = require("./tag");
const tagLibrary = require("./tagLibrary");
const usernew = require("./usernew");

module.exports = {
  ...role,
  ...domains,
  ...subscriber,
  ...organization,
  ...reset,
  ...user,
  ...code,
  ...client,
  ...token,
  ...pushsetting,
  ...push,
  ...project,
  ...session,
  ...analyticMesssageResult,
  ...analyticResult,
  ...analyticProject_userResult,
  ...auth,
  ...bot1,
  ...channel,
  ...department,
  ...faq_kb,
  ...faq,
  ...firebaseSetting,
  ...group,
  // ...label,
  // ...labelSingle,
  ...lead,
  ...location,
  ...message,
  ...note,
  ...pendingInvitation,
  ...presence,
  ...project_user,
  ...projectnew,
  ...request,
  ...requester,
  ...requestSnapsot,
  ...requestStatus,
  ...routerLogger,
  ...setting,
  ...susbcription,
  ...subscriptionLog,
  ...tag,
  ...tagLibrary,
  ...usernew,
};
