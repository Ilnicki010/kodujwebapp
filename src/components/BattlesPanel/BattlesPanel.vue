<template>
  <div class="battlesWrapper">
    <div class="wrapper" v-for="item in battles">
      <div class="battleBox" v-for="(battle,index) in item">
        <router-link :id="battle" :to="{ name: 'battle', params: {battleID: battle._id } }">
          {{battle.battle.sender.nick}} vs
          {{battle.battle.reciver.nick}}
          <br>
          #{{index}}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const URL = "http://us-central1-hidden-analyzer-237719.cloudfunctions.net";
export default {
  name: "BattlesPanel",
  props: ["userUID"],
  data() {
    return {
      battles: [],
      number: null
    };
  },
  methods: {
    startFight() {}
  },
  mounted() {
    let params = {
      uid: this.userUID
    };
    axios({
      method: "post",
      url: `${URL}/get-battles-by-user-uid`,
      params
    })
      .then(data => {
        this.battles.push(data.data);
      })
      .catch(error => {
        console.log(error.response);
      });
  }
};
</script>
<style lang="scss" scoped>
.battlesWrapper {
  padding: 30px;
  overflow-x: scroll;
}
.wrapper {
  display: flex;
  position: relative;
  width: auto;
  &:last-child {
    &::after {
      content: "| Twoje rozgrywki";
      position: relative;
      margin: auto 10px;
      opacity: 0.3;
      color: #077757;
    }
  }
}
.battleBox {
  background: #09bc8a;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23045740' fill-opacity='0.06'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  padding: 40px;
  width: 50px;
  height: 100px;
  color: #fff;
  margin: 50px 20px;
  text-align: center;
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 7px rgba(9, 188, 138, 0.3);
}
</style>

