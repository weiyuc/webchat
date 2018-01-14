<template>
    <div class="contact-section" ref="contactSection">

        <mt-index-list :height="height">
            <mt-cell :title="$t('msg.newFriends')">
                <span slot="icon" class="new-friend-icon">
                    <img src="../assets/img/newFriends.png"></img>
                </span>
            </mt-cell>
            <mt-index-section index="A">
                <mt-cell title="Aaron"></mt-cell>
                <mt-cell title="Alden"></mt-cell>
                <mt-cell title="Austin"></mt-cell>
            </mt-index-section>
            <mt-index-section index="B">
                <mt-cell title="Baldwin"></mt-cell>
                <mt-cell title="Braden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="C">
                <mt-cell title="Caldwin"></mt-cell>
                <mt-cell title="Craden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="D">
                <mt-cell title="Daldwin"></mt-cell>
                <mt-cell title="Draden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="E">
                <mt-cell title="Ealdwin"></mt-cell>
                <mt-cell title="Eraden"></mt-cell>
            </mt-index-section>

            <mt-index-section index="F">
                <mt-cell title="Aaron"></mt-cell>
                <mt-cell title="Alden"></mt-cell>
                <mt-cell title="Austin"></mt-cell>
            </mt-index-section>
            <mt-index-section index="G">
                <mt-cell title="Baldwin"></mt-cell>
                <mt-cell title="Braden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="H">
                <mt-cell title="Caldwin"></mt-cell>
                <mt-cell title="Craden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="I">
                <mt-cell title="Daldwin"></mt-cell>
                <mt-cell title="Draden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="J">
                <mt-cell title="Ealdwin"></mt-cell>
                <mt-cell title="Eraden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="K">
                <mt-cell title="Zack"></mt-cell>
                <mt-cell title="Zane"></mt-cell>
            </mt-index-section>

            <mt-index-section index="L">
                <mt-cell title="Aaron"></mt-cell>
                <mt-cell title="Alden"></mt-cell>
                <mt-cell title="Austin"></mt-cell>
            </mt-index-section>
            <mt-index-section index="M">
                <mt-cell title="Baldwin"></mt-cell>
                <mt-cell title="Braden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="N">
                <mt-cell title="Caldwin"></mt-cell>
                <mt-cell title="Craden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="O">
                <mt-cell title="Daldwin"></mt-cell>
                <mt-cell title="Draden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="P">
                <mt-cell title="Ealdwin"></mt-cell>
                <mt-cell title="Eraden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="Q">
                <mt-cell title="Zack"></mt-cell>
                <mt-cell title="Zane"></mt-cell>
            </mt-index-section>

            <mt-index-section index="R">
                <mt-cell title="Aaron"></mt-cell>
                <mt-cell title="Alden"></mt-cell>
                <mt-cell title="Austin"></mt-cell>
            </mt-index-section>
            <mt-index-section index="S">
                <mt-cell title="Baldwin"></mt-cell>
                <mt-cell title="Braden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="T">
                <mt-cell title="Caldwin"></mt-cell>
                <mt-cell title="Craden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="U">
                <mt-cell title="Daldwin"></mt-cell>
                <mt-cell title="Draden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="V">
                <mt-cell title="Ealdwin"></mt-cell>
                <mt-cell title="Eraden"></mt-cell>
            </mt-index-section>
            <mt-index-section index="W">
                <mt-cell title="Zack"></mt-cell>
                <mt-cell title="Zane"></mt-cell>
            </mt-index-section>

            <mt-index-section index="X">
                <mt-cell title="Aaron"></mt-cell>
                <mt-cell title="Alden"></mt-cell>
                <mt-cell title="Austin"></mt-cell>
            </mt-index-section>
            <mt-index-section index="Y">
                <mt-cell title="Baldwin"></mt-cell>
                <mt-cell title="Braden"></mt-cell>
            </mt-index-section>
        </mt-index-list>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'contact-section',
        props: {
            height: Number
        }

    }
</script>
<style lang="scss">
    .contact-section {
        .mint-indexlist-nav {
            width: 22px !important;
        }
        .mint-indexlist-content {
            margin-right: 23px !important;
        }
        .new-friend-icon {
            display: inline-block;
            text-align: center;
            line-height: 25px;
            width: 30px;
            height: 30px;
            background-color: #58B7FF;
            border-radius: 5px;
            margin-right: 10px;
        }
    }
</style>