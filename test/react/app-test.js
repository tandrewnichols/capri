import React from 'react';
import App from 'components/app';
import { shallow, mount, render } from 'enzyme'

describe('App', function() {
  it('renders an h2 with the text Capri', function() {
    shallow(<App />).is('h2').should.be.true()
  });
});
