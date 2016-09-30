{
    const template = `
    <style>
        .dateFilter {
            padding: 2rem 3rem;
            margin-bottom: 3rem;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,.1);
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 3px;
        }
        .dateFilter__title { font-weight: 500; }
    </style>
    <div class="dateFilter">
        <h3 class="dateFilter__title">
            Период 
            <span ng-show="$ctrl.full">и интервал</span>
            </h3>          
        <form class="form">
            <div class="row">
                <div class="col col-{{ $ctrl.cs }}">
                    <div class="form-item">
                        <label>Дата начала периода</label>
                        <input type="text" dpicker date-format="d M"
                               ng-model="$ctrl.state.start.formatted"
                               on-select="$ctrl.setDate($event, 'start')"/>
                    </div>
                </div>
                <div class="col col-{{ $ctrl.cs }}">
                    <div class="form-item">
                        <label>Дата окончания</label>
                        <input type="text" dpicker date-format="d M"
                               ng-model="$ctrl.state.end.formatted"
                               on-select="$ctrl.setDate($event, 'end')"/>
                    </div>
                </div>            
                <div ng-if="$ctrl.full" class="col col-2">
                    <div class="form-item">
                        <label>Интервал</label>
                        <select ng-options="i as i.label for i in $ctrl.intervals track by i.id" 
                                class="select"
                                ng-model="$ctrl.state.interval"
                                ng-change="$ctrl.setInterval()">
                        </select>
                    </div>
                </div>
                <div class="col col-1">
                    <div class="form-item">
                        <label style="visibility: hidden">Action</label>
                        <button type="button" class="button primary" 
                                ng-click="$ctrl.updateFilter()">
                                Показать
                        </button>        
                    </div>
                </div>
            </div>
        </form>
    </div>
    `;

    class controller {

        $onInit() {
            this.intervals = [
                { id: 'days', label: 'Дни' },
                { id: 'weeks', label: 'Недели' },
                { id: 'months', label: 'Месяцы' },
            ];

            this.current = this.state;
        }

        get cs() { return this.full ? '4' : '5'; }

        setDate({ date, formatted }, type) {
            this.current[ type ] = { date, formatted };
        }

        setInterval() {
            this.current.interval = this.state.interval;
        }

        isPeriodInvalid() {
            const startTS = new Date( this.current.start.date ).getTime();
            const endTS = new Date( this.current.end.date ).getTime();
            console.log(startTS - endTS)
            return startTS > endTS;
        }

        updateFilter() {
            this.onUpdate({ $event: this.current })
        }
    }

    angular
        .module('statsApp')
        .component('dateFilter', {
            bindings: {
                state: '<',
                full: '<',
                onUpdate: '&'
            },
            template,
            controller
        })
    ;

}