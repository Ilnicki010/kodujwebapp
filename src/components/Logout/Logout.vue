<template>
  <button @click="logOut">Wyloguj</button>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Logout",
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("join");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

