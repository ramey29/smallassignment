import Env from './Env';

const CURRENT_ENV = Env.CURR_ENV;

const BASE_URL = {
  LOCAL: 'https://api.myjson.com',
  STAGE: '',
  PREPROD: '',
  PROD: ''
};

const JOBLISTINGSERVICE = `${BASE_URL[CURRENT_ENV]}`;



export const getJoblistingAPI = () => ({
  GET_JOBLISTING: `${JOBLISTINGSERVICE}/bins/kez8a`
});


