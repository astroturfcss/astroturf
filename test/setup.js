import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { toMatchFile } from 'jest-file-snapshot';

expect.extend({ toMatchFile });
Enzyme.configure({ adapter: new Adapter() });

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = true;
