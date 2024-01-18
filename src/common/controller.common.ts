import { NextFunction, Request, Response } from "express";
import { Service } from "./service.common";
import { ApiError } from "../errors/ApiError";
import mongoose from "mongoose";
import { ROUTES } from "../helpers/constants";

class Controller<TDoc = any> {
    constructor(protected service: Service<TDoc>) { }

    /**
     * @objective get all
     * @method GET
     */
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.findAllByQuery({
                select: { is_deleted: 0, __v: 0 },
            });

            return res.ok(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @objective get one
     * @method GET
     */
    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.params;

            if (!_id) {
                throw new ApiError(ROUTES.error.location, "_id params is required");
            }
            const _idObj = new mongoose.Types.ObjectId(_id);
            const data = await this.service.findOneById({
                _id: _idObj,
                select: { is_deleted: 0, __v: 0 },
            });

            return res.ok(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @objective create one
     * @method POST
     */
    createOne = async(req: Request, res: Response, next: NextFunction) => {
        try {

            const data = await this.service.createOne(req.body);
            if (!data) {
                throw new ApiError(ROUTES.error.location, "not created.");
            }

            return res.ok(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @objective delete one
     * @method POST
     */
    deleteOne = async(req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params._id) {
                throw new ApiError(ROUTES.error.location, "_id params is required");
            }

            const _id = new mongoose.Types.ObjectId(req.params._id);
            const data = await this.service.deleteById(_id);
            if (!data) {
                throw new ApiError(ROUTES.error.location, "not deleted.");
            }

            return res.ok(data);
        } catch (error) {
            next(error);
        }
    }
}

export {
    Controller
}