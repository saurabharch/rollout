'use strict';

var Project = require("../model/project");
var Project_user = require("../model/project_user");
var mongoose = require('mongoose');
var User = require('../model/usernew');
var winston = require('../../config/winston');
var pendinginvitation = require("./pendingInvitationService");

class ProjectUserService {


}
var projectUserService = new ProjectUserService();


module.exports = projectUserService;
