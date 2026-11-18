import express, { type Application, type Request, type Response } from 'express';
import {Pool} from 'pg';

const app: Application = express();
const port = 3000;
const pool = new Pool ({
    connectionString:"postgresql://neondb_owner:npg_2fHilLu0TezU@ep-noisy-wind-a17l17tl.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require"
})
// console.log(pool)
const initDB = async ()=>{
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY, 
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,

                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()

            );
            `);
        // console.log("last of try")
        // console.log("database connected successfully!!!");
        
    } catch (error) {
        console.log(error)
    }
}

initDB();

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))


// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });
// GET root directory or testing DB connection from root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success:true,
    message:"this is express server running from root route",
    author:"Md Maruf Islam"
  });
});
// POST or create user
app.post('/api/v1/users', async (req: Request, res: Response) => {
//   console.log(req.body)
    try {
            const {name, email, password, age} = req.body;
    const result = await pool.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3) RETURNING *;
        `, [name, email, password]);

    // console.log(result)

    res.status(201).json({
    success:true,
    message:"User created successfully",
    data: result.rows[0],
  });
    } catch (error:any) {
        res.status(501).json({
        success:false,
        message:error?.message,
        error: error,
        });
    }
});
// GET all user
app.get('/api/v1/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users; 
            `);
        // console.log(result)
        res.status(200).json({
        success:true,
        message:"User retrived successfully",
        data: result.rows,
  });
    } catch (error:any) {
        res.status(500).json({
        success:false,
        message:error?.message,
        error: error,
        });
    }
});
// GET single user
app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
        // const id= req.params.id; 
        const {id}= req.params;
        const result = await pool.query(`
            SELECT * FROM users WHERE id=$1
            `, [id]); 
        // console.log(result)

                
        if(result.rowCount ===0){
            res.status(404).json({
            success:true,
            message:"User not found",
         })
        }
        
        res.status(200).json({
        success:true,
        message:"Single User retrived successfully",
        data: result.rows[0],
  });
    } catch (error:any) {
        res.status(500).json({
        success:false,
        message:error?.message,
        error: error,
        });
    }
});
// PUT method - updating user 
app.put('/api/v1/users/:id', async (req:Request, res: Response)=>{
    try {
        const {id}= req.params;
        const {name, is_active} = req.body;
        const result = await pool.query(`
            UPDATE users
            SET 
            name = COALESCE($1, name),
            is_active = COALESCE($2, is_active),
            updated_at = NOW()
            WHERE id = $3 RETURNING *
            `,[name ?? null, is_active  ?? null, id]);
        
                
        if(result.rowCount ===0){
            res.status(404).json({
            success:true,
            message:"User not found",
         })
        }

        res.status(202).json({
            success:true,
            message:"User updated successfully",
            data: result.rows[0],
        })

    } catch (error:any) {
        res.status(503).json({
        success:false,
        message:error?.message,
        error: error,
        });
    }
})

// DELETE a single user 
app.delete('/api/v1/users/:id', async (req:Request, res: Response)=>{
    try {
        const {id}= req.params;
        const result = await pool.query(`
            DELETE from users
            WHERE id = $1 
            `,[id]);
        console.log(result)
        
        if(result.rowCount ===0){
            res.status(404).json({
            success:true,
            message:"User not found",
         })
        }

        res.status(202).json({
            success:true,
            message:"User DELETED successfully",
        })

    } catch (error:any) {
        res.status(503).json({
        success:false,
        message:error?.message,
        error: error,
        });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});