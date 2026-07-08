document.addEventListener("DOMContentLoaded", () => {

    fetch("components/navbar.html")
        .then(response => response.text())
        .then(data => {

            document.getElementById("navbar").innerHTML = data;

            highlightCurrentPage();

            mobileMenu();

        });

});

function highlightCurrentPage(){

    const page = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".nav-link,.mobile-nav-link");

    links.forEach(link=>{

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if(page==="" && href==="index.html"){

            link.classList.add("active");

        }

        else if(href===page){

            link.classList.add("active");

        }

    });

}

function mobileMenu(){

    const btn=document.querySelector(".mobile-menu-toggle");

    const menu=document.querySelector(".mobile-nav-menu");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        menu.classList.toggle("open");

    });

}