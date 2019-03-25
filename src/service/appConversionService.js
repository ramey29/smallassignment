import Proteus from '../common/Proteus';
import { getJoblistingAPI } from '../common/Urls';

const getJobs = () => {
  return Proteus().get(getJoblistingAPI().GET_JOBLISTING);
};

export default {
  getJobs
};
