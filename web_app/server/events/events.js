const EventEmitter = require('events');

const assessmentEvents = new EventEmitter();

const overallReportEvents = new EventEmitter();

module.exports = { assessmentEvents, overallReportEvents };
