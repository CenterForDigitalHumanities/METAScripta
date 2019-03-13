/* global metascripta, angular */
metascripta.controller('testController', function ($filter,$q,$rootScope,$timeout, $controller, $scope, Manuscripts, Lists, dataService, msid) {
    $scope.ms = Manuscripts;
    $scope.testms = function(prefix) {
        return Manuscripts.filter(ms=>ms.collection===prefix).sort(function(a,b){return parseInt(a.codex) > parseInt(b.codex) ? 1 : -1})
    }
    $scope.data = $controller('dataController',{msid:msid,$scope:$scope})
    $scope.getLink = function(event,ms) {
        let elem = event.target
        elem.classList.add("label-warning")
        return dataService.BAVlink(ms).then(function(){
            elem.classList.add("label-success")
        }, function(){
            elem.classList.add("label-danger")
        }).finally(function(){
            elem.classList.remove("label-default","label-warning")
            $rootScope.$broadcast("discovered", elem.nextElementSibling)
        })
    }
    $scope.$on("discovered",function(event,elem){
        if(elem === null) {
            elem = document.getElementsByClassName("label-default")[0]
        }
        if(elem !== null){
            $timeout(function() {
                elem.click()
            })
        } else {
            alert("Finished!")
        }
    })
});