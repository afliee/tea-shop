import multer from "multer";

const PUBLIC_PATH = 'src/public';
const IMPORT_PATH = 'src/public/uploads/import';
const PRODUCT_PATH = 'src/public/uploads/product';
const CATEGORY_PATH = 'src/public/uploads/category';

const IMPORT_FILTER_TYPES = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const IMPORT_MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

const PRODUCT_FILTER_TYPES = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const PRODUCT_MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB


const IMPORT_TYPE = 'import';
const PRODUCT_TYPE = 'product';
const CATEGORY_TYPE = 'category';
const multerConfig = ( path = '', filter_type = '' ) => {
    return {
        storage: multer.diskStorage({
            destination: function ( req, file, cb ) {
                cb(null, `${ path }`)
            },
            filename: function ( req, file, cb ) {
                cb(null, file.originalname)
            },
            fileFilter: function ( req, file, cb ) {
                switch (filter_type) {
                    case IMPORT_TYPE:
                        if (IMPORT_FILTER_TYPES.includes(file.mimetype)) {
                            cb(null, true);
                        } else {
                            cb(null, false);
                        }
                        break;
                    case PRODUCT_TYPE:
                        if (PRODUCT_FILTER_TYPES.includes(file.mimetype)) {
                            cb(null, true);
                        } else {
                            cb(null, false);
                        }
                    default:
                        cb(null, false);
                }
            }
        })
    }
}

export {
    IMPORT_PATH,
    PRODUCT_PATH,
    CATEGORY_PATH,
    PUBLIC_PATH,
    IMPORT_TYPE,
    PRODUCT_TYPE,
    CATEGORY_TYPE,
    multerConfig
}