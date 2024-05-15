<template>
  <!-- Social Media DIV -->
  <div class="social-media">
    <!-- Email -->
    <button-icon size="sm" icon="mdi-email"
                 href="mailto:dirkmichaelnm@gmail.com" />
    <!-- Discord -->
    <button-icon size="sm" icon="mdi-discord" target="_blank"
                 href="https://discord.gg/nepJ6jZEAr" />
    <!-- LinkedIn -->
    <button-icon size="sm" icon="mdi-linkedin" target="_blank"
                 href="https://www.linkedin.com/in/dirk-michael-7b651636/" />
    <!-- Twitter / X -->
    <button-icon size="sm" icon="mdi-twitter" target="_blank"
                 href="https://www.twitter.com/dmic2501" />
    <!-- Twitch -->
    <button-icon size="sm" icon="mdi-twitch" target="_blank"
                 href="https://twitch.tv/khrenn" />
    <!-- Instagram -->
    <button-icon size="sm" icon="mdi-instagram" target="_blank"
                 href="https://www.instagram.com/dirk_michael_nm" />
  </div>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.social-media {
  color: $light-text;
}

.body--dark .social-media {
  color: $dark-text;
}
</style>

<script setup lang="ts">
import ButtonIcon from 'components/common/ButtonIcon.vue';
</script>
