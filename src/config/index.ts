import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(),'src','.env')
});

const config = {
    port:  process.env.PORT,
    connection_String: process.env.DATABASE_URL as string
};


export default config;