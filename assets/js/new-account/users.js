
/* Users form */

var __form = __form || { users: [] };

{

    $("#createUser").on('click', createUser);
    $("#usersList").on('click', '.remove-button', __form.onRemoveListItem || (() => {}));

    function createUserView(data, index) {
        const accessType = { boss: 'Руководитель', manager: 'Менеджер' };
        return `
            <tr id="user${ index }">
                <td>${ data.name }</td>
                <td>${ accessType[ data.access ] }</td>
                <td>${ data.phones }</td>
                <td>${ data.email  }</td>
                <td>${ data.password  }</td>
                <td class="tds">
                    <button class="button remove-button small"
                            item-index="${ index }"
                            item-type="user">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }

    function createUser( event ) {
        const user = readForm('userForm', true);
        if ( !user ) return alert('Заполни всю форму, пожалуйста');

        __form.users.push( user ); $('#users').show();

        $( createUserView(user, __form.users.length-1) )
            .appendTo( $('#usersList') )
            .slideDown('fast');

        $('#userForm')
            .find('input[type=text], textarea')
            .val('');
    }

};