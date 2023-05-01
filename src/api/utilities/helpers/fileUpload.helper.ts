import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from 'fs'

const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // Create the directory if it does not exist
    const dir: string = "src/api/storage/photos";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, file.originalname);
  },
});

const limits: any = {
  fileSize: 1000000,
};

const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    console.log(file);
    cb(null, true);
  },
});
export default upload;
