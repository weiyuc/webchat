<template>
    <li class="thread-list-item"
        :class="{ active: active }"
        @click="$emit('switch-thread', thread.id)">
        <h5 class="thread-name">{{ thread.name }}</h5>
        <div class="thread-time">
            {{ thread.lastMessage.timestamp | time }}

        </div>
        <div class="thread-last-message">
            {{ thread.lastMessage.text }}

        </div>
        <mt-badge size="small" color="red" v-show="thread.unreadCount">{{ thread.unreadCount }}</mt-badge>
    </li>
</template>

<script>
    export default {
        name: 'Thread',
        props: {
            thread: Object,
            active: Boolean
        }
    }
</script>
