import { mount } from 'enzyme';
import React from 'react';

import { mapProps, withProps } from '../src/helpers';

describe('helpers', () => {
  describe('mapProps', () => {
    it('should set displayName', () => {
      const DoReMi = mapProps(p => p)('div');

      const div = mount(<DoReMi />).find('mapProps(div)');

      expect(div).toHaveLength(1);
    });

    test('mapProps maps owner props to child props', () => {
      const mapper = jest.fn(props => ({
        ...props,
        bar: props.bar + 1,
      }));
      const inner = () => null;
      inner.displayName = 'inner';
      const Component = mapProps(mapper)(inner);

      const wrapper = mount(<Component bar={3} baz />);

      expect(mapper).toHaveBeenCalledWith({ bar: 3, baz: true });

      expect(wrapper.find('inner').prop('bar')).toEqual(4);
      expect(wrapper.find('inner').prop('baz')).toEqual(true);
    });

    it('should accept a ref', () => {
      const DoReMi = mapProps(p => p)('div');
      const ref = React.createRef();
      mount(<DoReMi ref={ref} />);

      expect(ref.current).toBeDefined();
    });
  });

  describe('withProps', () => {
    it('should set displayName', () => {
      const DoReMi = withProps({})('div');

      const div = mount(<DoReMi />).find('withProps(div)');

      expect(div).toHaveLength(1);
    });

    it('should accept a ref', () => {
      const DoReMi = withProps({})('div');
      const ref = React.createRef();
      mount(<DoReMi ref={ref} />);

      expect(ref.current).toBeDefined();
    });

    it('should pass additional props to base component', () => {
      const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div');

      const div = mount(<DoReMi />).find('div');
      expect(div.prop('data-so')).toBe('do');
      expect(div.prop('data-la')).toBe('fa');
    });

    it('should take precedent over owner props', () => {
      const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div');

      const div = mount(<DoReMi data-la="ti" />).find('div');
      expect(div.prop('data-so')).toBe('do');
      expect(div.prop('data-la')).toBe('fa');
    });

    it('should accept a function', () => {
      const DoReMi = withProps(props => ({
        'data-so': props['data-la'],
      }))('div');

      const div = mount(<DoReMi data-la="la" />).find('div');

      expect(div.prop('data-so')).toBe('la');
    });
  });
});
