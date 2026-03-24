<template>
    <footer class="footer">
        <section class="footer-info">
            <div class="logo-footer">
                <img src="../assets/logo/temporaryLogo.png" class="img_logo" alt="Logo PPE Manager">
            </div>
            <div class="msg-div">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s text ever since the 1500s</p>
            </div>
            <div class="right-div">
                <p>• Politica de Privacidade</p>
            </div>
        </section>
        <div  class="footer-rights">
            <p>&copy; 2026 PPE Manager. All rights reserved.</p>
        </div>
    </footer>
</template>

<style>

.footer{
    background-color: #f0f2f5;
}
    
.footer-info{
    display: flex;
    height: auto;
    justify-content: space-between;
    align-items:center;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 31px #00000015;
    border-radius: 50px 50px 0 0;
    padding: 50px;
    gap: 20px;
}

.msg-div{
    width: auto;
}

.footer-rights{
    display: flex;
    width: 100%;
    bottom: 0;
    height: 40px;
    text-align: center;
    justify-content: center;
    align-items:center;
    background-color: #2B4A69;
    color: white;
}

</style>