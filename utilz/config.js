import dotenv from "dotenv";
dotenv.config({
  path: `./config.env`,
});

var data = JSON.stringify({
  e_mail: process.env.COURSES_SITE_EMAIL,
  password: process.env.COURSES_SITE_PASSWORD,
});

export var loginConfig = {
  method: "post",
  maxBodyLength: Infinity,
  url: `https://${process.env.COURSES_SITE}/sign-in`,
  headers: {
    authority: process.env.COURSES_SITE,
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    cookie:`ch_quiz=f0884724d759475126e9921b3738c576; locale=ru; redirect_after_login=https://${process.env.COURSES_SITE}/; _gid=GA1.2.726579859.1675585250; _gat_gtag_UA_181059362_1=1; _ga_BY3MTQGHWL=GS1.1.1675584847.101.1.1675585249.0.0.0; _ga=GA1.1.133586826.1675585250; g_state={"i_p":1675592455744,"i_l":1}; ch_quiz=9ebefff0b64633b9414083d868b16ab0; locale=ru; subscriber_ident=0b4a5d3b-ce77-4d09-bb9c-9647c50804df`,
    origin: `https://${process.env.COURSES_SITE}`,
    referer: `https://${process.env.COURSES_SITE}/sign-in`,
    "sec-ch-ua":
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
  },
  data: data,
};

