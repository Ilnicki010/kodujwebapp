<template>
  <div class="packWrapper">
    <NavBar v-if="user" :userNick="user.nick"/>
    <Loader v-if="loading"/>
    <div class="pack">
      <section>
        <h2>Twój ekwipunek pytań</h2>
        <h4>
          Pytania te mozesz rzucac przeciwnikom podczas rozgrywek w trybie multiplayer.
          <br>Zdobywa ich coraz więcej doskonaląc swoją wiedzę o Unii Europejskiej i Polsce 😃
        </h4>
        <div class="questions">
          <article class="question" v-for="question in userQuestions">{{question.question}}</article>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import firebase from "firebase";
import NavBar from "@/components/NavBar/NavBar";
import Loader from "@/components/Loader/Loader";
const URL = "https://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  data() {
    return {
      loading: false,
      user: {},
      userQuestions: []
    };
  },
  components: {
    NavBar,
    Loader
  },
  methods: {
    getQuestionsName() {
      this.loading = false;
      this.user.pack.map(questionID => {
        axios
          .post(`${URL}/get-question-by-id`, `id=${questionID}`)
          .then(data => {
            console.log(data.data);
            if (data.data) {
              this.loading = false;
              this.userQuestions.push(data.data);
            } else {
              this.loading = false;
            }
          });
      });
    }
  },
  mounted() {
    this.loading = true;
    let currentUser = firebase.auth().currentUser;
    axios
      .post(`${URL}/get-user-by-uid`, { uid: currentUser.uid })
      .then(data => {
        console.log(data.data);
        if (data) {
          this.loading = false;
          this.user = data.data;
          this.getQuestionsName();
        }
      });
  }
};
</script>
<style lang="scss" scoped>
.pack {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  padding: 30px;
}
.questions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  flex: 1;
  flex-wrap: wrap;
}
.question {
  background: #09bc8a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #fff;
  margin: 10px;
  border-radius: 5px;
  flex: 1;
  min-width: 20vw;
  height: 15vh;
}
</style>
