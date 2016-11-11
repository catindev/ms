{
    const PAGE_STATES = {
        calls: {
            name: 'calls',
            title: 'Входящие и пропущенные',
            menu: [
                {
                    title: 'Соотношение входящих и пропущенных',
                    type: 'ratio',
                    interval: true,
                    active: true,
                },
                {
                    title: 'Время входящих',
                    type: 'incoming',
                    interval: false,
                    active: false
                },
                {
                    title: 'Время пропущенных',
                    type: 'missing',
                    interval: false,
                    active: false
                }
            ],
            active: true
        },

        waiting: {
            name: 'waiting',
            title: 'Скорость ответов на звонки',
            menu: false,
            interval: true,
            active: false
        },

        leads: {
            name: 'leads',
            title: 'Эффективность рекламных источников',
            menu: [
                {
                    title: 'За весь период',
                    type: 'all',
                    active: true,
                    interval: false
                },
                {
                    title: 'По интервалам',
                    type: 'intervals',
                    active: false,
                    interval: true
                },
                {
                    title: 'Целевые/Нецелевые',
                    type: 'target',
                    active: false,
                    interval: true
                },
                {
                    title: 'Нецелевые(%)',
                    type: 'nontarget',
                    active: false,
                    interval: true
                }
            ],
            active: false
        }
    };

    angular
        .module('statsApp')
        .constant('PAGE_STATES', PAGE_STATES)
}