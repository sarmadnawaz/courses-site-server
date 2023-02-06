// it finds cookie in cookies array match to given name
export function getCookie(cookiesArray, cookieName) {
  const cookiesStr = cookiesArray.join(";");
  cookiesArray = cookiesStr.split(";");
  for (let i = 0; i < cookiesArray.length; i++) {
    if (cookiesArray[i].includes(cookieName)) return cookiesArray[i];
  }
  return null;
}

export function checkLecturesPermission({
  lectures = [],
  userPlan = "free",
  courseStatus = "free",
}) {
  let authority = false;
  if (courseStatus === "premium" && userPlan === "premium") {
    authority = true;
  } else if (
    courseStatus === "standard" &&
    (userPlan === "premium" || userPlan === "standard")
  ) {
    req.authority = true;
  } else if (courseStatus === "free") {
    authority = true;
  }
  if (!authority) {
    return lectures.map(({ title }) => ({ title }));
  } else return lectures;
}
