import { PaginateLocationModel } from '../models/location.model.js';
import { ResponseService } from '../utils/response.service.js';
import {
  createLocationSchema,
  editLocationSchema,
} from '../schemas/location.schema.js';
import { createAuditLog } from './audit.controller.js';

const getLocation = async (req, res) => {
  try {
    const locationId = req.params.location;

    const location = await PaginateLocationModel.findOne({
      _id: locationId,
      isDeleted: { $ne: true },
    });

    if (!location) {
      return ResponseService.json(res, 400, 'Location not found.');
    }

    ResponseService.json(
      res,
      200,
      'Location retrieved successfully.',
      location
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await PaginateLocationModel.find({
      isDeleted: { $ne: true },
    });

    const _locations = locations.map((location) => {
      return {
        id: location.id,
        name: location.name,
        description: location.description,
        type: location.type,
      };
    });

    res.json({ data: _locations });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createLocation = async (req, res) => {
  try {
    const { error, value } = createLocationSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const location = await PaginateLocationModel.create(value);

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> created location <b>${location.name}</b> information.`,
        metadata: location,
      });

    ResponseService.json(res, 201, 'Location created successfully.', location);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const editLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const { error, value } = editLocationSchema.validate(req.body);

    if (error) return ResponseService.json(res, error);

    const updatedLocation = await PaginateLocationModel.findOneAndUpdate(
      { _id: location, isDeleted: { $ne: true } },
      value,
      { new: true }
    );

    if (!updatedLocation) {
      return ResponseService.json(
        res,
        400,
        'Location to be updated not found.'
      );
    }

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> update location <b>${updatedLocation.name}</b> information.`,
        metadata: location,
      });

    ResponseService.json(
      res,
      200,
      'Location updated successfully.',
      updatedLocation
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteLocation = async (req, res) => {
  const location = req.params.location;

  const deletedLocation = await PaginateLocationModel.findOneAndUpdate(
    { _id: location, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedLocation) {
    return ResponseService.json(res, 400, 'Location to be deleted not found.');
  }

  if (req.user)
    createAuditLog({
      creator: req.user.id,
      message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> deleted location <b>${deletedLocation.name}</b> information.`,
      metadata: location,
    });

  ResponseService.json(res, 200, 'Location deleted successfully.');
};

export {
  getLocation,
  getLocations,
  createLocation,
  editLocation,
  deleteLocation,
};
