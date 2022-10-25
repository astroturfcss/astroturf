import camelCase from 'lodash.camelcase';
import flow from 'lodash.flow';
import upperFirst from 'lodash.upperfirst';

export default flow(camelCase, upperFirst);
