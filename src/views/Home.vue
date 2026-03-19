<!-- Landing Page - primeira página ao acessar nosso site -->
<script>
    import HeaderTemplate from '../components/Header.vue'
    import FooterTemplate from '../components/Footer.vue'

    export default{
        components:{
            HeaderTemplate,
            FooterTemplate
        }
    }
</script>

<template>
    <!-- Header importada dos components -->
    <HeaderTemplate />

    <div class="body">

        <!-- Section "Home" - aqui é a parte do Miguel, coloquei essa section para, ao clicar em "Home", a tela scrollar pra cima -->
        <section id="home" class="nav_home">
                <img src = "../assets/banner/Banner_Image.png" class = "bnr_img" alt = "Home Banner"/>
                    <div class = "bnr_desc">
                        <div class = "bnr_esq">
                            <div class = "titulo_inf">
                                <p>Equipamento de Proteção Individual</p>
                            </div>
                            <h1 class = "texto_esq_bnr">Faça o Gerenciamento do Seu Estoque de EPIs</h1>
                        </div>
                        <div class = "bnr_dir">
                            <p class = "texto_dir_bnr">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s text ever since the 1500s</p>
                            <router-link class = "acc_ent" to="/login">
                                Acesse sua conta
                            </router-link>
                        </div>
                    </div>
        </section>

        <!-- Section "Our Services" -->
        <section id="services" class="nav_services">
            <h1>Our Services</h1>
        </section>

        <!-- Section "Contact" -->
        <section id="contact" class="nav_contact">
            <h1>Contact</h1>
        </section>

        <FooterTemplate />
    </div>
</template>

<style>
.nav_home{
    padding: 0;
}

/* temporario apenas pra teste visual */
section {
    height: 100vh;
    padding: 20px;
}

.bnr_img{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    width: 100%;
}

.bnr_desc{
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    height: 250px;
    width: 80%;
    background-color: #ffffff;
    border-radius: 30px;
    bottom: 61%;
    margin: auto;
}

.bnr_esq{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: large;
    gap: 5px;
    width: 50%;
    
}
.bnr_dir{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
}

.titulo_inf{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #E8BB7387;
        border-radius: 10px;
        color: #F39C12;
        width: 400px;
        margin-top: 15px;
}
.texto_esq_bnr{
    font-family: var(--font-primary);
    text-align: center;
    width: 70%;

}
.texto_dir_bnr{
    font-family: var(--font-secondary);
    text-align: center;
    width: 50%;
}
.acc_ent{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2B4A69 ;
    color: white;
    text-decoration: none;
    border-radius: 90px;
    height: 50px;
    width: 250px;
}
</style>