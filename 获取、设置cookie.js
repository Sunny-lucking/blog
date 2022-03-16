// cookie
export const setCookie = (name, value, config) => {
  let cookieStr = `${name}=${escape(value)}`;
  config = config || {};

  if (config.expiredays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + config.expiredays);
    cookieStr += `;expires=${exdate.toGMTString()}`;
  }
  if (config.path) {
    cookieStr += `;path=${config.path}`;
  }
  if (config.domain) {
    cookieStr += `;domain=${config.domain}`;
  }
  document.cookie = cookieStr;
};

export const getCookie = (name) => {
  const cookieArr = document.cookie.split('; ');
  for (let i = 0; i < cookieArr.length; i++) {
    const arr = cookieArr[i].split('=');
    if (arr[0] === name) {
      return arr[1];
    }
  }
};
