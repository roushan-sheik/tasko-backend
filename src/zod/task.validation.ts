import { z } from "zod";

const taskCategoryEnum = z.enum([
  "Art and Craft",
  "Nature",
  "Family",
  "Sport",
  "Friends",
  "Meditation",
  "Collaborative Task",
  "All Task",
]);

const taskStatusEnum = z.enum(["Pending", "InProgress", "Done", "Ongoing"]);

export const createTaskValidation = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(1, "Title cannot be empty")
      .max(100, "Title cannot exceed 100 characters")
      .trim(),

    description: z
      .string({ required_error: "Description is required" })
      .min(1, "Description cannot be empty")
      .max(500, "Description cannot exceed 500 characters")
      .trim(),

    category: taskCategoryEnum.refine((val) => val !== undefined, {
      message: "Category is required",
    }),

    status: taskStatusEnum.optional().default("Pending"),

    endDate: z
      .string({ required_error: "End date is required" })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .refine((date) => new Date(date) >= new Date(), {
        message: "End date must be in the future",
      }),

    points: z
      .number()
      .min(1, "Points must be at least 1")
      .max(100, "Points cannot exceed 100")
      .optional()
      .default(10),
  }),
});

export const updateTaskValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(100, "Title cannot exceed 100 characters")
      .trim()
      .optional(),

    description: z
      .string()
      .min(1, "Description cannot be empty")
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),

    category: taskCategoryEnum.optional(),

    status: taskStatusEnum.optional(),

    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .refine((date) => new Date(date) >= new Date(), {
        message: "End date must be in the future",
      })
      .optional(),

    points: z
      .number()
      .min(1, "Points must be at least 1")
      .max(100, "Points cannot exceed 100")
      .optional(),
  }),
});

export const taskParamsValidation = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Task ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID format"),
  }),
});

export const taskQueryValidation = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    category: taskCategoryEnum.optional(),
    status: taskStatusEnum.optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .refine(
        (val) => !isNaN(val) && val > 0,
        "Limit must be a positive number"
      )
      .optional(),
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, "Page must be a positive number")
      .optional(),
    sortBy: z.string().optional(),
    fields: z.string().optional(),
  }),
});

export const TaskValidation = {
  createTaskValidation,
  updateTaskValidation,
  taskParamsValidation,
  taskQueryValidation,
};
