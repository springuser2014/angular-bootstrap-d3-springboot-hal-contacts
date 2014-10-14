/**
 * Created by anthonyhayes on 4/14/14.
 */
angular.module('customersApp.contactControllers', [])
//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the details view
    .controller('ContactsController', ['$scope', '$routeParams', '$location', '$filter',
        'CustomersService', 'ModalService',
        'StatesService', 'ContactServices', 'CompanyServices', 'ContactPages',

        function ($scope, $routeParams, $location, $filter, CustomersService, ModalService, StatesService, ContactServices, CompanyServices, ContactPages) {
            $scope.customer = CustomersService.getStoredCustomer();
            $scope.filterOptions = {
                filterText: ''
            };
            $scope.state_array = {};
            $scope.companyNumber = parseInt($routeParams.customerID);
            $scope.contactPages = new ContactPages();
            $scope.contactPages.company = $scope.companyNumber;

            $scope.orderByField = 'lastName';
            $scope.reverseSort = false;

            //Grab contacts for company
            CompanyServices.getCompany($scope.companyNumber).then(function (data) {
                $scope.customer = data;
                CustomersService.storeCustomer(data);
            });

            createWatches();

            function createWatches() {
                //Watch searchText value and pass it and the customers to nameCityStateFilter
                //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
                //while also accessing the filtered count via $scope.filteredCount above
                $scope.$watch("searchText", function (filterText) {
                    filterContacts(filterText);
                });
            }

            $scope.navigate = function (url, customerObject) {
                var companyArray = [0];
                if (customerObject) {
                    CustomersService.storeCustomer(customerObject);
                    companyArray = customerObject._links.self.href.split('/');
                }

                $location.path(url + '/' + companyArray[companyArray.length - 1]);
            };

            function filterContacts(filterText) {
                // if all pages have been loaded, filter on the client
                    $scope.contactPages.allPages = false;
                    $scope.contactPages.searchText = filterText;
                    $scope.contactPages.pageNo = 0;
                    $scope.contactPages.busy = false;
                    $scope.contactPages.items = [];
                    $scope.contactPages.nextPage();
            }

            $scope.deleteContact = function (idx, contact) {

                var contactName = contact.firstName + ' ' + contact.lastName;

                var modalDefaults = {
                    templateUrl: 'app/partials/util/modal.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Contact',
                    headerText: 'Delete ' + contactName + '?',
                    bodyText: 'Are you sure you want to delete this contact?'
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        ContactServices.deleteContact(contact);
                        $scope.contactPages.items.splice(idx, 1);
                    }
                });

            };


            $scope.editContact = function (contact) {

                $scope.state_array = StatesService.getStates();
                var custName = $scope.customer.companyName + ', ' + $scope.customer.city;
                var origCard = {};
                var editContact = true;
                if (contact) {
                    origCard = angular.copy(contact);
                } else {
                    contact = {};
                    editContact = false;
                }

                var modalDefaults = {
                    templateUrl: 'app/partials/contact/modalContactEdit.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Submit',
                    headerText: 'Contact at ' + custName,
                    record: contact,
                    model1: $scope.state_array
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        if (editContact) {
                            ContactServices.patchContact(contact);
                        } else {
                            ContactServices.postContact(contact, $scope.companyNumber);
                            $scope.contactPages.items.push(contact);
                        }
                    } else {
                        if (contact) {
                            angular.forEach(origCard, function (obj, dataset) {
                                contact[dataset] = obj;
                            });
                        }
                    }
                });
            };
        }
    ]);
