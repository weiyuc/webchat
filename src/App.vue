<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import store from './store'
    import { getMessages } from './store/actions'
    export default {
        name: 'app',
        created() {
            setInterval(() => {
                getMessages(store)
            }, 5000)
        }
    }
</script>
<style lang="scss">
    html {
        width: 100%;
        height: 100%;
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: "Microsoft Sans Serif";
            font-size: 14px;
            > div {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
