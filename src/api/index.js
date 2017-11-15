import data from './mock-data'
const LATENCY = 16

export default {
    getAllMessages (cb) {
        setTimeout(() => {
            cb(data)
        }, LATENCY)
    },
    createMessage ({text, thread}, cb) {
        const timestamp = Date.now()
        const id = 'm_' + timestamp
        const message = {
            id,
            text,
            timestamp,
            threadID: thread.id,
            threadName: thread.name,
            authorName: 'Evan'
        }
        setTimeout(function () {
            cb(message)
        }, LATENCY)
    }
}
