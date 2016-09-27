const options = {
    bindto: '#tchart',

    data: {
        columns: [
            ['Источник #1', 2, 1, 2],
            ['Источник #2', 3, 1, 0],
            ['Источник #3', 10, 3, 7]
        ],
        type: 'bar',
        colors: {
            'Источник #1': '#ff0000',
            'Источник #2': '#00ff00',
            'Источник #3': '#0000ff'
        },
    },

    legend: {  position: 'right' },

    zoom: { enabled: true },

    bar: { width: { ratio: 0.4 } },

    axis: {
        x: {
            label: 'Недели',
            type: 'category',
            categories: ['1 неделя\nпт', '2 неделя \nпт', '3 неделя\nпт']
        },
        y: {
            label: {
                text: 'Количество звонков',
                position: 'outer-middle',
            },
            tick: {
                centered: true,
                format: function (d) {
                    return (parseInt(d) == d) ? d : null;
                }
            }
        }
    }
};