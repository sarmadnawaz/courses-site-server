import axios from "axios";
import zlib from "zlib";
import { getCookie } from "./utilityFunctions.js";


function fetchLectures({ url , req = {} }) {
  
    /* THIS INTERCEPTOR WILL PERFORM LOGIN OPERATION 
    INCASE SERVER RESPOND WITH AN ERROR WITH STATUS CODE 401(unauthorized) */
    axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      const status = error.response ? error.response.status : null
      if (status === 401) {
            try {
              let authConfig = req.app.get('config_for_login')
              const response = await axios(authConfig);
              const cookie = getCookie(response.headers["set-cookie"], "subscriber_ident");
              if(!cookie) throw Error("Couldn't find subscriber_ident cookie")
              let cookies = req.app.get('cookie_for_auth')
              cookies[1] = cookie;
              req.app.set('cookie_for_auth', cookies)
              error.config.headers.Cookie = req.app.get('cookie_for_auth').join(';');
                return axios(error.config);
            } catch (err) {
                throw Error(err.message);
            }    
      } else throw error;
    }
    );
    
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        responseType: "stream",
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
          Cookie: req.app.get('cookie_for_auth').join(";"),
        },
      })
      .then((response) => {
        const gunzip = zlib.createGunzip();
        response.data.pipe(gunzip);

        let data = "";
        gunzip.on("data", (chunk) => {
          data += chunk;
        });
        gunzip.on("end", () => {
          data = JSON.parse(data);
          resolve(data);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { fetchLectures };
