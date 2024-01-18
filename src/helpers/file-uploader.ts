import multer from "multer";
import path from "path";

const destinationPath: string = "./public/uploads/";
const maxSize = 1000000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtension, "")
        .toLowerCase()
        .replace(/ /g, "-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExtension);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    // if (
    //   file.mimetype === "image/png" ||
    //   file.mimetype === "image/jpg" ||
    //   file.mimetype === "image/jpeg"
    // ) {
    cb(null, true);
    // } else {
    //   cb(new Error("File type only .jpg, .png or .jpeg format allowed!"));
    // }
  },
});

// single file uploader
const singleImageUploader = (fieldName: string) => {
  return upload.single(fieldName);
};

// single file uploader
const singlePDFUploader = (fieldName: string) => {
  return upload.single(fieldName);
};

// multiple file uploader
const multiplePDFUploader = (fieldsName: string[]) => {
  const dynamicFields = fieldsName?.map((field: string) => {
    return { name: field, maxCount: 100 };
  });
  return upload.fields(dynamicFields);
};

// multiple file uploader
const multipleImageUploader = (fieldsName: string[]) => {
  const dynamicFields = fieldsName?.map((field: string) => {
    return { name: field, maxCount: 100 };
  });
  return upload.fields(dynamicFields);
};

export {
  singleImageUploader,
  multipleImageUploader,
  singlePDFUploader,
  multiplePDFUploader,
};
