import EmberRouter from '@ember/routing/router';
import config from 'freshworks-peer-appreciation/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('card', { path: 'card/:quality_id' },  function() {});
});
