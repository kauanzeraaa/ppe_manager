<template>
    <footer class="footer">
        <section class="footer-info">
            <div class="logo-footer">
                <img src="../assets/logo/temporaryLogo.png" class="img_logo" alt="Logo PPE Manager">
            </div>
            <div class="msg-div">
                <p>PPE Manager é a solução inteligente para gerenciamento de equipamentos de proteção individual. Rastreie, monitore e otimize seu estoque de EPIs com facilidade, garantindo a segurança de seus colaboradores.</p>
            </div>
            <div class="right-div">
                <p>• Política de Privacidade</p>
                <p>• Termos de Serviço</p>
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
    background-color: #ffffff;
    box-shadow: 0px 0px 31px #00000015;
    border-radius: 50px 50px 0 0;
    padding: 50px;
    gap: 10px;
}

.msg-div{
    width: 90%;
    text-align: center;
}

.right-div {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-bottom: -20px;
}

.footer-rights{
    display: flex;
    width: 100%;
    bottom: 0;
    justify-content: center;
    align-items:center;
    background-color: #2B4A69;
    color: white;
}

@media (max-width: 768px) {
    .footer-info {
        flex-direction: column;
        text-align: center;
    }

    .msg-div {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .footer-info {
        padding: 16px;
        gap: 12px;
    }

    .logo-footer .img_logo {
        max-width: 80px;
    }

    .msg-div {
        width: 100%;
    }

    .msg-div p {
        font-size: 0.75rem;
        line-height: 1.4;
        margin: 0;
    }

    .right-div p {
        font-size: 0.7rem;
        margin: 2px 0;
        margin-bottom: 20px;
    }

    .footer-rights {
        height: 35px;
    }

    .footer-rights p {
        font-size: 0.7rem;
        margin: 0;
    }
}

</style>