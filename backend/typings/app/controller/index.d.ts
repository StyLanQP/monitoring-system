// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome = require('../../../app/controller/home');
import ExportMonitor = require('../../../app/controller/monitor');

declare module 'egg' {
  interface IController {
    home: ExportHome;
    monitor: ExportMonitor;
  }
}
