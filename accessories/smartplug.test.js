const hap = require('hap-nodejs');

const SmartPlug = require('./smartplug');

describe('SmartPlug', () => {
  const homebridge = { hap };
  const logger = jest.fn();
  const config = {
    area: 'Living room',
    currentState: 'ON',
  };
  const installation = { getOverview: null };

  const smartPlug = new SmartPlug(homebridge, logger, config, installation);

  it('setup name and value', () => {
    expect(smartPlug.name).toBe('SmartPlug (Living room)');
    expect(smartPlug.value).toBe(true);
  });

  it('get current switch state', (done) => {
    installation.getOverview = jest.fn();
    installation.getOverview.mockResolvedValueOnce({
      smartPlugs: [{
        currentState: 'OFF',
      }],
    });
    smartPlug.getSwitchState((error, value) => {
      expect(error).toBe(null);
      expect(value).toBe(false);
      done();
    });
  });

  it('set switch state', (done) => {
    expect.assertions(2);
    installation.client = jest.fn();
    installation.client.mockResolvedValueOnce({ success: true });

    smartPlug.setSwitchState(true, (error) => {
      expect(smartPlug.value).toBe(true);
      expect(error).toBe(null);
      done();
    });
  });
});
