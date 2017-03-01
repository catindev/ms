(function($) {
    $("#login").on('click', login);

    $('#login-data input').keypress(function (event) {
        if (e.which == 13) {
            login(event);
            return false;
        }
    });

    function login(event) {
        const login = $(`#login-data input[name=login]`).val();
        const password = $(`#login-data input[name=password]`).val();

        $.post('/login', { login, password })
            .done( data => data.session && location.reload() )
            .fail( error => alert(error.responseJSON.message) );
    }
})(jQuery);
