window.btoa = window.btoa || $.base64.encode;
export default {
  isAndroid() {
    return navigator.userAgent.match(/Android/i);
  },
  isIOS() {
    return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
  },
  
  calculateExpiry(date){
    let day = 24*60*60*1000;
    let today = new Date();
    let endDate = new Date(date);
    let expiryDay = Math.round(Math.abs((today.getTime() - endDate.getTime())/(day)));
    return expiryDay+1;
  },

  ravenLogging(exceptionFrom,level,logger) {
    Raven.captureException(exceptionFrom, {
      level: level,
      logger: logger
    });
  },
  


};
