const pmw = require('pelias-microservice-wrapper')

class SpatialServiceConfig extends pmw.ServiceConfiguration {
  constructor() {
    super('spatial', {
      url: 'http://spatial:4770/'
    })
  }
  getUrl() {
    return `${this.baseUrl}query/pip/beta`;
  }
  getParameters(params) {
    return params;
  }
  isEnabled() {
    return true
  }
  createClient() {
    return pmw.service(this)
  }
};

module.exports = SpatialServiceConfig
