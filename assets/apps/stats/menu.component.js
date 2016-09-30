{
    const template = `
        <div class="submenu">
            <a ng-repeat="(state, data) in $ctrl.states track by $index" 
               class="subItem" 
               ng-class="{ 'subItem-active': data.active }"
               ng-click="!data.active && $ctrl.changeState(state)"
               ng-bind="data.title">
            </a>
        </div>
    `;

    class controller {

        constructor( $location ) {
            this.$location = $location;
        }

        changeState( state ) {
            // this.$location.path('stats/' + name);
            this.onChange({ $event: { state } });
        }
    }


    const component = {
        bindings: { states: '<', onChange: '&' },
        template,
        controller
    };

    angular
        .module('statsApp')
        .component('statsMenu', component)
}