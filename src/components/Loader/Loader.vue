<template>
  <div class="loaderWrapper">
    <ul>
      <li style="height: 60px;"></li>
      <li style="height: 35px;"></li>
      <li style="height: 50px;"></li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.loaderWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  direction: row;
  align-items: flex-end;
}

ul li {
  vertical-align: bottom;
  list-style: none;
  margin: 0 1px;
  width: 16px;
  background: #08bd8a;
  border-radius: 2px;
  animation: animate 0.6s infinite alternate;
}
@keyframes animate {
  0% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(3);
  }
}
ul li:nth-child(1) {
  animation-delay: 0.1s;
}
ul li:nth-child(2) {
  animation-delay: 0.3s;
}
ul li:nth-child(3) {
  animation-delay: 0.6s;
}
</style>