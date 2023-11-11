import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        state: {
            type: Boolean,
            default: false,
        },
        dateDelivery : {
            type: Date,
            required: true,
            default: Date.now()
        },
        priority: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"]
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project"
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("task", taskSchema);
export default Task;