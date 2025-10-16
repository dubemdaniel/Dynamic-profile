import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009 || "0.0.0.0";


app.use(cors());
app.use(express.json());


// Interface for Cat Fact API response
interface CatFactResponse {
  fact: string;
  length: number;
}

// Interface for our API response
interface ProfileResponse {
  status: string;
  user: {
    email: string;
    name: string;
    stack: string;
  };
  timestamp: string;
  fact: string;
}

// GET /me endpoint
app.get('/me', async (_req: Request, res: Response) => {
  try {

    const catFactResponse = await axios.get<CatFactResponse>(
      'https://catfact.ninja/fact',
      {
        timeout: 5000, 
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    
    const response: ProfileResponse = {
      status: 'success',
      user: {
         email: process.env.USER_EMAIL! ,
        name: process.env.USER_NAME! ,
        stack: process.env.USER_STACK! 
      },
      timestamp: new Date().toISOString(),
      fact: catFactResponse.data.fact
    };

   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching cat fact:', error);

    // Handle error gracefully
    const errorResponse: ProfileResponse = {
      status: 'success',
      user: {
        email: process.env.USER_EMAIL! ,
        name: process.env.USER_NAME! ,
        stack: process.env.USER_STACK! 
      },
      timestamp: new Date().toISOString(),
      fact: 'Cats are wonderful creatures! (Unable to fetch cat fact at this time)'
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(errorResponse);
  }
});


// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;