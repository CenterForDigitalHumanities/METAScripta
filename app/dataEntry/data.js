/* global metascripta, angular */
metascripta.controller('dataController', function ($location, $filter, $scope, Manuscripts, Lists, msid) {
    $scope.ms = Manuscripts;
    $scope.search = {};
    $scope.show = {};
    if (msid) {
        $scope.show.currentManuscript = (msid === "new")
            ? {codex: "New Record"}
        : Lists.getAllByProp("id", msid, Manuscripts)[0];
        if ($scope.show.currentManuscript && !$scope.show.currentManuscript.images) {
            $scope.show.currentManuscript.images = [];
        }
    }
    $scope.searchConfig = {
        updateOn: 'default blur',
        debounce: {
            default: 250,
            blur: 0
        }
    };
    $scope.prefixes = (function(){
        return Lists.getAllPropValues('collection', Manuscripts);
    })();
    $scope.updateFilter = function (strict) {
        angular.forEach($scope.search, function (v, k) {
            if (!v)
                delete $scope.search[k];
        });
        $scope.filtered = $filter('filter')(Manuscripts, $scope.search, strict);
        if ($scope.search.roll) {
            $scope.filtered = $filter('filter')($scope.filtered, {roll: $scope.search.roll}, true);
        }
    };
    $scope.centuries = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800];
    $scope.countries = ["Germany", "Italy", "France", "England", "Spain", "Elbonia"];
    $scope.languages = ["Latin", "Klignon", "German", "Armenian"];
    $scope.addValue = function (arr, msg) {
        var newValue = prompt(msg);
        if (newValue) {
            arr.push(newValue);
        }
    };
    $scope.saveRecord = function (rec) {
        // TODO: Save record before adding to collection
        rec.id = (100000 * Math.random()) | 0;
        Manuscripts.push(rec);
        $scope.search = {
            collection: rec.collection,
            codex: rec.codex
        };
    };
});