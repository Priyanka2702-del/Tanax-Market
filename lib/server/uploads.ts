import path from "node:path";
export const uploadRoot = () => path.resolve(process.env.UPLOAD_DIR || "./storage/kyc");
