import dotenv from "dotenv"
import path from "path"

// Load root .env when running from app subfolders in this monorepo.
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") })

const JWT_SECRET = process.env.JWT_SECRET || ""
export { JWT_SECRET }

