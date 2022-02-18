
import Project from'../model/project';
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const keys = require('./../config/keys');
const ratelimit = require('../util/limiter');
const UUID = require('uuid-int');
export const createProject = async (req, res) => {
  const { title, description, tag, category } = req.body;
  //projectId ==> Numeric
  const id = 0;

const generator = UUID(id);

const uuid = generator.uuid();
  const session = await Project.startSession();
  session.startTransaction();
  try{
    var pyloadData = {
      title:req.body.title, 
      description:req.body.description,
      tag:req.body.tag,
      category:req.body.category,
      projectId:uuid
    }
    const payload = new Project(pyloadData);

    const ProjectSaved = await payload.save();
    //clearKey(Project);
    session.commitTransaction();
    session.endSession();
    res.status(201).json(ProjectSaved);
  }catch(error){
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getProjectById = async (req, res) => {
  const session = await Project.startSession();
  session.startTransaction();
  const { projectId } = req.params;

  const project = await Project.find({projectId:projectId}).cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  res.status(200).json(project);
};

export const getProjectList = async (req, res) => {
   const session = await Project.startSession();
    session.startTransaction();
  const Projectes = await Project.find().cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  return res.json(Projectes);
};

export const updateProjectId = async (req, res) => {
   const session = await Project.startSession();
    session.startTransaction();
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.projectId,
    req.body,
    {
      new: true
    }
  ).cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  clearKey(Project.collection.collectionName);
  res.status(204).json(updatedProject);
};

export const deleteProjectById = async (req, res) => {
  const { projectId } = req.params;
 const session = await Project.startSession();
       session.startTransaction();
  await Project.findByIdAndDelete(projectId).cache({
        time: 10
      }).exec();
   clearKey(Project);
  // code 200 is ok too
  session.commitTransaction();
  session.endSession();
  res.status(204).json();
};

