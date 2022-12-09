angular.module('footerModule').component('mainFooter', {
    templateUrl: './app/components/footer/footer.template.html',
    bindings: {
        user: '<',
        service: '<',
        isModalOpen: '<',
    },
    controller: [function footerModuleController() {}],
})
