import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
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
        dateDelivery : {
            type: Date,
            default: Date.now()
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'task'
            }
        ],
        customer: {
            type: String,
            trim: true,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("project", projectSchema);
export default Project;