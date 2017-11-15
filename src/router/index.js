import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import MessageSection from '@/components/MessageSection'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/messageSection',
            name: 'messageSection',
            component: MessageSection
        }
    ]
})
