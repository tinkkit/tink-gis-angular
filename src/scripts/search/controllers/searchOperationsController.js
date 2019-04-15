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
            $scope.autoComplete = [];
            $scope.index = null;

            //initial value to build the form
            $scope.operations = [{ addition: null, attribute: null, operator: '=', value: null }];

            $scope.updateOperation = function (index){
                $scope.index = index;
                $scope.autoCompleteActive = false;
                $scope.changeoperation();
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
                $scope.changeoperation();
            })

            $scope.$on('orOperation', function () {

                $scope.operations.push(
                    { addition: 'OR', attribute: '', operator: '=', value: '' }
                );
                $scope.changeoperation();
            })

            $scope.delete = function (index) {
                console.log(index);
                if (index !== 0) {
                    $scope.operations.splice(index, 1);
                }
                $scope.changeoperation();
            };

            $scope.up = function (index) {

                var op = $scope.operations[index];
                if (index == 1) {
                    op.addition = null;
                    $scope.operations[0].addition = "AND";
                }
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index - 1, 0, op);
                $scope.changeoperation();
            };

            $scope.down = function (index) {

                var op = $scope.operations[index];
                if (index == 0) {
                    op.addition = "AND";
                    $scope.operations[1].addition = null;
                }
                
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index + 1, 0, op);
                $scope.changeoperation();
            };

            $scope.changeoperation = function() {
                $scope.$emit('addedOperation', $scope.operations);
            };

            $scope.valueChanged = function (index) {
                $scope.index = index;
            };
      
              setTimeout(function(){ 
                console.log("letsgo qrtyq");
                console.log($('.typeaheadsearchoperations'));
                var suggestionfunc = function(item) {
                    console.log("ok");
                    return "<div>" + item.properties[$scope.operations[$scope.index].attribute.name] + "</div>";
                }
          var abc =  $('.typeaheadsearchoperations').typeahead({
              classNames: {
                  input: 'tt-input-querybuild',
                  hint: 'tt-hint-querybuild'
              }
              },
              {
                async: true,
                name: 'autoComplete',
                  source: function (query, syncResults, asyncResults) {
                      if($scope.index != null) {
                            var queryParams = SearchAdvancedService.BuildAutoCompleteQuery(query, $scope.index);

                            var prom = MapService.startAutoComplete(queryParams.layer, queryParams.attribute, queryParams.query);
                            prom.then(function(arg) {
                                if(arg && arg.featureCollection.features != null) {
                                    $scope.autoComplete = arg.featureCollection.features;
                                } else {
                                    $scope.autoComplete = [];
                                }
                                asyncResults($scope.autoComplete);
                            });
                      } else {
                          syncResults([]);
                      }
                  },
                  templates : { suggestion: suggestionfunc}
              });

           
              console.log(abc);
              }, 500);
         
        }]);
    theController.$inject = ['$scope', 'SearchAdvancedService', 'MapService'];
})();

