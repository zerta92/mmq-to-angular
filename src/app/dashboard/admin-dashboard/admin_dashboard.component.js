angular.module('adminDashboardModule', ['datatables']).component('adminDashboard', {
    templateUrl: './app/dashboard/admin-dashboard/admin_dashboard.component.html',
    bindings: {
        users: '<',
        user: '<',
        providers: '<',
    },
    controller: [
        'AdminDashboardServices',
        'DTOptionsBuilder',
        function AppointmentCardController(AdminDashboardServices, DTOptionsBuilder) {
            var ctrl = this

            ctrl.dtInstance = []
            ctrl.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('order', [[2, 'desc']])
                .withDisplayLength(10)

            ctrl.groupedByCustomer = {}
            ctrl.customers = []
            this.$onChanges = async function(vars) {
                if (angular.isDefined(vars)) {
                }
            }
            this.$onInit = async function() {
                getCustomersActions()
            }

            async function getCustomersActions() {
                const { data: allActions } = await AdminDashboardServices.getCustomersActions()

                const groupedByCustomer = _.groupBy(allActions, 'customer_id')
                ctrl.groupedByCustomer = groupedByCustomer
                ctrl.customers = Object.keys(groupedByCustomer).map(id => {
                    const customer = groupedByCustomer[id]
                    const { customer_id, customer_type, timestamp } = customer[0]
                    return { customer_id, customer_type, timestamp }
                })
            }
        },
    ],
})
