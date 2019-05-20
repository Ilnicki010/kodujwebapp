<template>
  <div class="multiWrapper">
    <NavBar :userNick="this.user.nick"/>
    <div class="fixedWrapper" v-if="user.pack.length>=5">
      <BattlesPanel v-if="this.user.uid" :userUID="this.user.uid"/>
      <div class="newGame">
        <h2>Nowa Bitwa</h2>
        <div class="info">
          <h2>{{number}}</h2>
          <input v-model="userToFightNick" type="text" placeholder="nick użytkownika">
        </div>
        <div class="questions">
          <div
            @click="addQuestionToSend(pack._id)"
            v-for="pack in this.userQuestions"
            :key="pack._id"
            :id="pack._id"
          >{{pack.question}}</div>
        </div>

        <button class="btn" @click="createBattle">Rzuć wyzwanie!</button>
      </div>
    </div>
    <div v-else class="else">
      <h2>Musisz posiadać minimum 5 pytań żeby zacząć gre multiplayer</h2>
      <h4>ćwicz w trybie single i wróć tutaj później 🚀</h4>
      <router-link tag="button" class="btn btn--ghost" to="/single">Graj!</router-link>
    </div>
  </div>
</template>
<script>
const URL = "http://us-central1-hidden-analyzer-237719.cloudfunctions.net";
import firebase from "firebase";
import axios from "axios";
import NavBar from "@/components/NavBar/NavBar";
import BattlesPanel from "@/components/BattlesPanel/BattlesPanel";
export default {
  name: "Multi",
  components: { NavBar, BattlesPanel },
  data() {
    return {
      userToFightNick: "",
      user: {},
      userQuestions: [],
      questionsToSend: [],
      isClicked: false,
      number: 5,
      battleObject: {
        sender: {
          uid: null,
          questions: [],
          results: [],
          score: null
        },
        reciver: {
          uid: null,
          questions: [],
          results: [],
          score: null
        }
      }
    };
  },
  watch: {
    battleObject: function() {
      this.createBattle();
    }
  },
  methods: {
    getUserToFight(callback) {
      axios
        .post(`${URL}/get-user-by-nick`, `nick=${this.userToFightNick}`)
        .then(data => {
          console.log(data.data);
          if (data) {
            this.loading = false;
            let reciver = data.data;
            callback(reciver);
          }
        });
    },
    createBattle() {
      this.getUserToFight(reciver => {
        console.log(this.battleObject.sender);
        let params = {
          sender_uid: this.user.uid,
          sender_nick: this.user.nick,
          sender_questions: this.questionsToSend,
          reciver_uid: reciver.uid,
          reciver_nick: reciver.nick
        };

        axios({
          method: "post",
          url: `${URL}/create-battle`,
          params
        })
          .then(data => {
            location.reload();
          })
          .catch(error => {
            console.log(error.response);
          });
      });
    },
    addQuestionToSend(questionID) {
      if (this.questionsToSend.length < 5) {
        document.getElementById(questionID).style.backgroundColor = "#045740";
        this.number--;
        this.questionsToSend.indexOf(questionID) === -1
          ? this.questionsToSend.push(questionID)
          : console.log("This item already exists");
      }
    },
    getQuestionsName() {
      this.user.pack.forEach(questionID => {
        axios
          .post(`${URL}/get-question-by-id`, `id=${questionID}`)
          .then(data => {
            console.log(data.data);
            if (data) {
              this.loading = false;
              this.userQuestions.push(data.data);
            }
          });
      });
    }
  },
  mounted() {
    let currentUser = firebase.auth().currentUser;
    axios
      .post(`${URL}/get-user-by-uid`, `uid=${currentUser.uid}`)
      .then(data => {
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
.fixedWrapper {
  z-index: 999;
}
.newGame {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  input {
    padding: 10px;
    border-radius: 40px;
    border: 1px solid #09bc8a;
    width: 20vw;
    transition: border 0.2s ease-in;
    &:focus {
      outline: none;
      border: 1px solid #056147;
    }
  }
  h2 {
    font-size: 50px;
  }
}
.questions {
  display: flex;
  width: 90vw;
  margin-top: 3vh;
  flex-wrap: wrap;
  flex-direction: row;
  div {
    flex: 1 0;
    background: #09bc8a;
    margin: 10px;
    height: auto;
    padding: 15px;
    cursor: pointer;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.btn {
  max-width: 25vw;
  flex: 1;
  height: 20px;
  border-radius: 60px;
  font-size: 1em;
  margin-bottom: 10vh;
}
.else {
  text-align: center;
  margin-top: 16vh;
}
.btn--ghost {
  background: none;
  border: #09bc8a 1px solid;
  color: #09bc8a;
  height: auto;
}
.info {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  h2 {
    font-size: 30px;
    color: #09bc8a;
  }
  * {
    margin: 0 10px;
  }
}
</style>
