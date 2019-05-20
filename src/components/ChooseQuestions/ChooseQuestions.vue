<template>
  <div class="chooseQuestionWrapper">
    <h2>Wybierz 5 pytań dla przeciwnika</h2>
    <div class="questions">
      <div
        @click="addQuestionToSend(pack._id)"
        :id="pack._id"
        v-for="pack in this.userQuestionsNames"
      >{{pack.question}}</div>
    </div>
    <button class="btn" @click="sendQuestions">Rzuć pytania przeciwnikowi!</button>
  </div>
</template>
<script>
import axios from "axios";
const URL = "http://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  props: ["userData", "battleData"],
  data() {
    return {
      user: this.userData,
      userQuestionsNames: [],
      questionsToSend: [],
      battle: this.battleData
    };
  },
  methods: {
    sendQuestions() {
      axios
        .post(
          `${URL}/update-battle`,
          `reciver_questions=${this.questionsToSend}&id=${this.battle._id}`
        )
        .then(data => location.reload());
    },
    addQuestionToSend(questionID) {
      if (this.questionsToSend.length < 5) {
        document.getElementById(questionID).style.backgroundColor = "#045740";
        this.questionsToSend.indexOf(questionID) === -1
          ? this.questionsToSend.push(questionID)
          : console.log("This item already exists");
      }
    },
    getQuestionsName() {
      console.log(this.user.pack);

      this.user.pack.map(questionID => {
        console.log(questionID);

        axios
          .post(`${URL}/get-question-by-id`, `id=${questionID}`)
          .then(data => {
            console.log(data.data);
            if (data) {
              this.loading = false;
              this.userQuestionsNames.push(data.data);
            }
          });
      });
    }
  },
  mounted() {
    this.getQuestionsName();
  }
};
</script>
<style lang="scss" scoped>
.chooseQuestionWrapper {
  margin: auto;
  text-align: center;
}
.questions {
  display: flex;
  width: 90vw;
  margin-top: 3vh;
  flex-wrap: wrap;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  margin: auto;

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
  width: 25vw;
  height: auto;
  border-radius: 60px;
  font-size: 1em;
}
</style>
