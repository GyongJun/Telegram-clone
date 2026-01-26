const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        Credential: true
    }
});

mongoose.connect('mongodb://localhost:27017/telegram-clone')
    .then(() => {
        console.log('MongoDB 련결 확인됨');
    })
    .catch((err) => {
        console.error(err.messages);
        console.log('mongod 명령어 실행했나요?');
    });

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    userId: { type: String, unique: true },
    createdAt: { type: String, default: Date.now() }

});
const User = mongoose.model('User', userSchema);

const roomSchema = new mongoose.Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {type: String, enum: ['private', 'group', 'channel'], default: 'private'},
    name: String,
    photo: String,

    lastMessage: {
        text: String,
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        timeStamp: Date
    },

    readStatus: {
        type: Map,
        of: Date
    },

    createdAt: Date,
    updatedAt: Date
});

const messageSchema = new Schema ({
    room: { type: Schema.Types.ObjectId, ref:'Room', index: true },
    sender: { type: Schema.Types.ObjectId, ref:'User' },
    text: String,
    media: [{
        type: {type: String, enum: ['image', 'video', 'file'] },
        url: String,
        name: String,
        size: Number
    }],

    readBy: [{
        userId: { type:Schema.Types.ObjectId, ref: 'User' },
        readAt: Date
    }],

    edited: Boolean,
    deleted: Boolean,
    timestamp: { type: Date, default: Date.now, index: true }
});


app.use(cors());
app.use(express.json());


const userSocketMap = {};
const messages = {};
const JWT_SECRET = 'your-secret-key-change-this';

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log('토큰 없음');
            return next(new Error('토큰 필요없음'));
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        socket.userId = decoded.userId;
        socket.email = decoded.email;

        console.log(`인증 완료: ${socket.userId}`);
        next();
    } catch(error) {
        console.log('인증 실패: ', error.messsage);
        next(new Error('인증 실패'));
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);
    console.log(`사용자 련결 ${socket.userId}`);

    socket.on('login', (userId) => {
        userSocketMap[userId] = socket.id;
        console.log(`${userId} 련결됨 `);
    });

    socket.on('sendMessage', (data) => {
        const senderId = data.senderId;
        const receiverId = data.receiverId;
        messageText = data.text;
        
        const receiverSocketId = userSocketMap[receiverId];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', data);
        }
    });
});


const vertifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({error: '토큰필요'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        return res.status(403).json({error: '토큰 무효'});        
    }
};

app.post('/api/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: '이미 가입된 이메일'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `user_${Date.now()}`;
        
        const user = new User({
            email,
            password: hashedPassword,
            name,
            userId,
        });
        await user.save();

        res.json({
            success: true,
            message: '회원가입성공',
            userId: userId,
            name: user.name
        });
    } catch (error) {
        console.error('회원가입 오유', error);
        res.status(500).json({error: '봉사기 오유'});
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: '이메일주소나 사용자암호에서 오유가 발생하였습니다.'});
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({error: '이메일주소나 사용자암호에서 오유가 발생하였습니다.'});
        }
        const token = jwt.sign(
            {userId: user.userId, email: user.email},
            'your-secret-key-change-this',
            {expiresIn: '7d'}
        );
        res.json({
            success: true,
            token,
            userId: user.userId,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error('가입 오유', error);
        res.status(500).json({error: '서버 오유'});
    }
});

app.get('/api/searchUser', vertifyToken, async(req, res) => {

});

server.listen(3000, () => {
    console.log('서버 실행 중: http://localhost:3000');
})
