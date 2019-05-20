<template>
  <div class="battleProgressWrapper">
    <ChooseQuestions v-if="step==='chooseQuestions'" :userData="user" :battleData="battle"/>
    <Results v-if="step==='results' && battle && user" :userData="user" :battleData="battle"/>
    <section class="wait" v-if="wait">
      <h2>Poczekaj na ruch przeciwnika!</h2>
      <router-link tag="button" class="btn btn--ghost" to="/multi">Wróć</router-link>
    </section>
    <section class="gameWrapper" v-if="!wait && step==='answer'">
      <h2 class="question__text">{{question.question}}</h2>
      <article class="answers">
        <button
          id="answerButton"
          v-for="answer in question.answers"
          :key="question.answers.indexOf(answer)"
          @click="handleAnswer(question.answers.indexOf(answer))"
        >{{answer}}</button>
      </article>
      <transition name="slide">
        <div v-if="correct===1" class="results results--success">
          <p>Gratulacje prawidłowa odpowiedź!</p>
        </div>
        <div v-if="correct===0" class="results results--wrong">
          <p>Ups... prawidłowa odpowiedź to: {{correctAnswer}}</p>
        </div>
      </transition>
    </section>
  </div>
</template>
<script>
import ChooseQuestions from "@/components/ChooseQuestions/ChooseQuestions";
import Results from "@/components/Results/Results";
import axios from "axios";
const URL = "http://us-central1-hidden-analyzer-237719.cloudfunctions.net";
let i = 0;
export default {
  name: "BattleProgress",
  props: ["battleData", "userData"],
  components: {
    ChooseQuestions,
    Results
  },
  data() {
    return {
      battle: this.battleData,
      user: this.userData,
      wait: null,
      loading: false,
      correct: null,
      step: "answer",
      correctAnswer: null,
      question: {}
    };
  },
  methods: {
    whoWon() {},
    isSender() {
      return this.battle.battle.sender.uid === this.user.uid ? true : false;
    },
    handleAnswer(answer) {
      document.querySelectorAll("#answerButton").forEach(btn => {
        btn.disabled = true;
      });
      if (this.question.correct === answer) {
        this.correct = 1;
      } else {
        this.correct = 0;
        this.getCorrectAnswer();

        // this.getCorrectAnswer();
      }
      if (this.isSender()) {
        axios
          .post(
            `${URL}/update-battle`,
            `sender_results=${this.correct}&id=${this.battle._id}`
          )
          .then(data => console.log(data));
      } else {
        axios.post(
          `${URL}/update-battle`,
          `reciver_results=${this.correct}&id=${this.battle._id}`
        );
      }

      if (i < 4) {
        i++;
        setTimeout(() => {
          if (this.isSender()) {
            this.getQuestion(this.battle.battle.reciver.questions[i]);
          } else {
            this.getQuestion(this.battle.battle.sender.questions[i]);
          }
        }, 2000);
      } else {
        if (!this.isSender()) {
          this.step = "chooseQuestions";
        } else {
          this.step = "results";
          location.reload();
        }
      }
    },
    getQuestion(questionID) {
      console.log("GET QUESTION");

      document.querySelectorAll("#answerButton").forEach(btn => {
        btn.disabled = false;
      });
      this.loading = true;
      this.correct = null;
      axios.post(`${URL}/get-question-by-id`, `id=${questionID}`).then(data => {
        if (data.data) {
          console.log(data.data);
          this.loading = false;
          this.question = data.data;
        }
      });
    },
    getCorrectAnswer() {
      switch (this.question.correct) {
        case 0:
          this.correctAnswer = "A";
          break;
        case 1:
          this.correctAnswer = "B";
          break;
        case 2:
          this.correctAnswer = "C";
          break;
        case 3:
          this.correctAnswer = "D";
          break;
      }
    }
  },
  mounted() {
    if (this.isSender()) {
      if (this.battle.battle.reciver.questions.length === 0) {
        this.wait = true;
      } else if (this.battle.battle.reciver.questions.length > 0) {
        this.getQuestion(this.battle.battle.reciver.questions[0]);
      }
    } else {
      if (
        this.battle.battle.sender.results.length === 0 &&
        this.battle.battle.reciver.questions.length > 0
      ) {
        this.wait = true;
      } else if (this.battle.battle.sender.questions.length > 0) {
        this.getQuestion(this.battle.battle.sender.questions[0]);
      }
    }
    if (
      this.battle.battle.reciver.questions.length === 5 &&
      this.battle.battle.sender.questions.length === 5 &&
      this.battle.battle.reciver.results.length === 5 &&
      this.battle.battle.sender.results.length === 5
    ) {
      console.log("RESULTS");
      this.step = "results";
    } else {
      console.log("ELSE");
    }
  }
};
</script>
<style lang="scss" scoped>
.gameWrapper {
  text-align: center;
  margin: 10vh auto;
}
.question__text {
  font-size: 2rem;
  width: 80%;
  margin: 5vh auto;
  padding: 5px 40px;
}
.wait {
  h2 {
    margin: 0;
    padding: 30px;
  }
  width: 100vw;
  height: 90vh;
  text-align: center;
  font-size: 30px;
  color: #444;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23045740' fill-opacity='0.03'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.btn--ghost {
  background: none;
  border: #09bc8a 1px solid;
  color: #09bc8a;
  height: auto;
  border-radius: 60px;
  width: 30vw;
  font-size: 0.5em;
}
.answers {
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding: 5vw;
  button {
    flex: 1;
    height: 20vh;
    margin: 10px;
    border: 2px solid transparent;
    background: #09bc8a;
    color: #fff;
    border-radius: 5px;
    font-size: 160%;
    position: relative;
    z-index: 99;
    font-weight: 200;
    cursor: pointer;
    &:focus {
      outline: none;
      border: 2px solid #045740;
    }
    &:nth-child(1) {
      &::after {
        content: "A";
        position: absolute;
        font-size: 5rem;
        left: 5%;
        bottom: 0;
        opacity: 0.2;
        font-weight: 300;
        color: #045740;
        z-index: -99;
      }
    }
    &:nth-child(2) {
      &::after {
        content: "B";
        position: absolute;
        font-size: 5rem;
        left: 5%;
        bottom: 0;
        opacity: 0.2;
        font-weight: 300;
        color: #045740;
        z-index: -99;
      }
    }
    &:nth-child(3) {
      &::after {
        content: "C";
        position: absolute;
        font-size: 5rem;
        left: 5%;
        bottom: 0;
        opacity: 0.2;
        font-weight: 300;
        color: #045740;
        z-index: -99;
      }
    }
    &:nth-child(4) {
      &::after {
        content: "D";
        position: absolute;
        font-size: 5rem;
        left: 5%;
        bottom: 0;
        opacity: 0.2;
        font-weight: 300;
        color: #045740;
        z-index: -99;
      }
    }
  }
}
.results {
  width: 70%;
  margin: auto;
  padding: 10px;
  color: #fff;
  font-size: 18px;
}
.results--wrong {
  background: #bc093b;
}
.results--success {
  background: #09bc8a;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(100vh);
}
</style>
