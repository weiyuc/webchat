<template>
    <li class="session-list-item"
        :class="{ active: active }"
        @click="$emit('switch-session', session.id)">
        <h5 class="session-name">{{ session.name }}</h5>
        <div class="session-time">
            {{ session.lastMessage.timestamp | time }}

        </div>
        <div class="session-last-message">
            {{ session.lastMessage.text }}

        </div>
        <mt-badge size="small" color="red" v-show="session.unreadCount">{{ session.unreadCount }}</mt-badge>
    </li>
</template>

<script>
    export default {
        name: 'Session',
        props: {
            session: Object,
            active: Boolean
        }
    }
</script>
