import Application from 'freshworks-peer-appreciation/app';
import config from 'freshworks-peer-appreciation/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
