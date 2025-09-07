import Joi from 'joi';

// Validation schema for Experience
const experienceSchema = Joi.object({
  companyName: Joi.string().required().messages({
    'string.empty': 'Company name is required',
    'any.required': 'Company name is required',
  }),
  location: Joi.string().allow('').optional(),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid ISO 8601 date',
    'date.format': 'Start date must be in ISO 8601 format',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'End date must be a valid ISO 8601 date',
    'date.format': 'End date must be in ISO 8601 format',
  }),
  description: Joi.string().allow('').optional(),
});

// Validation schema for Education
const educationSchema = Joi.object({
  school: Joi.string().required().messages({
    'string.empty': 'School name is required',
    'any.required': 'School name is required',
  }),
  duration: Joi.string().allow('').optional(),
  cgpa: Joi.number().min(0).max(10.0).allow(null).optional().messages({
    'number.min': 'CGPA must be at least 0',
    'number.max': 'CGPA must not exceed 4.0',
  }),
  description: Joi.string().allow('').optional(),
});

// Validation schema for UserProfile
export const profileSchema = Joi.object({
  resume_url: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Resume URL must be a valid URL',
  }),
  skills: Joi.array()
    .items(Joi.string().min(1))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one skill is required',
      'array.base': 'Skills must be an array',
      'any.required': 'Skills are required',
      'string.empty': 'Skill cannot be empty',
    }),
  linkedin: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'LinkedIn URL must be a valid URL',
  }),
  portfolio: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Portfolio URL must be a valid URL',
  }),
  experiences: Joi.array()
    .items(experienceSchema)
    .optional()
    .messages({
      'array.base': 'Experiences must be an array',
    }),
  educations: Joi.array()
    .items(educationSchema)
    .optional()
    .messages({
      'array.base': 'Educations must be an array',
    }),
});