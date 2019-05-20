<template>
  <div class="joinWrapper">
    <Loader v-if="loading"/>
    <transition name="slide">
      <p v-if="message" class="message--error">{{message}}</p>
    </transition>
    <section class="leftWrapper">
      <h2>Masz juz konto?</h2>
      <div class="formSignIn">
        <input v-model="user.signIn.email" type="email" for="email" placeholder="email">
        <input v-model="user.signIn.password" type="password" for="password" placeholder="hasło">
        <button
          @click="logInUser(user.signIn.email,user.signIn.password)"
          class="button--primary"
        >Zaloguj się</button>
      </div>
      <img :src="character" alt="charcter" class="ilustration">
    </section>
    <section class="rightWrapper">
      <h2>Dołącz</h2>
      <div class="formSignUp">
        <input v-model="user.signUp.nick" type="text" for="nick" placeholder="nick">
        <input v-model="user.signUp.email" type="email" for="email" placeholder="email">
        <input v-model="user.signUp.password" type="password" for="password" placeholder="hasło">
        <button @submit.prevent @click="registerUser" class="button--white">Dołącz</button>
      </div>
    </section>
  </div>
</template>
<script>
import Loader from "@/components/Loader/Loader";
import firebase from "firebase";
import axios from "axios";
const URL = "https://us-central1-hidden-analyzer-237719.cloudfunctions.net";
import character from "../assets/character.svg";
import errorCharacter from "../assets/loading_character.svg";
export default {
  name: "Join",
  components: {
    Loader
  },
  watch: {
    message: function(val) {
      if (val) {
        this.character = errorCharacter;
      } else {
        this.character = character;
      }
    }
  },
  data() {
    return {
      character: character,
      loading: false,
      message: "",
      user: {
        signUp: {
          nick: "",
          email: "",
          password: ""
        },
        signIn: {
          email: "",
          password: ""
        }
      }
    };
  },
  methods: {
    logInUser(email, password) {
      this.loading = true;
      console.log(email);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
          this.loading = false;
          this.$router.replace("home");
        })
        .catch(error => {
          this.loading = false;
          this.message = error.message;
        });
    },
    registerUser() {
      if (this.user.signUp) {
        this.loading = true;
        axios
          .post(`${URL}/get-user-by-nick`, `nick=${this.user.signUp.nick}`)
          .then(results => {
            if (!results.data) {
              firebase
                .auth()
                .createUserWithEmailAndPassword(
                  this.user.signUp.email,
                  this.user.signUp.password
                )
                .then(user => {
                  console.log(user);
                  user = firebase.auth().currentUser;
                  if (user) {
                    axios
                      .post(
                        `${URL}/get-user-by-nick`,
                        `nick=${this.user.signUp.nick}`
                      )
                      .then(results => {
                        user
                          .updateProfile({
                            displayName: this.user.signUp.nick
                          })
                          .then(s => {
                            console.log(user.email);
                            console.log(user.uid);
                            console.log(user.displayName);
                            axios
                              .post(`${URL}/create-user`, {
                                user: {
                                  uid: user.uid,
                                  email: user.email,
                                  nick: user.displayName
                                }
                              })
                              .then(data => {
                                console.log("data");
                                this.loading = false;
                                this.logInUser(
                                  this.user.signUp.email,
                                  this.user.signUp.password
                                );
                              });
                          });
                      });
                  }
                })
                .catch(error => {
                  // Handle Errors here.
                  console.log(error.message);
                  this.loading = false;
                  this.message = error.message;
                  // ...
                });
            } else {
              this.loading = false;
              this.message = "Nick jest juz zajęty!";
            }
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
input {
  border: 0;
  font-size: 0.8rem;
  font-weight: 100;
  padding: 10px;
  margin-bottom: 20px;
  background: none;
  width: 50%;
  transition: border 0.3s ease-in;
}
button {
  color: #fff;
  border: 0;
  cursor: pointer;
  border-radius: 20px;
  height: 30px;
  width: 200px;
}
::placeholder {
  opacity: 0.5;
}
.joinWrapper {
  width: 100vw;
  display: flex;
  flex-direction: row;
  position: relative;
}
.rightWrapper,
.leftWrapper {
  flex: 1;
  height: 100vh;
  text-align: center;
}
.leftWrapper,
.rightWrapper {
  position: relative;
  h2 {
    display: flex;
    flex-direction: column;
    font-size: 2.5rem;
  }
  h2::before,
  h2::after {
    content: "Masz juz konto?";
    opacity: 0.2;
    font-size: 1.7rem;
  }
}
.rightWrapper {
  background: #09bc8a;
}
.formSignIn,
.formSignUp {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15vh;
  input {
    &:focus {
      outline: none;
      border-bottom-color: #058e68;
    }
  }
}
.formSignIn {
  input {
    border-bottom: 1.4px solid #09bc8a;
  }
}
.formSignUp {
  input {
    border-bottom: 1.4px solid #fff;
    color: #ffff;
    &::placeholder {
      color: #fff;
    }
  }
}
.button--primary {
  background: #09bc8a;
}
.button--white {
  background: #fff;
  color: #09bc8a;
}
.ilustration {
  height: 140px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10vh);
}
</style>
