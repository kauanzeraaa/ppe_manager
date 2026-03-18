<!-- Landing Page - primeira página ao acessar nosso site -->
<script>
    import HeaderTemplate from '../components/Header.vue'

    export default{
        components:{
            HeaderTemplate
        }
    }
</script>

<template>
    <!-- Header importada dos components -->
    <HeaderTemplate />

    <div class="body">

        <!-- Section "Home" - aqui é a parte do Miguel, coloquei essa section para, ao clicar em "Home", a tela scollar pra cima -->
        <section id="home" class="nav_home">
            <h1>Welcome to the Home screen!</h1>
        </section>

        <!-- Section "Our Services" -->
        <section id="services" class="nav_services">
            <h1>Our Services</h1>
        </section>

        <!-- Section "Contact" -->
        <section id="contact" class="nav_contact">
            <h1>Contact</h1>
        </section>
    </div>
</template>

<style>

/* temporario apenas pra teste visual */
section {
    height: 100vh;
    padding: 20px;
}
</style>