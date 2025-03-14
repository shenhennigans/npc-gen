<template>
    <div class="wrapper">
        <h1 class="dm-serif-text-regular">
          <slot name="heading"></slot>
        </h1>
        <slot></slot>
    </div>
</template>
<style scoped>
    .wrapper{
        margin-bottom: 2rem;
    }
</style>