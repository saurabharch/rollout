import mongoose from "mongoose";
import joi from "@hapi/joi";
import { BadRequest } from "../errors";
const objectId = joi => ({
  type: "objectId",
  base: joi.string(),
  messages: {
    objectId: '"{#label}" is not a valid ID'
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId") };
    }
  }
});
export const Joi = joi.extend(objectId);
export const validate = async (schema, payload) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (e) {
    throw new BadRequest(e);
  }
};
