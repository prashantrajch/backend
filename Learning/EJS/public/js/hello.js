document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('mouseenter', function(){
        this.style.transform = 'translateY(-50px)';
    })
    img.addEventListener('mouseleave', function(){
        this.style.transform = 'translateY(0)';
    })
})