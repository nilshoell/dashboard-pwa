console.log("index.js linked");

$(function () {
    console.log("Document Ready");

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

    window.addEventListener("orientationchange", function() {
        switch (screen.orientation.angle) {
            case 0:
                console.log("Switched to portrait mode");
                break;
            case 90:
                console.log("Switched to landscape mode");
                break;
            default:
                console.log("Switched to undefined orientation", screen.orientation.angle);
                break;
        }
    });

    const app:App = new App();

});

class App {
    constructor() {
        // console.log("App Object Initialised");
    }
}