(function($) {
    $("#login").on('click', login);

    function login(event) {
        const login = $(`#login-data input[name=login]`).val();
        const password = $(`#login-data input[name=password]`).val();

        $.post('/login', { login, password })
            .done( data => data.session && location.reload() )
            .fail( error => alert(error.responseJSON.message) );
    }
})(jQuery);
