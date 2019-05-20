<template>
  <div class="homeWrapper">
    <NavBar :userNick="user.nick"/>
    <section class="modes">
      <article class="column column--primary">
        <img src="../assets/train_char.svg" alt="Cwicz">
        <h2>Single</h2>
        <p>Ten tryb w formie quiz'u pozwoli ci zdobyć wiedzę oraz pytania do Twojego plecaka!</p>
        <router-link tag="button" class="btn" to="/single">Graj!</router-link>
      </article>
      <article class="column column--dark">
        <img src="../assets/collect_char.svg" alt="Cwicz">
        <h2>Plecak</h2>
        <router-link tag="button" class="btn btn--primary" to="/pack">Sprawdź!</router-link>
      </article>
      <article class="column column--primary">
        <img src="../assets/fight_char.svg" alt="Walcz">
        <h2>Multi</h2>
        <p>W tym trybie możesz wykorzystać zdobyte pytania i zmierzyć się z przeciwnikami</p>
        <router-link tag="button" class="btn" to="/multi">Graj!</router-link>
      </article>
    </section>
  </div>
</template>

<script>
import Logout from "@/components/Logout/Logout";
import NavBar from "@/components/NavBar/NavBar";
import axios from "axios";
import firebase from "firebase";
const URL = "http://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  name: "home",
  components: {
    Logout,
    NavBar
  },
  data() {
    return { user: {} };
  },
  mounted() {
    console.log("mounted");
    let currentUser = firebase.auth().currentUser;
    console.log(currentUser.uid);
    console.log({ uid: currentUser.uid });
    axios.post(`${URL}/get-user-by-uid`, `uid=${currentUser.uid}`).then(
      data => {
        this.user = data.data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
};
</script>
<style lang="scss" scoped>
.homeWrapper {
  &::after {
    content: "";
    width: 100%;
    height: 30vh;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #f5f5f5;
    z-index: -999;
  }
}
.modes {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  width: 70vw;
  position: absolute;
  bottom: 15vh;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}
.column {
  flex: 1;
  margin: 0 2.3vw;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  position: relative;
  img {
    height: 100px;
    position: absolute;
    top: -99px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    z-index: -99;
  }
  h2 {
    font-size: 3rem;
  }
}
.column--primary {
  background: #09bc8a;
}
.column--dark {
  background: #045740;
}
</style>
