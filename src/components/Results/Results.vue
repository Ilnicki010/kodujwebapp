<template>
  <div class="resultsWrapper">
    <div class="resutsContent">
      <h2 v-if="winner!=='remis'">Wygrał/a {{winner.nick}}!</h2>
      <h2 v-else>Jest remis!</h2>
      <h4>{{this.battle.battle.sender.nick}} odpowiedział dobrze na {{sender_good}} pytań</h4>
      <h4>{{this.battle.battle.reciver.nick}} odpowiedział dobrze na {{reciver_good}} pytań</h4>
      <section class="resultsPresent">
        <div>
          <h3>{{this.battle.battle.reciver.nick}}</h3>
          <div class="question" v-for="question in questionsForReciver">
            <span>{{question.data.question}}</span>
            <span v-if="question.result==1">✅</span>
            <span v-if="question.result==0">❌</span>
          </div>
        </div>
        <div>
          <h3>{{this.battle.battle.sender.nick}}</h3>
          <div class="question" v-for="question in questionsForSender">
            <span>{{question.data.question}}</span>
            <span v-if="question.result==1">✅</span>
            <span v-if="question.result==0">❌</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const URL = "https://us-central1-hidden-analyzer-237719.cloudfunctions.net";
import NavBar from "@/components/NavBar/NavBar";
let i = 0;
let j = 0;
export default {
  name: "Results",
  props: ["userData", "battleData"],
  data() {
    return {
      user: this.userData,
      battle: this.battleData,
      winner: null,
      reciver_good: null,
      sender_good: null,
      questionsForReciver: [],
      questionsForSender: []
    };
  },
  methods: {
    getWhoWon() {
      let sender = this.battle.battle.sender.results.filter(function(number) {
        return number > 0;
      }).length;
      let reciver = this.battle.battle.reciver.results.filter(function(number) {
        return number > 0;
      }).length;
      this.sender_good = sender;
      this.reciver_good = reciver;
      console.log(sender);
      console.log(reciver);

      if (sender > reciver) {
        return this.battle.battle.sender;
      } else if (sender < reciver) {
        return this.battle.battle.reciver;
      } else {
        return "remis";
      }
    }
  },

  mounted() {
    this.battle.battle.sender.questions.map(el => {
      axios.post(`${URL}/get-question-by-id`, `id=${el}`).then(results => {
        this.questionsForReciver.push({
          data: results.data,
          result: this.battle.battle.reciver.results[i]
        });
        i++;
      });
    });

    this.battle.battle.reciver.questions.map(el => {
      axios.post(`${URL}/get-question-by-id`, `id=${el}`).then(results => {
        this.questionsForSender.push({
          data: results.data,
          result: this.battle.battle.sender.results[j]
        });
        j++;
      });
    });

    this.winner = this.getWhoWon();
  }
};
</script>
<style lang="scss" scoped>
.resutsContent {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
.resultsPresent {
  display: flex;
  flex-direction: row;
  margin: 10px;
  padding: 30px;
  flex-wrap: wrap;
  div {
    flex: 1;
    margin: 0 30px;
  }
  h3 {
    background: #09bc8a;
    color: #fff;
    padding: 10px;
    border-radius: 3px;
  }
}
.question {
  padding: 10px;
  display: flex;
  span {
    flex: 1;
    &:first-child {
      flex: 3;
    }
  }
}
</style>
