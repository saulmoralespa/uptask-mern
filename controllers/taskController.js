import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
    const { project } = req.body;

    const existProject = await Project.findById(project);

    if(!existProject){
        const error = new Error("El proyecto no existe");
        return res.status(404).json({msg: error.message});
    }

    if(existProject.creator.toString() !== req.user._id.toString()){
        const error = new Error("No tienes los permisos para añadir tareas");
        return res.status(403).json({msg: error.message});
    }

    try{
        const storageTask = await Task.create(req.body);
        existProject.tasks.push(storageTask._id);
        await existProject.save();
        res.json(storageTask);
    }catch(error){
        console.log(error.message);
    }
};

const getTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");

    if(!task){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("Acción no permitida");
        return res.status(403).json({msg: error.message});
    }

    res.json(task);
};


const updateTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");

    if(!task){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("Acción no permitida");
        return res.status(403).json({msg: error.message});
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dateDelivery = req.body.dateDelivery || task.dateDelivery;

    try{
        const storageTask = await task.save();
        res.json(storageTask);
    }catch(error){
        console.log(error.message);
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");

    if(!task){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("Acción no permitida");
        return res.status(403).json({msg: error.message});
    }

    try{
        await task.deleteOne();
        res.json({msg:"Tarea eliminada"});
    }catch(error){
        console.log(error.message);
    }
};

const changeState = async (req, res) => {

};

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}