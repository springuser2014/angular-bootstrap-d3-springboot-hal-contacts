/* Filters */

angular.module('customersApp.filters', [])

    .filter('nameCityStateFilter', function () {

        return function (customers, filterValue) {
            if (!filterValue) return customers;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < customers.length; i++) {
                var cust = customers[i];
                if ((cust.companyName && cust.companyName.toLowerCase().indexOf(filterValue) > -1) ||
                    (cust.state && cust.state.toLowerCase().indexOf(filterValue) > -1) ||
                    (cust.city && cust.city.toLowerCase().indexOf(filterValue) > -1) ||
                    (cust.contactName && cust.contactName.toLowerCase().indexOf(filterValue) > -1)) {

                    matches.push(cust);

                }
            }
            return matches;
        };

    })
    .filter('contactNameCityStateFilter', function () {

        return function (contacts, filterValue) {
            if (!filterValue) return contacts;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                if ((contact.firstName && contact.firstName.toLowerCase().indexOf(filterValue) > -1) ||
                    (contact.state && contact.state.toLowerCase().indexOf(filterValue) > -1) ||
                    (contact.city && contact.city.toLowerCase().indexOf(filterValue) > -1) ||
                    (contact.lastName && contact.lastName.toLowerCase().indexOf(filterValue) > -1)) {

                    matches.push(contact);

                }
            }
            return matches;
        };

    });
