{
    const start = moment().startOf('isoWeek').toDate(),
          end = moment().endOf('isoWeek').toDate(),
          defaultDateRange = {
                start: {
                    date: start,
                    formatted: moment(start).format('D MMM')
                },
                end: {
                    date: end,
                    formatted: moment(end).format('D MMM')
                },
                interval: { id: 'days', label: 'Дни' }
          };

    class pageState {

        constructor( PAGE_STATES, $http, chartState ) {
            this.$http = $http;
            this.chartState = chartState;
            this.states = Object.assign({}, PAGE_STATES);
            this.dateFilter = defaultDateRange;
            this.fetching = false;
        }

        get( name ) {
            if ( name ) return this.states[name];
            return this.states;
        }

        get active() {
            for ( let state in this.states ) {
              if ( this.states.hasOwnProperty( state )  &&
                   this.states[ state ].active )
                  return this.states[ state ];
            }
        }
        set active( name ) {
            for ( let state in this.states ) {
                if ( this.states.hasOwnProperty( state ) )
                    this.states[ state ].active = state === name;
            }
        }

        get subActive() {
            if ( !this.active.menu ) return false;
            const parent = this.active;
            if ( !parent.menu ) return false;
            for ( let i in parent.menu ) {
                if ( parent.menu[ i ].active ) return parent.menu[ i ];
            }
        }
        set subActive( name ) {
            for ( let i in this.states[ this.active.name ].menu ) {
                const type = this.states[ this.active.name ].menu[ i ].type;
                this.states[ this.active.name ].menu[ i ].active = type === name;
            }
        }

        update() {
            console.log(':D filter', this.dateFilter)

            const url = `/api/stats/${ this.active.name }`;
            const query = {
                params: {
                    start: this.dateFilter.start.date,
                    end: this.dateFilter.end.date,
                    interval: this.dateFilter.interval.id,
                    type: this.subActive ? this.subActive.type : false
                }
            };

            const fetchResponse = response => {
                const type = this.active.menu
                    ? this.subActive.interval ? 'bar' : 'pie'
                    : this.active.interval ? 'bar' : 'pie';

                const interval = this.dateFilter.interval.label;

                this.chartState.set(
                    Object.assign({}, response.data, { type, interval })
                );

                // colors for missed calls
                if (this.active.name === 'calls' && this.subActive.type === 'missing' ) {
                    this.chartState.colorMap = null;
                    let colorMap = {};
                    response.data.columns && response.data.columns.forEach( (column, index) => {
                        colorMap[ column[0] ] = d3.rgb('#FF002A').darker(index)
                    });
                    this.chartState.colorMap = colorMap;
                }

                // colors for incoming calls
                if (this.active.name === 'calls' && this.subActive.type === 'incoming' ) {
                    this.chartState.colorMap = null;
                    let colorMap = {};
                    response.data.columns && response.data.columns.forEach( (column, index) => {
                        colorMap[ column[0] ] = d3.rgb('#00E676').darker(index)
                    });
                    this.chartState.colorMap = colorMap;
                }

                // colors for calls ratio
                if (this.active.name === 'calls' && this.subActive.type === 'ratio' ) {
                    this.chartState.colorMap = null;
                    let colorMap = {};
                    if ( response.data.columns ) {
                        const columns = response.data.columns;
                        colorMap[ columns[0][0] ] = '#00C564';
                        colorMap[ columns[1][0] ] = '#F80016';
                        this.chartState.colorMap = colorMap;
                    }
                }

                this.fetching = false;
                return null;
            };

            this.fetching = true;
            this.chartState.drop();
            return this.$http.get( url, query )
                .then( fetchResponse )
                .catch(error => {
                    this.fetching = false;
                    this.chartState.drop();
                    if (error.status === 401) document.location.href = '/stats2';
                    console.log('chart fetch error', error)
                });

        }
    }

    angular
        .module('statsApp')
        .service('pageState', pageState)
}