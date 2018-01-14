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
        sessionID: data[random].sessionID,
        sessionName: data[random].sessionName,
        authorName: data[random].authorName,
        text: `hello ${Date.now()}`,
        timestamp: Date.now()
      };
      cb(t)
    }, LATENCY)
  },
  createMessage ({text, session}, cb) {
    const timestamp = Date.now()
    const id = 'm_' + timestamp
    const message = {
      id,
      text,
      timestamp,
      sessionID: session.id,
      sessionName: session.name,
      authorName: 'Evan'
    }
    console.log('message', message);
    setTimeout(function () {
      cb(message)
    }, LATENCY)
  }
}
