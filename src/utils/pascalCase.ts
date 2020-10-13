import camelCase from 'lodash/camelCase';
import flow from 'lodash/flow';
import upperFirst from 'lodash/upperFirst';

export default flow(camelCase, upperFirst);
