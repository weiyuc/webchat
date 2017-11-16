import data from './mock-data'
const LATENCY = 10

export default {
    getAllMessages (cb) {
        setTimeout(() => {
            cb(data)
        }, LATENCY)
    },
    getMessages (cb) {
        setTimeout(() => {
            let random = Math.floor(Math.random() * 5)
            let t = {
                    id: `m_${new Date().getTime()}`,
                    threadID: data[random].threadID,
                    threadName: data[random].threadName,
                    authorName: data[random].authorName,
                    text: `hello ${Date.now()}`,
                    timestamp: Date.now()
                };
            cb(t)
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
