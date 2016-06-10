'use strict';
(function(module) {

    angular.module('tink.gis').directive('indeterminateCheckbox', [function() {
        return {
            scope: true,
            require: '?ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList;
                var property = attrs.property;
                // Bind the onChange event to update children
                element.bind('change', function() {
                    scope.$apply(function() {
                        var isChecked = element.prop('checked');
                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function(child) {
                            child[property] = isChecked;
                        });
                    });
                });
                //https://tech.small-improvements.com/2014/06/11/deep-watching-circular-data-structures-in-angular/
                function watchChildrenListWithProperty() {
                    return scope.$eval(childList).map(function(x) { return x[property]; });
                }
                // Watch the children for changes
                scope.$watch(watchChildrenListWithProperty, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var hasChecked = false;
                        var hasUnchecked = false;
                        // Loop through the children
                        angular.forEach(newValue, function(child) {
                            if (child) {
                                hasChecked = true;
                            } else {
                                hasUnchecked = true;
                            }
                        });
                        // Determine which state to put the checkbox in
                        if (hasChecked && hasUnchecked) {
                            element.prop('checked', true);
                            element.prop('indeterminate', true);
                            if (modelCtrl) {
                                modelCtrl.$setViewValue(true);
                            }
                        } else {
                            element.prop('checked', hasChecked);
                            element.prop('indeterminate', false);
                            if (modelCtrl) {
                                modelCtrl.$setViewValue(hasChecked);
                            }
                        }
                    }
                }, true);
            }
        };
    }]);
})();