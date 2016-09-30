{
    const template = `
        <div class="submenu">
            <a ng-repeat="item in $ctrl.submenu track by $index" 
               class="subItem" 
               ng-class="{ 'subItem-active': item.active }"
               ng-click="!item.active && $ctrl.setSubItem(item.type)"
               ng-bind="item.title">
            </a>
        </div>
    `;

    class controller {
        setSubItem( type ) {
            this.onChange({ $event: { type } });
        }
    }


    const component = {
        bindings: { submenu: '<', onChange: '&' },
        template,
        controller
    };

    angular
        .module('statsApp')
        .component('statsSubMenu', component)
}