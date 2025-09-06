import express from 'express';
import cors from 'cors'
import http from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import quizRoutes from './routes/quizRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./utils/swagger-output.json" with { type: "json" }; 
import { Server } from "socket.io";
import haversine from 'haversine-distance';
import prisma from './prismaClient.js';

// docker compose run app npx prisma migrate dev --name init
// node swagger.js

const app = express()   
const PORT = process.env.PORT || 5000   

// Go to src
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) 


// Middleware 
app.use(express.json())
app.use(corsMiddleware)
app.use(express.static(path.join(__dirname, '../public')))
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/category', categoryRoutes);
app.use('/question', questionRoutes)
app.use('/match', matchRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

server.listen(PORT, () => {
    console.log(`Socket + server has running on ${PORT}`);
})

// Temp
const matches = new Map();

io.on('connection', (socket) => {
        console.log("Socket connected:", socket.id);
    // Run when client emit event "joinMatch"
    socket.on('joinMatch', async ({ matchId, userId, username }) => {
        socket.join(matchId); // Join this socket in matchId room
        socket.matchId = matchId;
        socket.userId = userId;
        console.log(`Player ${userId} join match ${matchId}!`);

        if (!matches.has(matchId)) {
            const match = await prisma.match.findUnique({where: {id: Number(matchId)}, include: {quiz: { include: {questions: {include: { options: true, range: true, typeAnswer: true, location: true, media: true }}}}}});
            if (!match) return socket.emit('error', 'Match not found');
            // Initialize matches
            matches.set(matchId, {players: [], currentQuestionIndex: 0, questions: match.quiz.questions, timer: null });
        }

        const matchState = matches.get(matchId);
        matchState.players.push({userId, username, score: 0});
        io.to(matchId).emit('playerJoined', matchState.players);
    });

    socket.on('startMatch', async ({ matchId }) => {
        const matchState = matches.get(matchId);
        if (!matchState) 
            console.log("startMatch: matchState is null");
        else 
            console.log(`Start match ${matchId} with players ${JSON.stringify(matchState.players)} and questions count of ${matchState.questions.length}`);

        const handleTimeUp = () => {
            matchState.currentQuestionIndex++;
            sendNextQuestion();            
        }

        socket.on("timeUp", handleTimeUp);

        const sendNextQuestion = () =>  {
            const q = matchState.questions[matchState.currentQuestionIndex];
            // If out of question
            if (!q) return endMatch(matchId);
            io.to(matchId).emit("nextQuestion", {question: q});
        };

        sendNextQuestion();
        await prisma.match.update({where: {id: Number(matchId)}, data: { startTime: new Date() }});
    });


    socket.on('submitAnswer', ({ matchId, userId, questionId, answer}) => {
        const matchState = matches.get(matchId);
        if (!matchState) {
            console.log("submitAnswer: matchState not found", matchId);
            return;
        }
        const q = matchState.questions.find(q => q.id === questionId);
        if (!q) return;
        let isCorrect = false;
        switch (q.type) {
            case 'BUTTONS':  // Pass to checkboxes because have the same algorithm
                isCorrect = q.options[answer]?.isCorrect;
                break;
            case 'CHECKBOXES': // answer is a array of true false [true, false, false, true]
                isCorrect = answer.every((a, i) => q.options[i].isCorrect === a);
                break;
            case 'RANGE':
                isCorrect = Math.abs(q.range.correctValue - answer) <= 5; // Base on our algorithm
                break;
            case 'REORDER':
                isCorrect = answer.every((a, i) => a === q.options[i]?.order);
                break;
            case 'TYPEANSWER':
                isCorrect = q.typeAnswer.correctAnswer.toLowerCase() === answer.toLowerCase();
            case 'LOCATION':
                const correctAnswer = {lat: Number(q.location.correctLatitude), lon: Number(q.location.correctLongitude)};
                const ans = {lat: Number(answer.lat), lon: Number(answer.lon)};
                const distance = haversine(correctAnswer, ans);
                isCorrect = distance <= 10000;
                break;
        }
        const player = matchState.players.find(p => p.userId === userId)
        if (isCorrect) player.score += points; // need to rewrite the algorithm 
        io.to(matchId).emit('answerResult', { userId, isCorrect, questionId });
        io.to(matchId).emit('updatedScores', matchState.players); // players is a object contain scores
    });

    socket.on('endMatch', ({ matchId }) => endMatch(matchId));

    const endMatch = (matchId) => {
        const matchState = matches.get(matchId);
        if (!matchState) return;
        clearInterval(matchState.timer);
        const leaderboard = [...matchState.players].sort((a, b) => b.score - a.score);
        io.to(matchId).emit('gameOver', { leaderboard }); // Destructure this to get point 

        prisma.$transaction(async (tx) => {
            await tx.match.update({where: {id: Number(matchId)}, data: { endTime: new Date() }});
            for (const p of matchState.players) {
                await tx.matchResult.create({data: {matchId: Number(matchId), userId: p.userId, score: p.score }});
            }
        });
        matches.delete(matchId);
    }

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);

        const { matchId, userId } = socket;
        
        if (matchId && matches.has(matchId)) {
            const matchState = matches.get(matchId);
            matchState.players = matchState.players.filter(player => player.userId != userId);
            
            console.log(`Player ${userId} left match ${matchId}. Remaining players: ${matchState.players.length}`);
            io.to(matchId).emit('playerLeft', matchState.players);

            if (matchState.players.length === 0) {
                console.log(`No players left in match ${matchId}, cleaning up`);
                if (matchState.timer) {
                    clearInterval(matchState.timer);
                }
                matches.delete(matchId);
            }
        }
    })

});

