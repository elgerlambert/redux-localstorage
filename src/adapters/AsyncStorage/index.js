import transformState from '../../transformState.js';
import adapter from './adapter.js';

export default storage => transformState(JSON.stringify, JSON.parse)(adapter(storage));
