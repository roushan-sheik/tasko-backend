/* eslint-disable no-unused-vars */
import { Schema, model } from "mongoose";
import { Task } from "../interfaces/task.interface";

const taskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [500, "Task description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Task category is required"],
      enum: {
        values: [
          "Art and Craft",
          "Nature",
          "Family",
          "Sport",
          "Friends",
          "Meditation",
          "Collaborative Task",
          "All Task",
        ],
        message: "Please select a valid category",
      },
    },
    status: {
      type: String,
      required: [true, "Task status is required"],
      enum: {
        values: ["Pending", "InProgress", "Done", "Ongoing"],
        message: "Please select a valid status",
      },
      default: "Pending",
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (date: Date) {
          return date >= new Date();
        },
        message: "End date must be in the future",
      },
    },
    points: {
      type: Number,
      required: [true, "Task points are required"],
      min: [1, "Points must be at least 1"],
      max: [100, "Points cannot exceed 100"],
      default: 10,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ endDate: 1 });
taskSchema.index({ userId: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual for checking if task is overdue

taskSchema.virtual("isOverdue").get(function (this: Task) {
  return this.endDate < new Date() && this.status !== "Done";
});

// Pre-save middleware to handle status transitions
taskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Done") {
    //  logic here like awarding points to user
  }
  next();
});

const TaskModel = model<Task>("Task", taskSchema);

export default TaskModel;
