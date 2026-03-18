<!-- Component Header utilizado na tela Home para navegação -->
<template>
    <header class="header">
        <div class="logo_header">
            <img src="../assets/logo/temporaryLogo.png" class="img_logo" alt="Logo EPI Track">
        </div>
        <nav class="navigation_header">
            <a href="#home">Home</a>
            <a href="#services">Our Services</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
</template>

<style>

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  justify-content: space-between;
  box-shadow: 1px 1px 4px #000000;

  font-family: "poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: #FFFFFF;
  border-radius: 63px;

}

.img_logo {
  width: 210px;
}

.navigation_header a {
    margin: 0 15px;
    text-decoration: none;
    color: #333;
}
</style>