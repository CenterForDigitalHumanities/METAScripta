/* global metascripta, angular */
metascripta.controller('testController', function ($filter, $scope, Manuscripts, Lists, dataService) {
    $scope.ms = Manuscripts;
    $scope.testms = function(prefix) {
        return Manuscripts.filter(ms=>ms.collection===prefix)
    }
});