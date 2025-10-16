"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3009 || "0.0.0.0";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// GET /me endpoint
app.get('/me', async (_req, res) => {
    try {
        const catFactResponse = await axios_1.default.get('https://catfact.ninja/fact', {
            timeout: 5000,
            headers: {
                'Accept': 'application/json'
            }
        });
        const response = {
            status: 'success',
            user: {
                email: process.env.USER_EMAIL,
                name: process.env.USER_NAME,
                stack: process.env.USER_STACK
            },
            timestamp: new Date().toISOString(),
            fact: catFactResponse.data.fact
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error fetching cat fact:', error);
        // Handle error gracefully
        const errorResponse = {
            status: 'success',
            user: {
                email: process.env.USER_EMAIL,
                name: process.env.USER_NAME,
                stack: process.env.USER_STACK
            },
            timestamp: new Date().toISOString(),
            fact: 'Cats are wonderful creatures! (Unable to fetch cat fact at this time)'
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(errorResponse);
    }
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map