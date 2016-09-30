{
    const link = ( scope, element, attrs ) => {
        let { dateFormat } = attrs;

        const datepicker = {
            autoClose: true,
            todayButton: new Date(),
            dateFormat,
            onSelect (fd, d, calendar) {
                scope.onSelect && scope.onSelect({
                    $event: { date: d, formatted: fd }
                });
            }
        };

        $.fn.datepicker.language['ru'].monthsShort = [
            "янв.","февр.","мар.","апр.","мая","июня",
            "июля","авг.","сент.","окт.","нояб.","дек."
        ];

        $( element ).datepicker( datepicker );
    };

    const directive = () => ({
        restrict: 'A',
        scope: { onSelect:'&' },
        link
    });

    angular
        .module('Common',[])
        .directive('dpicker', directive);

}