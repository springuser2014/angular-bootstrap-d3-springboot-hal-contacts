/**
 * Created by anthonyhayes on 4/14/14.
 */
angular.module('customersApp.opportunityControllers', [])
//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the details view
    .controller('CustomerOpportunityController', ['$scope', '$routeParams', '$location',
        'customersService', 'modalService', 'OpportunityServices', 'CompanyServices',

        function ($scope, $routeParams, $location, customersService, modalService, OpportunityServices, CompanyServices) {

            //Grab customerID off of the route
            $scope.customerID = parseInt($routeParams.customerID);

            $scope.customer = customersService.getStoredCustomer();
            if (!$scope.customer) {
                CompanyServices.getCompany($scope.customerID).then(function (data) {
                    $scope.customer = data;
                    customersService.storeCustomer(data);
                });
            }
            $scope.filterOptions = {
                filterText: ''
            };


            init();


            function init() {


                var templateCache =
                    "<div ng-dblclick=\"onDblClickRow(row)\" <div ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\">\r" +
                    "\n" +
                    "\t<div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div>\r" +
                    "\n" +
                    "\t<div ng-cell></div>\r" +
                    "\n" +
                    "</div>";
                var filterBarPlugin = {
                    init: function (scope, grid) {
                        filterBarPlugin.scope = scope;
                        filterBarPlugin.grid = grid;
                        $scope.$watch(function () {
                            var searchQuery = "";
                            angular.forEach(filterBarPlugin.scope.columns, function (col) {
                                if (col.visible && col.filterText) {
                                    var filterText = (col.filterText.indexOf('*') === 0 ? col.filterText.replace('*', '') : col.filterText) + ";";
                                    searchQuery += col.displayName + ": " + filterText;
                                }
                            });
                            return searchQuery;
                        }, function (searchQuery) {
                            filterBarPlugin.scope.$parent.filterText = searchQuery;
                            filterBarPlugin.grid.searchProvider.evalFilter();
                        });
                    },
                    scope: undefined,
                    grid: undefined
                };
                $scope.myOpportunities = {
                    data: 'opportunities',
                    showGroupPanel: true,
                    groups: [],
                    showColumnMenu: true,
                    plugins: [filterBarPlugin],
                    headerRowHeight: 60, // give room for filter bar
                    rowTemplate: templateCache,
                    filterOptions: $scope.filterOptions,
                    columnDefs: [
                        {
                            field: 'salesPersonDescription',
                            headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                            width: '*',
                            displayName: 'Sales Person'
                        },
                        {
                            field: 'contactDescription',
                            headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                            width: '*',
                            displayName: 'Contact Name'
                        },
                        {
                            field: 'discussion',
                            headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                            width: '***',
                            displayName: 'Discussion'
                        },
                        {
                            field: 'probabilityDescription',
                            headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                            width: '*',
                            displayName: 'Probability'
                        },
                        {
                            field: 'potentialRevenue',
                            headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                            width: '*',
                            displayName: 'Potential Revenue'
                        }
                    ]
                };


                if ($scope.customerID) {

                    //make the call to getCompanies and handle the promise returned;
                    OpportunityServices.getOpportunities($scope.customerID).then(function (data) {
                        //this will execute when the
                        //AJAX call completes.
                        if (data._embedded) {
                            $scope.opportunities = data._embedded.opportunities;
                        }

                    });

                }
            }

            $scope.onDblClickRow = function (row) {

                var custName = $scope.customer.customerName + ', ' + $scope.customer.city;
                var id = 0;
                var opportunityArray = [0];
                $scope.opportunityDetails = {};


                if (row) {
                    customersService.storeOpportunity(row.entity);
                    id = row.entity.id;
                    opportunityArray = row.entity._links.self.href.split('/')
                }

                $location.path('opportunitiesedit/' + $scope.customerID + '/' + opportunityArray[opportunityArray.length - 1]);


            };
        }
    ])
    .controller('CustomerOpportunitiesEditController', ['$scope', '$routeParams', '$location', '$filter',
        'customersService', 'salesPersonService', 'ContactServices', 'probabilitiesService', 'modalService',
        'formComponentService', 'OpportunityDetailServices', 'CompanyServices', 'OpportunityServices',
        'OpportunityFormServices',

        function ($scope, $routeParams, $location, $filter, customersService, salesPersonService, ContactServices, probabilitiesService, modalService, formComponentService, OpportunityDetailServices, CompanyServices, OpportunityServices, OpportunityFormServices) {

            $scope.master = {};
            $scope.opportunityFormObject = {};
            $scope.customer = {};
            $scope.opportunities = {};
            $scope.opportunity = {};
            $scope.opportunityForm = {};
            $scope.salesPerson_array = salesPersonService.getSalesPeople();
            $scope.probability_array = probabilitiesService.getProbabilities();
            $scope.contact_array = [];
            $scope.filterOptions = {
                filterText: ''
            };
            $scope.customerID = $routeParams.customerID;
            $scope.opportunityID = ($routeParams.id);
            $scope.opportunityFormTemplate = formComponentService.getOpportunityForm();


            init();

            function init() {
                // get all contacts for contact drop down
                ContactServices.getAllContacts($scope.customerID).then(function (data) {
                    if (data._embedded) {
                        $scope.contact_array = data._embedded.contacts;
                    }
                });

                if ($scope.customerID) {
                    $scope.customer = customersService.getStoredCustomer();
                    if (!$scope.customer) {
                        CompanyServices.getCompany($scope.customerID).then(function (data) {
                            $scope.customer = data;
                            customersService.storeCustomer(data);
                        });
                    }

                }
                if (parseInt($scope.opportunityID)) {
                    OpportunityFormServices.getOpportunities($scope.opportunityID).then(function (data) {
                        if (data._embedded) {
                            $scope.opportunityForm = data._embedded.opportunityForms;

                            $scope.opportunityFormObject = {};
                            // read through the opportunity form and create 1 object
                            angular.forEach($scope.opportunityForm, function (component) {
                                $scope.opportunityFormObject[component.name] = component.value;
                            });
                        }
                    });

                    $scope.opportunity = customersService.getStoredOpportunity();
                    $scope.master = angular.copy($scope.opportunity);
                    if (!$scope.opportunity) {
                        OpportunityServices.getOpportunity($scope.opportunityID).then(function (data) {
                            $scope.opportunity = data;
                            customersService.storeOpportunity(data);
                            $scope.master = angular.copy($scope.opportunity);
                            $scope.customerOpportunitiesForm.$setPristine();
                        });
                    }

                }
            }


            var templateCache =
                "<div ng-dblclick=\"onDblClickRow(row)\" <div ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\">\r" +
                "\n" +
                "\t<div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div>\r" +
                "\n" +
                "\t<div ng-cell></div>\r" +
                "\n" +
                "</div>";

            var filterBarPlugin = {
                init: function (scope, grid) {
                    filterBarPlugin.scope = scope;
                    filterBarPlugin.grid = grid;
                    $scope.$watch(function () {
                        var searchQuery = "";
                        angular.forEach(filterBarPlugin.scope.columns, function (col) {
                            if (col.visible && col.filterText) {
                                var filterText = (col.filterText.indexOf('*') === 0 ? col.filterText.replace('*', '') : col.filterText) + ";";
                                searchQuery += col.displayName + ": " + filterText;
                            }
                        });
                        return searchQuery;
                    }, function (searchQuery) {
                        filterBarPlugin.scope.$parent.filterText = searchQuery;
                        filterBarPlugin.grid.searchProvider.evalFilter();
                    });
                },
                scope: undefined,
                grid: undefined
            };

            $scope.myOpportunityDetails = {
                data: 'opportunityDetails',
                showGroupPanel: true,
                groups: [],
                showColumnMenu: true,
                plugins: [filterBarPlugin],
                headerRowHeight: 60, // give room for filter bar
                rowTemplate: templateCache,
                filterOptions: $scope.filterOptions,
                columnDefs: [
                    {
                        field: 'salesPersonDescription',
                        headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                        width: '*',
                        displayName: 'Sales'
                    },
                    {
                        field: 'followUpdate',
                        headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                        width: '*',
                        cellFilter: 'date',
                        displayName: 'Date'
                    },
                    {
                        field: 'action',
                        headerCellTemplate: 'app/partials/filterHeaderTemplate.html',
                        width: '***',
                        displayName: 'Action'

                    }
                ]
            };

            if (parseInt($scope.opportunityID)) {

                //make the call to getCompanies and handle the promise returned;
                OpportunityDetailServices.getOpportunities($scope.opportunityID).then(function (data) {
                    //this will execute when the
                    //AJAX call completes.
                    if (data._embedded) {
                        $scope.opportunityDetails = data._embedded.opportunityDetails;
                    }

                });

            }

            $scope.onDblClickRow = function (row) {

                // opportunity must exist before creating rows
                if (!parseInt($scope.opportunityID)) {

                    var modalDefaults = {
                        templateUrl: 'app/partials/modal.html'
                    };
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'OK',
                        headerText: 'Submit This Opportunity',
                        bodyText: 'Before adding action items, you must submit this opportunity'
                    };

                    modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                        if (result === 'ok') {
                        }
                    });

                } else {
                    var custName = $scope.customer.companyName + ', ' + $scope.customer.city;
                    var origRow = {};
                    $scope.opportunityDetail = {};
                    if (row) {
                        origRow = angular.copy(row.entity);
                        $scope.opportunityDetail = row.entity;
                        $scope.opportunityDetail.followUpdate = $filter('date')($scope.opportunityDetail.followUpdate, 'MM/dd/y');
                    }


                    var modalDefaults = {
                        templateUrl: 'app/partials/opportunity/modalOpportunityActionsEdit.html'
                    };
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Submit',
                        headerText: 'Opportunity at ' + custName,
                        record: $scope.opportunityDetail,
                        model1: $scope.salesPerson_array
                    };

                    modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                        if (result === 'ok') {

                            if ($scope.opportunityDetail.followUpdate) {
                                var d = new Date($scope.opportunityDetail.followUpdate);
                                $scope.opportunityDetail.followUpdate = d.getTime();
                            }
                            for (var i = 0; i < $scope.salesPerson_array.length; i++) {
                                if ($scope.salesPerson_array[i].salesPersonId === $scope.opportunityDetail.salesPersonId) {
                                    $scope.opportunityDetail.salesPersonDescription = $scope.salesPerson_array[i].salesPersonDescription;
                                    break;
                                }
                            }

                            if (row) {
                                OpportunityDetailServices.patchOpportunity($scope.opportunityDetail);
                            } else {
                                OpportunityDetailServices.postOpportunity($scope.opportunityDetail, $scope.customerID, $scope.opportunityID);
                                $scope.opportunityDetails.push($scope.opportunityDetail);
                            }
                        } else {
                            if (row) {
                                //                           row.entity = origRow;
                                angular.forEach(origRow, function (obj, dataset) {
                                    row.entity[dataset] = obj;
                                });
                            }
                        }
                    });

                }

            };


            // function to submit the form after all validation has occurred
            $scope.submitForm = function () {

                $scope.opportunity = angular.copy($scope.master);

                if (parseInt($scope.opportunityID)) {
                    OpportunityServices.patchOpportunity($scope.master);

                    // read through the opportunity form and send changes back to the mother ship
                    opportunityFormProcessor();


                } else {
                    OpportunityServices.postOpportunity($scope.master, $scope.customerID).then(function (data) {

                        // need to get the opportunity #
                        var opportunityArray = data.split('/')
                        $scope.opportunityID = opportunityArray[opportunityArray.length - 1];

                        // read through the opportunity form and send changes back to the mother ship
                        opportunityFormProcessor()

                    });

                }

                $location.path('/opportunitydetails/' + $routeParams.customerID);

            };
            function opportunityFormProcessor() {
                var formTemplate = formComponentService.getDynamicForm();

                // read through the opportunity form and send changes back to the mother ship
                angular.forEach(formTemplate, function (component) {
                    if ($scope.opportunityFormObject[component.field_id]) {
                        var formField = {};
                        formField.name = component.field_id;
                        formField.value = $scope.opportunityFormObject[component.field_id];

                        // now find the link (if this is an edit of an existing value)
                        var rec = null;
                        angular.forEach($scope.opportunityForm, function (originalComponent) {
                            if (originalComponent.name === formField.name) {
                                rec = originalComponent;
                                rec.name = formField.name;
                                rec.value = formField.value;
                            }
                        });

                        if (rec) {
                            OpportunityFormServices.patchOpportunity(rec, $scope.opportunityID);
                        } else {
                            OpportunityFormServices.postOpportunity(formField, $scope.opportunityID);
                        }
                    } else {
                        // it could be a delete - read through opportunity form for the original value, if it exists, then it is a delete
                        var deleteComponent = component.field_id;
                        angular.forEach($scope.opportunityForm, function (originalComponent) {
                            if (originalComponent.name === deleteComponent) {
                                OpportunityFormServices.deleteOpportunity(originalComponent, $scope.opportunityID);
                            }
                        });

                    }
                });


            }


        }
    ]);
