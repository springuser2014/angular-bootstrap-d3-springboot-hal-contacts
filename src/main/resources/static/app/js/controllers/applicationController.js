/**
 * Created by anthonyhayes on 4/16/14.
 */
angular.module('customersApp.applicationControllers', [])

.controller("appController", [
    "$scope", "$timeout", "$q", "customersService", "statesService", "salesPersonService", "probabilitiesService",
    function ($scope, $timeout, $q, customersService, statesService, salesPersonService, probabilitiesService) {
        $scope.loadingDone = false;


        $scope.fail = function () {
            console.log('User handling promise rejected');
        };


        statesService.getConfiguredStates().then(function (data) {
            //this will execute when the
            //AJAX call completes.
            statesService.setStates(data);
        });
        salesPersonService.getConfiguredSalesPeople().then(function (data) {
            //this will execute when the
            //AJAX call completes.
            salesPersonService.setSalesPeople(data);
        });
        probabilitiesService.getConfiguredProbabilities().then(function (data) {
            //this will execute when the
            //AJAX call completes.
            probabilitiesService.setProbabilities(data);
        });

        // use $q.all to wait until all promises are resolved
//        $q.all([
//            CompanyServices.getCompanies(0),
//            statesService.getConfiguredStates
//        ]).then(
//            function(data) {
//                if(data[0]._embedded){
//                    customersService.saveCustomerPages(data[0]);
//                }
//                if(data[1]){
//                    statesService.setStates(data[0]);
//                }
//                console.log('All services are resolved!');
//                // when evdrything has loaded, flip the switch, and let the
//                // routes do their work
//                $scope.loadingDone = true;
//            },
//            function(reason) {
//                // if any of the promises fails, handle it
//                // here, I'm just throwing an error message to
//                // the user.
//                $scope.failure = reason;
//            });
        $scope.loadingDone = true;

    }
])
    //this contoller is in charhe of the loadfing bar,
    // it's quick and dirty, and does nothing fancy.
    .controller("loadingController", [
        "$scope", "$timeout",
        function ($scope, $timeout) {
            $scope.percentDone = 0;

            function animateBar() {
                // very crude timeout based animator
                // just to illustrate the sample
                $scope.percentDone +=5;
                if ($scope.loadingDone) {
                    // this is thighly coupled to the appController
                    return;
                }
                $timeout(animateBar, 200);

            }

            animateBar();
        }
    ]);

