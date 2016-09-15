
/* field custom fields */

var __form = __form || {};

(function($) {

    $("#fieldItemType").on('change', OnTypeChange);
    $("#addFieldItem").on('click', addfieldItem);
    $("#fieldItems").on('click', '.remove-button', __form.onRemoveListItem || (() => {}));

    function OnTypeChange() {
        if ( $(this).val() === 'list' ) {
            $("#fieldList").show();
            $("#fieldListItems").val('');
        } else $("#fieldList").hide();
    }

    function createfieldItemView(data, index) {
        const type = { list: 'Список', string: 'Текстовое поле' };
        const typeText = data.type === 'list'
            ? `${ type[ data.type ] }<br><span style="font-size: 12px">${ (data.list.split('\n')).join(', ') }`
            : false;
        return `
            <tr id="field${ index }">
                <td>${ data.name }</td>
                <td style="max-width: 320px;">${ typeText || type[ data.type ] }</td>
                <td class="tds">
                    <button class="button remove-button small"
                            item-index="${ index }"
                            item-type="field">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }

    function addfieldItem() {
        const field = readForm('fieldForm');

        if ( !field || field.type === 'list' && !field.list)
            return alert('Заполни всю форму, пожалуйста');

        const list = field.list
            ? (field.list.split('\n')).map( e => e.replace('\r\n', ''))
            : [];

        __form.fields.push({
            id: transliterate(field.name),
            name: field.name,
            type: field.type,
            description: field.description || '',
            list
        });

        $('#fields').show();
        $( createfieldItemView(field, __form.fields.length - 1) )
            .appendTo( $('#fieldItems') )
            .slideDown('fast');

        $('#fieldForm')
            .find('input[type=text], textarea')
            .val('');

        console.log(':D', __form.fields);
    }

})(jQuery);