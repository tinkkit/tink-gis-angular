'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var theController = module.controller('searchOperationsController', ['$scope', 'SearchAdvancedService', 'MapService',
        function ($scope, SearchAdvancedService, MapService) {

            $scope.attributes = null; ['Straat', 'Postcode', 'nummer']; //ophalen vanaf API
            $scope.operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE', 'NOT LIKE'];
            $scope.operator = '=';
            $scope.selectedAttribute = null;
            $scope.value = null;
            $scope.layer = null;
            $scope.autoCompleteActive = false;
            $scope.autoComplete = [{collection: [], element: null}];
            $scope.index = null;

            //initial value to build the form
            $scope.operations = [{ addition: null, attribute: null, operator: '=', value: null }];

            $scope.updateOperation = function (index){
                $scope.index = index;
                $scope.autoCompleteActive = false;
                $scope.changeoperation();
                
                const op = $scope.operations[index];

                if (document.activeElement != document.getElementById('input_waarde') && op.attribute != null){
                    var prom = ExecuteEmptyAutoCompleteQuery();

                    prom.then(function(arg) {
                        if(arg && arg.error == undefined && arg.featureCollection.features != null) {
                            const result = GetAutoCompleteValue(arg.featureCollection.features);
                            $scope.autoComplete[$scope.index].collection = result.filter(onlyUnique);
                        } else {
                            $scope.autoComplete[$scope.index].collection = [];
                        }
                    });
                }
            };

            $scope.$on('updateFields', function (event, data) {
                $scope.attributes = data.fields;
                for (let index = 0; index < $scope.attributes.length; index++) {
                    const element = $scope.attributes[index];
                    if (element.name.toLowerCase() != element.alias.toLowerCase()) {
                        element.displayName = element.name + " (" + element.alias + ")";
                    } else {
                        element.displayName = element.name;
                    }
                }
            })

            $scope.$on('addOperation', function () {
                $scope.operations.push(
                    { addition: 'AND', attribute: '', operator: '=', value: '' }
                );
                $scope.autoComplete.push(
                    { collection: [], element: null }
                );
                $scope.changeoperation();
            })

            $scope.$on('orOperation', function () {
                $scope.operations.push(
                    { addition: 'OR', attribute: '', operator: '=', value: '' }
                );
                $scope.autoComplete.push(
                    { collection: [], element: null }
                );
                $scope.changeoperation();
            })

            $scope.delete = function (index) {
                if (index !== 0) {
                    $scope.operations.splice(index, 1);
                    $scope.autoComplete.splice(index, 1);
                }
                $scope.changeoperation();
            };

            $scope.up = function (index) {

                var op = $scope.operations[index];
                var ac = $scope.autoComplete[index];
                if (index == 1) {
                    op.addition = null;
                    $scope.operations[0].addition = "AND";
                }
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index - 1, 0, op);

                $scope.autoComplete.splice(index, 1);
                $scope.autoComplete.splice(index - 1, 0, ac);
                $scope.changeoperation();
            };

            $scope.down = function (index) {
                var op = $scope.operations[index];
                var ac = $scope.autoComplete[index];
                if (index == 0) {
                    op.addition = "AND";
                    $scope.operations[1].addition = null;
                }
                
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index + 1, 0, op);

                $scope.autoComplete.splice(index, 1);
                $scope.autoComplete.splice(index + 1, 0, ac);
                $scope.changeoperation();
            };

            $scope.changeoperation = function() {
                $scope.$emit('addedOperation', $scope.operations);
                setTimeout(function() {
                    var op = $scope.operations[$scope.index];
                    if (op.attribute != null) {
                        initializeTypeahead();
                    }
                }, 100);
            };

            $scope.valueChanged = function (index) {
                $scope.index = index;
            };

            var ExecuteEmptyAutoCompleteQuery = function() {
                var queryParams = SearchAdvancedService.BuildAutoCompleteQuery('', $scope.index);
                return MapService.startAutoComplete(queryParams.layer, queryParams.attribute, queryParams.query);
            }

            var FillAutoComplete = function(query, syncResults, asyncResults) {
                var docId = document.activeElement.id.replace("input_waarde_", '');
                if(parseInt(docId) !== $scope.index){
                    $scope.index = parseInt(docId);
                    query = document.activeElement.value;
                    var element = document.getElementById("input_waarde_" + docId);
                    element.value = document.activeElement.value;
                }
                if($scope.index != null) {
                    var queryParams = SearchAdvancedService.BuildAutoCompleteQuery(query, $scope.index);
                    MapService.startAutoComplete(queryParams.layer, queryParams.attribute, queryParams.query)
                        .then(function(arg) {
                            if(arg && arg.error == undefined && arg.featureCollection.features != null) {
                                const result = GetAutoCompleteValue(arg.featureCollection.features);
                                $scope.autoComplete[$scope.index].collection = result.filter(onlyUnique);
                            } else {
                                $scope.autoComplete[$scope.index].collection = [];
                            }
                            asyncResults($scope.autoComplete[$scope.index].collection);
                    });
                } else {
                    syncResults($scope.autoComplete[$scope.index].collection);
                }
            }

            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }

            var GetAutoCompleteValue = function(collection) {
                var returnCollection = [];
                collection.forEach(element => {
                    returnCollection.push(element.properties[$scope.operations[$scope.index].attribute.name]);
                });
                return returnCollection;
            }
            
            var suggestionfunc = function(item) {
                return "<div>" + item + "</div>";
            }
      
            var initializeTypeahead = function() {
                if ($scope.index == null) $scope.index = 0;

                if ($scope.autoComplete[$scope.index].element == null){
                    var acElement = $('#input_waarde_' + $scope.index);
                    acElement.typeahead({
                        minLength: 0
                        },
                        {
                            async: true,
                            name: 'autoComplete',
                            limit: 10,
                            source: FillAutoComplete,
                            templates : { 
                                suggestion: suggestionfunc,
                                notFound: ['<div class="empty-message"><b>Geen resultaten gevonden</b></div>']
                                }
                    });

                    acElement.on('focus');
                    acElement.bind('typeahead:select', function(ev, suggestion) {
                        $scope.operations[$scope.index].value = suggestion;
                      });
                    $scope.autoComplete[$scope.index].element = acElement;
                    
                }
            }

            setTimeout(function(){ 
                initializeTypeahead();
              }, 100);
        }]);
    theController.$inject = ['$scope', 'SearchAdvancedService', 'MapService'];
})();

