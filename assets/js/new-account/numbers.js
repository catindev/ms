
/* Numbers form */

var __form = __form || { numbers: [] };

{
    $("#createNumber").on('click', createNumber);
    $("#numbersList").on('click', '.remove-button', __form.onRemoveListItem || (() => {}));

    function createNumberView(data, index) {
        return `
            <tr id="number${ index }">
                <td>${ data.phone }</td>
                <td>${ data.name }</td>
                <td class="tds">
                    <button class="button remove-button small"
                            item-index="${ index }"
                            item-type="number">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }

    function createNumber( event ) {
        const number = readForm('numberForm');

        if ( !number ) return alert('Заполни всю форму, пожалуйста');

        __form.numbers.push( number ); $('#numbers').show();

        $( createNumberView(number, __form.numbers.length - 1) )
            .appendTo( $('#numbersList') )
            .slideDown('fast');

        $('#numberForm')
            .find('input[type=text], textarea')
            .val('');
    }
}