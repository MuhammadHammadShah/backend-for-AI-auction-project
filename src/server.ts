// server.ts
import app from './app'
import { config } from './config/config'
import { declareWinnersJob } from './cron/declareWinners.cron'

const PORT = config.port

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`)
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
declareWinnersJob.start()
