import joi from 'joi';

export const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.any().valid(Joi.ref('password')).required()
});