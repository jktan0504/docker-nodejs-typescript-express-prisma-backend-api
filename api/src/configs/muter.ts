import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

export const multerConfig = {
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            return cb(null, false);
        }
        cb(null, true);
    },
};
