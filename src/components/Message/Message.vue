<template>
  <div class="messageWrapper">
    <transition name="slide">
      <p v-if="type==='error' && content" class="message--error">{{content}}</p>
      <p v-if="type==='success' && content" class="message--success">{{content}}</p>
    </transition>
  </div>
</template>
<script>
export default {
  name: "Message",
  props: ["messageType", "messageContent"],
  data() {
    return {
      type: this.messageType,
      content: this.messageContent
    };
  }
};
</script>