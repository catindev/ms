
// Yeap, it's global, Karl (:
var __form = {
    users: [], numbers: [], fields: [], reasons: [],

    onRemoveListItem( e ) {
        const type = $(e.target).attr('item-type');
        const itemsList = __form[ `${ type }s` ];
        const index = parseInt( $( e.target ).attr('item-index') );
        $(`#${ type }${ index }`).remove();
        itemsList.splice(index, 1);
        itemsList.length === 0 && $( `#${ type }s` ).hide();
    }
};

{
    $("#createAccount").on( 'click', createAccount );

    function createAccount(event) {
        const name = $(`#account-details input[name=name]`).val();
        const maxWaitingTime = $(`#service input[name=maxWaitingTime]`).val();
        const maxAnswerTime = $(`#service input[name=maxAnswerTime]`).val();
        const account = { name, maxWaitingTime, maxAnswerTime };

        if ( !account.name ) return alert('Аккаунту нужно имя');
        if ( __form.users.length === 0 ) return alert('Нужно создать хотя бы одного пользователя');
        if ( __form.numbers.length === 0 ) return alert('Нужно создать хотя бы один рекламный источник');
        if ( !account.maxWaitingTime ) return alert('Введи скорость ответа на звонок');
        if ( !account.maxAnswerTime ) return alert('Введи максимальную длительность разговора');

        if ( __form.reasons.length === 0 ) return alert('Нужно заполнить список причин для нецелевых')
        else account.noTargetReasons = __form.reasons;

        let { users, numbers, fields } = __form;
        $.post('/accounts', { account, users, numbers, fields })
            .done( data => location.reload() )
            .fail( error => alert( error.responseJSON.message ) );
    }

}