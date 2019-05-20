<template>
  <div class="singleWrapper">
    <NavBar :userNick="user.nick"/>
    <Loader v-if="loading"/>
    <section v-if="start && question" class="gameWrapper">
      <img src="../assets/thinking_char.svg" alt="thinking character icon" height="100px">
      <h2>{{question[0].question}}</h2>
      <article class="answers">
        <button
          id="answerButton"
          v-for="answer in question[0].answers"
          :key="question[0].answers.indexOf(answer)"
          @click="handleAnswer(question[0].answers.indexOf(answer))"
        >{{answer}}</button>
      </article>
      <transition name="slide">
        <div v-if="correct" class="results results--success">
          <p>Gratulacje prawidłowa odpowiedź! To pytanie trafia do twojego arsenału!</p>
        </div>
        <div v-if="correct==false" class="results results--wrong">
          <p>Ups... prawidłowa odpowiedź to: {{correctAnswer}}</p>
        </div>
      </transition>
    </section>

    <!-- <div v-if="!start" class="modalInfo">
      <h1>Instrukcja</h1>
      <p>Jakis tekst ktory wjasnia jak gra bedzie przebiagac o co chodzi itp. user klika start i wtedy zczynamy</p>
      <button @click="start=true" class="btn">START</button>
    </div>-->
  </div>
</template>
<script>
import NavBar from "@/components/NavBar/NavBar";
import Loader from "@/components/Loader/Loader";
import axios from "axios";
import firebase from "firebase";
import { setTimeout, clearInterval } from "timers";
const URL = "https://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  name: "Single",
  components: {
    NavBar,
    Loader
  },
  data() {
    return {
      user: {},
      question: [],
      correctAnswer: "",
      start: true,
      correct: null,
      loading: false
    };
  },
  methods: {
    handleAnswer(answer) {
      document.querySelectorAll("#answerButton").forEach(btn => {
        btn.disabled = true;
      });

      if (this.question[0].correct === answer) {
        this.correct = true;
        console.log(this.user.pack);
        console.log(this.question[0]._id);

        let find = this.user.pack.includes(this.question[0]._id);
        console.log(find);

        if (!find) {
          axios.post(
            `${URL}/update-user`,
            `uid=${this.user.uid}&pack=${this.question[0]._id}`
          );
        } else {
          console.log("dont do this");
        }
      } else {
        this.correct = false;
        this.getCorrectAnswer();
      }
      setTimeout(() => {
        this.getQuestion();
      }, 3000);
    },
    getQuestion() {
      document.querySelectorAll("#answerButton").forEach(btn => {
        btn.disabled = false;
      });
      this.loading = true;
      this.correct = null;
      axios.get(`${URL}/get-random-question`).then(data => {
        if (data.data) {
          console.log(data.data);
          this.loading = false;
          this.question = data.data;
        }
      });
    },
    getCorrectAnswer() {
      switch (this.question[0].correct) {
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
    this.loading = true;
    let currentUser = firebase.auth().currentUser;
    axios
      .post(`${URL}/get-user-by-uid`, { uid: currentUser.uid })
      .then(data => {
        console.log(data.data);
        if (data) {
          this.loading = false;
          this.user = data.data;
        }
      });
    this.getQuestion();
  }
};
</script>
<style lang="scss" scoped>
.modalInfo {
  padding: 2%;
  background: #09bc8a;
  color: #fff;
  margin: 20vh 20vw;
  text-align: center;
  border-radius: 5px;
}
.gameWrapper {
  margin: 10vh auto;
  text-align: center;
  h2 {
    font-size: 2rem;
    width: 80%;
    margin: 5vh auto;
    padding: 5px 40px;
  }
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
  transform: translateY(10vh);
}
</style>
