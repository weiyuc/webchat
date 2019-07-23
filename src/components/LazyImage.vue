<template>
  <v-img
    :src="lazySrc"
    >
    <template v-slot:placeholder>
      <v-layout
        fill-height
        align-center
        justify-center
        ma-0>
        <v-avatar color="indigo">
          <v-icon dark>person_outline</v-icon>
        </v-avatar>
      </v-layout>
    </template>
  </v-img>
</template>
<script>
  export default {
    name: 'wc-lazy-img',
    props: {
      lazySrc: {
        type: String,
        required: true
      }
    }
  }
</script>