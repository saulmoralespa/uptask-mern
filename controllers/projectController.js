import Project from "../models/Project.js";
import User from "../models/User.js";


const getProjects = async (req, res) => {
    const projects = await Project.find({
        '$or':[
            {'collaborators': {$in: req.user}},
            {'creator': {$in: req.user}}
        ]
    }).select('-tasks');
    res.json(projects);
};


const newProject = async (req, res) => {
    const project = new Project(req.body);
    project.creator = req.user._id;
    
    try{
        const storageProject = await project.save();
        res.json(storageProject);
    }catch(error){
        console.log(`Error: ${error.message}`);
    }
};

const getProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id)
    .populate('tasks')
    .populate('collaborators', 'name email');
    
    if(!project){
       return res.status(404).json({msg: "No encontrado"}); 
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: "Acción no válida"});
    }
    
    res.json(project);
};

const editProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id);
    
    if(!project){
       return res.status(404).json({msg: "No encontrado"}); 
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: "Acción no válida"});
    }

    project.name = req.body.name || project.name;
    project.customer = req.body.customer || project.customer;
    project.description = req.body.description || project.description;
    project.dateDelivery = req.body.dateDelivery || project.dateDelivery;

    try{
        const storageProject = await project.save();
        res.json(storageProject);
    }catch(error){
        console.log(error.message);
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id);
    
    if(!project){
       return res.status(404).json({msg: "No encontrado"}); 
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: "Acción no válida"});
    }

    try{
        await project.deleteOne();
        res.json({msg: 'Proyecto Eliminado'});
    }catch(error){

    }
};

const searchCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email}).select('-confirmed -createdAt -password -token -updatedAt -__v');

  if(!user){
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({msg:error.message});
  }

  res.json(user);
};

const addCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if(!project){
        const error = new Error('Proyecto No encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(404).json({msg: error.message});
    }

    const { email } = req.body;
    const user = await User.findOne({email}).select('-confirmed -createdAt -password -token -updatedAt -__v');

    if(!user){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg:error.message});
    }

    if(project.creator.toString() === user._id.toString()){
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(404).json({msg: error.message});
    }

    if(project.collaborators.includes(user._id)){
        const error = new Error('El usuario ya pertenece al proyecto');
        return res.status(404).json({msg: error.message});
    }

    project.collaborators.push(user._id);
    await project.save();
    res.json({msg: 'Colaborador Agregado Correctamente'});
};

const deleteCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if(!project){
        const error = new Error('Proyecto No encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(404).json({msg: error.message});
    }

    project.collaborators.pull(req.body.id);
    await project.save();
    res.json({msg: 'Colaborador Eliminado Correctamente'});
};
export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    deleteCollaborator
};