/* global metascripta, angular */
metascripta.controller('dataController', function ($filter, $scope, Manuscripts, Lists, msid) {
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

metascripta.directive('record', function () {
    return {
        templateUrl: 'app/data_entry/record.html',
        restrict: 'E'
    };
});

metascripta.controller('recordController', function ($scope, $filter, dataService, Manuscripts) {
    $scope.imgSrc = (function () {
        return dataService.BAVlink($scope.m).then(function (link) {
            $scope.imgSrc = link;
        }, function () {
            $scope.imgSrc = null;
        });
    })();
    $scope.BAVMSlink = dataService.BAVMSlink;
    $scope.rolls = (function () {
        return $filter('filter')(Manuscripts, {collection: $scope.m.collection, codex: $scope.m.codex}, true).map(function (m) {
            return m.roll;
        });
    })();
});

metascripta.service('dataService', function ($q, $http) {
    var thumbCache = {};
    var dotList = function (str) {
        return str.split(" ").join(".").replace(/\.\./g, ".");
    };
    this.BAVMSlink = function (m) {
        var title = dotList(m.collection + m.codex);
        return "http://digi.vatlib.it/view/MSS_" + title;
    };
    this.BAVlink = function (m) {
        var title = dotList(m.collection + m.codex);
        if (thumbCache.hasOwnProperty(title)) {
            return thumbCache[title];
        }
        var link = "http://digi.vatlib.it/diglitData/introimage/MSS_" + title + ".jpg";
        //        head is returning a 200, but the error is firing...
//        return $http.head(link)
//            .then(function () {
//                return thumbCache[title] = link;
//            }, function () {
//            return undefined;
//        });
        var deferred = $q.defer();
        var i = new Image();
        i.onload = function () {
            deferred.resolve(thumbCache[title] = link);
        };
        i.onerror = function () {
            deferred.reject();
        };
        i.src = link;
        return deferred.promise;
    };
});