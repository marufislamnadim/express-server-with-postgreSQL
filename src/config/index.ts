import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(),'.env')
});

const config = {
    port:  Number(process.env.PORT),
    connection_String: process.env.DATABASE_URL as string
};


export default config;