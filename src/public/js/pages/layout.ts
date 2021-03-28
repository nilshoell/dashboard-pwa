$(function () {
    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('.nav-link').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
        $($('li.active > .nav-link')[0].parentElement).removeClass("active");
        $(this.parentElement).addClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});