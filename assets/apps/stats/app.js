{
    const template = `
        <style>
            #statsApp {
                width: 960px;
                margin: 0 auto;
                padding: 2rem 0;
                padding-top: 5rem;
            }
            .chartBox {
                padding: 2rem 3rem;
                margin-bottom: 3rem;
                background: #fff;
                box-shadow: 0 1px 4px rgba(0,0,0,.1);
                border: 1px solid rgba(0,0,0,.09);
                border-radius: 3px;
            }        
            .chartHeader {
                font-size: 16px;
                font-weight: 500;
                text-align: center;
                padding-bottom: 1rem;
            } 
            .chartContainer { height: 500px; }
        </style>
        <div id="statsApp">
            <stats-menu 
                states="$ctrl.states" 
                on-change="$ctrl.onMenuChange($event)">
            </stats-menu>
            
            <h1 ng-bind="$ctrl.active.title" style="padding: 1rem 0;"></h1>
            
            <date-filter 
                state="$ctrl.dateFilter"
                full="$ctrl.isFull"
                on-update="$ctrl.setFilter($event)">
            </date-filter>
            
            <stats-sub-menu 
                ng-if="$ctrl.active.menu"
                submenu="$ctrl.active.menu" 
                on-change="$ctrl.onSubmenuChange($event)">
            </stats-sub-menu>   
             
            <div class="chartBox">
                <h4 class="chartHeader">
                    Статистика с {{ $ctrl.dateFilter.start.formatted }}
                    по {{ $ctrl.dateFilter.end.formatted }}
                </h4>
                
                <div ng-if="$ctrl.fetching" class="chartContainer" 
                     ng-class="{ 'preloader-big': $ctrl.fetching }">
                </div>
                
                <div ng-if="!$ctrl.fetching"
                     class="chartContainer" 
                     id="chart"   
                     c3-chart 
                     chart-config="$ctrl.chartState.config"
                     color-map="$ctrl.chartState.colorMap">
                </div>
            </div>                     
                     
                     
        </div>
    `;

    class controller {

        constructor( pageState, chartState ) {
            this.pageState = pageState;
            this.chartState = chartState;
        }

        $onInit() {
            this.pageState.update();
        }

        get fetching() { return this.pageState.fetching; }

        get states() {
            return this.pageState.get();
        }

        get active() {
            return this.pageState.active;
        }

        get dateFilter() {
            return this.pageState.dateFilter;
        }

        get isFull() {
            if ( !this.active.menu ) return this.active.interval;
            return this.pageState.subActive.interval;
        }

        setFilter( filter ) {
            this.pageState.dateFilter = filter;
            this.pageState.update();
        }

        onMenuChange({ state }) {
            this.pageState.active = state;
            this.pageState.update();
        }

        onSubmenuChange({ type }) {
            this.pageState.subActive = type;
            this.pageState.update();
        }
    }

    angular.module('statsApp', [ 'Common' ])
        .component('statsApp', { template, controller })
        // .config( $locationProvider => $locationProvider.html5Mode(true) )
        ;
}