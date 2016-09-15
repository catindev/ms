(function($) {
    $("#save").on('click', update);

    function update(event) {

        const params = Object.assign(
            {},
            readForm('contactDetails'),
            readForm('customFields'),
            readForm('contactAdditionals')
        );

        if ( !params.phone ) return alert('Запишите телефон для контакта');

        let { _id, backURL } = JSON.parse(
            $.trim( $('#service-info').text() )
        );

        $.post('/contacts/' + _id, params)
            .done( () => location.href = backURL )
            .fail( error => alert(error.responseJSON.message) );
    }
})(jQuery);
