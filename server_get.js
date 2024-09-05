import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketIOServer } from 'socket.io';
import initDB from './database.js';
import initRoutes from './Routers/routes.js';

// Initialize Express app
const app = express();

// Create HTTP server
const http = import('http').then(({ createServer }) => createServer(app));

// Initialize Socket.IO
http.then(server => {
    const io = new SocketIOServer(server);
    io.on('connection', (socket) => {
        console.log('a client is connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        setInterval(() => {
            const x = parseInt(Math.random() * 10);
            socket.emit('number', x);
            console.log('Emitting Number ' + x);
        }, 1000);
    });

    // Start listening for HTTP requests
    const port = 3040;
    server.listen(port, () => {
        console.log("Server is listening on port " + port);
    });
});

// Setup the Express app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database and routes
initDB();
initRoutes(app);
