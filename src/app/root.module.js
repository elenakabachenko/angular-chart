import angular from 'angular';

import {RootComponent} from './root.component';

angular
  .module('root', [])
  .component(RootComponent.selector, RootComponent);
