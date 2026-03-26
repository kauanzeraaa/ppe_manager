<script>

</script>

<template>
    <section class="buttons">
        <button class="button-notification">
            <span class="icon">
                <img src="../assets/icons_actions/bell.png" alt="Notification Icon">
            </span>
        </button>
        <button class="button-configuration">
            <span class="icon">
                <img src="../assets/icons_actions/settings.png" alt="Settings Icon">
            </span>
        </button>
        <button class="button-exit">
            <span class="icon">
                <img src="../assets/icons_actions/exit-alt.png" alt="Exit Icon">
            </span>
        </button>
    </section>
</template>

<style scoped>
    .buttons {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 15px;
        z-index: 100;
    }

    .button-notification, .button-configuration, .button-exit {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 15px;
    }

    .button-notification {
        background-color: var(--color-orange);
    }

    .button-configuration {
        background-color: var(--color-blue);
    }

    .button-exit {
        background-color: var(--color-blue-dark);
    }

    .icon img {
        width: 30px;
        height: 30px;
    }


    
</style>