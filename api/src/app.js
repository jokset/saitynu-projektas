const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')

const usersRouter = require('./routes/users')
const mainRouter = require('./routes')
const authRouter = require('./routes/auth')
const eventsRouter = require('./routes/events')
const schedulesRouter = require('./routes/schedules')
const tasksRouter = require('./routes/tasks')
const ticketsRouter = require('./routes/tickets')

const publicDirectoryPath = path.join(__dirname, '../build')

const app = express();

app.use(cors({origin: 'null'}))
app.use(cookieParser())
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(express.json({limit: '50mb'}))

app.use(express.static(publicDirectoryPath))

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/schedules', schedulesRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/tickets', ticketsRouter)
app.use(mainRouter)

app.listen(3000 || process.env.PORT)