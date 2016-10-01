{
    const chartCfg = {
        bindto: '#chart',
        data: {
            columns: [],
            type: ''
        },
        legend: { position: "bottom" },
        bar: { width: { ratio: 0.4 } },
        axis: {
            x: {
                label: '',
                type: 'category',
                categories: []
            },
            y: {
                label: {
                    text: 'Количество звонков',
                    position: 'outer-middle',
                },
                tick: {
                    centered: true,
                    format: function(d) {
                        return (parseInt(d) == d) ? d : null;
                    }
                }
            }
        },
        tooltip: {
            format: {
                value: function (x) {
                    return x;
                }
            }
        }
    };

    class chartState {
        constructor() {
            this.config = Object.assign({}, chartCfg);
            this.colorMap = null;
        }

        drop() {
            this.config = null;
        }

        set({ type, columns, categories, interval }) {
            this.config = Object.assign({}, chartCfg);
            type && ( this.config.data.type = type );
            columns && ( this.config.data.columns = columns );
            categories && ( this.config.axis.x.categories = categories );
            interval && ( this.config.axis.x.label = interval )
        }
    }

    angular
        .module('statsApp')
        .service('chartState', chartState)
}