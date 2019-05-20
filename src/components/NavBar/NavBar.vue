<template>
  <nav class="navWrapper">
    <span class="el">Cześć, {{userNick}}!</span>
    <div class="el el--linksWrapper">
      <router-link to="/home">Home</router-link>
      <router-link to="/single">Single</router-link>
      <router-link to="/pack">Plecak</router-link>
      <router-link to="/multi">Multi</router-link>
    </div>
    <Logout class="el"/>
  </nav>
</template>
<script>
import Logout from "@/components/Logout/Logout";
export default {
  name: "NavBar",
  components: { Logout },
  props: ["userNick"]
};
</script>
<style lang="scss" scoped>
.navWrapper {
  background: #09bc8a;
  width: 100%;
  color: #fff;
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .el {
    flex: 1;
    &:first-child {
      margin-left: 40px;
    }
  }
  .el--linksWrapper {
    flex: 3;
    display: flex;
    align-items: flex-end;
    text-align: center;
    * {
      flex: 1;
      opacity: 0.7;
    }
  }
}
button {
  background: none;
  border: 1px solid transparent;
  color: #045740;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border 0.4s ease-in;
  opacity: 0.4;
  &:hover {
    border-bottom: 1px solid #045740;
  }
}
</style>
