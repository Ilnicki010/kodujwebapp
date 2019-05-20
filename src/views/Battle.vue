<template>
  <div class="singleWrapper">
    <NavBar :userNick="user.nick"/>
    <section class="gameWrapper">
      <BattleProgress v-if="user && battle" :battleData="battle" :userData="user"/>
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar/NavBar";
import Loader from "@/components/Loader/Loader";
import BattleProgress from "@/components/BattleProgress/BattleProgress";
import axios from "axios";
import firebase from "firebase";
const URL = "https://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  name: "Battle",
  components: {
    NavBar,
    Loader,
    BattleProgress
  },
  data() {
    return {
      user: null,
      battle: null
    };
  },
  props: ["battleID"],
  methods: {
    isSenderOrReciver() {
      if (this.user.uid === this.battle.sender.uid) {
        console.log("sender");
      } else {
        console.log("reciver");
      }
    }
  },
  created() {
    axios.post(`${URL}/get-battle-by-id`, `id=${this.battleID}`).then(data => {
      console.log(data.data);
      this.battle = data.data;
    });
    let currentUser = firebase.auth().currentUser;
    console.log(currentUser.uid);
    console.log({ uid: currentUser.uid });
    axios.post(`${URL}/get-user-by-uid`, `uid=${currentUser.uid}`).then(
      data => {
        this.user = data.data;
        console.log("-----------------");
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
};
</script>