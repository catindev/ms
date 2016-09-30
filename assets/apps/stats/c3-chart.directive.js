{
    const directive = () => ({
        restrict: 'A',
        scope: {
            chartConfig: '=',
            colorMap: '='
        },
        link( scope, element, attrs ) {
            let chart;
            scope.$watch('chartConfig', (state) => {
                if (!state) return;
                try {
                    chart = c3.generate(state);
                } catch(e) {
                    console.error('c3-chart:', e.message);
                }
            }, true);

            scope.$watch('colorMap', (map) => {
                if (!map) return;
                try {
                    chart.data.colors(map);
                } catch(e) {
                    console.error('c3-chart:', e.message);
                }
            }, true);
        }
    });

    angular
        .module('statsApp')
        .directive('c3Chart', directive);


}