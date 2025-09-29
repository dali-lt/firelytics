const menuIcon = document.getElementById('menuIcon');
const navMenuContainer = document.getElementById('navMenuContainer');
const body = document.querySelector('body');

menuIcon.addEventListener('click', function(){
    console.log("Menu icon clicked!");
    navMenuContainer.classList.toggle('active');
    menuIcon.classList.toggle('styleBtn');
    body.classList.toggle('SlidBody');
});

document.addEventListener('click', function(event){
    if(!menuIcon.contains(event.target) && !navMenuContainer.contains(event.target)){
        navMenuContainer.classList.remove('active');
        menuIcon.classList.remove('styleBtn');
        body.classList.remove('SlidBody');
    }
});