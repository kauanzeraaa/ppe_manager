<script></script>

<template>
    <button class="button" href="#">
        <span class="icon">
            <img class="image" src="../assets/icons_actions/question.png" alt="Question Icon">
        </span>
    </button>
</template>

<style scoped>
    .button {
        position: fixed;
        background-color: var(--color-blue-dark);
        bottom: 20px;
        right: 40px;
        height: 50px;
        width: 50px;
        border-radius: 15px;
        border: none;
        cursor: pointer;
    }

    .icon {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image {
        width: 35px;
        height: 35px;
    }
</style>