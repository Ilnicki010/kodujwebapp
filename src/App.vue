<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
body {
  margin: 0;
  color: #444;
  font-family: "Quicksand", sans-serif;
}
.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 100;
}
a {
  text-decoration: none;
  color: #fff;
  transition: opacity 0.2s ease-in;
  &:hover {
    opacity: 0.7;
  }
}
.btn {
  width: 85%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 1.3rem;
  background: #045740;
  color: #fff;
  margin-top: 2%;
  cursor: pointer;
}
.btn--primary {
  background: #09bc8a;
}
.message--error {
  position: absolute;
  top: 10px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: 25vw;
  text-align: center;
  padding: 20px;
  font-size: 0.8rem;
  opacity: 0.8;
  background: #bc093b;
  color: #fff;
  z-index: 999;
}
</style>
