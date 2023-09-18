$('.link-dark').click(function () {
    const category = $(this).data('category');
    $('.learn-subtitle').text(category.replaceAll('-',' '));
    const title = $(this).data('title');
    $('.learn-title').text(title.replaceAll('-',' '));  
    console.log(`/${category.replaceAll('-','_')}/${title.replaceAll('-','_')}.html`);
    $('.content-container').load(`/learnContent/${category.replaceAll('-','_')}/${title.replaceAll('-','_')}.html`)
})