var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var winston = require('../../config/winston');
var ProjectUserSchema = require("./project_user").schema;
var DepartmentSchema = require("./department").schema;
var LeadSchema = require("./lead").schema;

var RequestSnapshotSchema = new Schema({
  
  requester: {
    type: ProjectUserSchema,  
  },
  lead: {
    type: LeadSchema,    
  },
  department: {
    type: DepartmentSchema,       
  },
  agents:  {
    type: [ProjectUserSchema],
    // select: true
    select: false
  },
  // participatingAgents
  availableAgentsCount: {
    type: Number,
    index:true
  }
  // participatingBots
},{ _id : false }
);


module.exports = RequestSnapshotSchema;
