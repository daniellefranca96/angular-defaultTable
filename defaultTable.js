angular.module('defaultTable', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{:');
    $interpolateProvider.endSymbol(':}');
});

//angular.module('defaultTable').provider('defaultTableProvider', function(){
//	var baseUrl = "";
//	
//	var setBaseUrl = function setBaseUrl(value){
//		baseUrl = value;
//	}
//	
//	var getBaseUrl = function setBaseUrl(){
//		return baseUrl;
//	}
//	
//	this.$get = function () {
//		return {
//			getBaseUrl:getBaseUrl,
//			setBaseUrl: setBaseUrl
//		};
//    };
//})

angular.module('defaultTable').controller("defaultTableCtrl", function ($scope, $http, $filter) {
    $scope.offset = 0;
    $scope.orderBy = false;
    var token = $scope.token;
    var urlList = $scope.urlList;
    var lista = lista;

    $scope.filterDataTable = function (orderBy, modelFilter, limit, offset, evento, searchParams, relations, $filter) {

        if (evento.type == "click")
            $scope.orderByTarget = evento.currentTarget.id;

        $scope.orderBy = orderBy;
        var orderByTarget = $scope.orderByTarget;

        if (orderBy)
            orderBy = "asc";
        else
            orderBy = "desc";


        //INCLUIR NG-MODEL NA DIRECTIVA
        $scope.limit = limit;
        $scope.modelFilter = modelFilter;

        var data = {
            orderByTarget: orderByTarget,
            orderBy: orderBy,
            _token: token,
            modelFilter: modelFilter,
            relations: relations,
            fixedSearchParams: searchParams,
            limit: limit,
            offset: offset
        };

        $http({
            async: false,
            method: 'POST',
            data: data,
            url: urlList + "/filter-data-table",
        }).then(function successCallback(response) {
            $scope.lista = response.data.data;

            if (evento.type == "keyup")
                $scope.total = response.data.total ? response.data.total : $scope.total;

        }, function errorCallback(response) {
            console.log(response.error);
        });
    };

    $scope.setPagesNumber = function (total, limit) {
        var perPage = total / limit;
        var number_pages = Math.ceil(perPage);
        $scope.perPage = perPage;
        $scope.number_pages = number_pages;

        var pagination = [];

        if (number_pages > 1) {
            for (var i = 1; i <= number_pages; i++) {
                pagination.push(i);
            }
        }

        return pagination;
    };

    $scope.selectPage = function (n, total, perPage, number_pages, limit, orderBy, modelFilter, fixedSearchParams, relations) {
        var offset = limit * (n - 1);
        $scope.filterDataTable(orderBy, modelFilter, limit, offset, {}, fixedSearchParams, relations);
    };

    $scope.redirecionar = function (url) {
        window.location.href = url;
    };

});

angular.module('defaultTable').directive('defaultTable', function ($filter) {
    return {
        restrict: 'EA',
        templateUrl: '/default-table',
        transclude: true,
        scope: {
            lista: '=defaultTableLista',
            columns: '=defaultTableColumnColumns',
            fixedSearchParams: '=defaultTableFixedSearchParams',
            relations: '=defaultTableRelations',
            token: '@defaultTableToken',
            urlList: '@defaultTableUrlList',
            orderByTarget: '@defaultTableOrderBy',
            limit: '=defaultTableLimit',
            total: '=defaultTableTotal',
            columnId: '@defaultTableColumnId',
            columnAction: '@defaultTableColumnAction',
            columnActionUrl: '@defaultTableColumnActionUrl',
            columnActionMethod: '&defaultTableColumnActionMethod',
            columnActionClass: '@defaultTableColumnActionClass',
            columnActionLabel: '@defaultTableColumnActionLabel',
            columnCheckbox: '=defaultTableColumnCheckbox',
            checkboxModel: '=defaultTableCheckboxModel',
            buttonActions: '=defaultTableButtonActions',
            selectLinePerPage: '=defaultTableSelectLinePerPage',
            selectLinePerPageValues: '=defaultTableSelectLinePerPageValues',
        },
        controller: "defaultTableCtrl",
        link: function (scope, element, attrs, ctrl) {


            scope.getTdColumn = function (v, c) {

                if (v[c.id]) {
                    if (c.value) {
                        index = c.value.split(".");

                        angular.forEach(index, function (value) {
                            v = v[value];
                        });
                    } else
                        v = v[c.id];


                    if (c.expression)
                        value = eval(c.expression.replace("{value}", v));
                    else if (v)
                        value = v;

                    if (c.filter && value) {
                        value = c.filter == 'date' ? new Date(value) : value;
                        var filter = $filter(c.filter);
                        value = filter(value, c.filterValue);
                    }
                } else
                    value = c.null ? c.null : "";


                return value;

            };


            scope.getColumnsTotal = function (columnCheckbox, columnAction, columns) {
                var checkbox = scope.columnCheckbox ? 1 : 0;
                var action = scope.columnAction ? 1 : 0;
                return columns + action + checkbox;
            }

            scope.columnActionSwitch = "url";
            scope.columnActionSwitch = scope.columnActionUrl ? "url" : "method";

        },
    };
});

angular.module('defaultTable').directive('defaultTableActionButton', function () {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        require: '^defaultTable',
        template: '<li><a ng-click="url ? redirecionar(url) : action({linhas:getLinhas()})"><i class="{:icone:}"></i>{:label:}{:getLinhas():}</a></li>',
        scope: {
            action: "&defaultTableActionButtonMethod",
            url: "@defaultTableActionButtonUrl",
            label: "@defaultTableActionButtonLabel",
            icone: "@defaultTableActionButtonIcone",
            customDelete: "@defaultTableActionButtonCustomDelete",
        },
        controller: "defaultTableCtrl",
        link: function (scope, element, attrs, ctrl) {

        }
    }
});

	
	
	
	
