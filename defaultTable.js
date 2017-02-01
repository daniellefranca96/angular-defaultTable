angular.module('defaultTable', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{:');
    $interpolateProvider.endSymbol(':}');
});

/*angular.module('defaultTable').provider('defaultTableProvider', function(){
 var baseUrl = "";

 var setBaseUrl = function setBaseUrl(value){
 baseUrl = value;
 }

 var getBaseUrl = function setBaseUrl(){
 return baseUrl;
 }

 this.$get = function () {
 return {
 getBaseUrl:getBaseUrl,
 setBaseUrl: setBaseUrl
 };
 };
 })*/

angular.module('defaultTable').controller("defaultTableCtrl", function ($scope, $http, $filter) {
    $scope.offset = 0;
    $scope.orderBy = false;
    var token = $scope.token;
    var urlList = $scope.urlList;
    var lista = lista;
    var urlFilter = $scope.customFilterUrl ? $scope.customFilterUrl : "/filter-data-table";

    $scope.filterDataTable = function (orderBy, modelFilter, limit, offset, evento, searchParams, relations, $filter) {

        console.log("aki");

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
            url: urlList + urlFilter,
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
            listaData: '=defaultTableLista',
            acess: '=defaultTableAcess',
            columns: '=defaultTableColumnColumns',
            columnsAlign: '@defaultTableColumnColumnsAlign',
            fixedSearchParams: '=defaultTableFixedSearchParams',
            relations: '=defaultTableRelations',
            token: '@defaultTableToken',
            urlList: '@defaultTableUrlList',
            orderByTarget: '@defaultTableOrderBy',
            toggle: '@defaultTableToggle',
            toogleId: '@defaultTableToggleId',
            toggleColumns: '=defaultTableToggleColumns',
            toggleIconExpand: '@defaultTableToggleIconExpand',
            toggleIconCollapse: '@defaultTableToggleIconCollapse',
            customFilterUrl: '@defaultTableCustomFilterUrl',
            limit: '=defaultTableLimit',
            total: '=defaultTableTotal',
            filterAjax: '=defaultTableAjax',
            columnId: '@defaultTableColumnId',
            columnAction: '@defaultTableColumnAction',
            columnActionUrl: '@defaultTableColumnActionUrl',
            columnActionMethod: '&defaultTableColumnActionMethod',
            columnActionClass: '@defaultTableColumnActionClass',
            columnActionLabel: '@defaultTableColumnActionLabel',
            columnCheckbox: '=defaultTableColumnCheckbox',
            checkAction: '&defaultTableColumnCheckAction',
            buttonActions: '=defaultTableButtonActions',
            selectLinePerPage: '=defaultTableSelectLinePerPage',
            selectLinePerPageValues: '=defaultTableSelectLinePerPageValues',
        },
        controller: "defaultTableCtrl",
        link: function (scope, element, attrs, ctrl) {

            if (scope.toggle) {

                scope.toggleClick = [];

                l = [];

                if (scope.listaData.length > 0) {
                    angular.forEach(scope.listaData, function (value) {
                        l.push(value);
                        var toggle = {toogle: true, value: value[scope.toogleId], id:value[scope.columnId]};
                        l.push(toggle)

                    });
                }

                scope.lista = l;

            } else
                scope.lista = scope.listaData;


            scope.ajax = scope.filterAjax ? scope.filterAjax : true;
            scope.checked = {};

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

            scope.getColumnsTotal = function () {
                var checkbox =      scope.columnCheckbox ? 1 : 0;
                var action =        scope.columnAction ? 1 : 0;
                var toogle =        scope.toggle ? 1 : 0;
                var columns =       scope.columns.length;
                return columns + action + checkbox+toogle;
            }

            scope.columnActionSwitch = "url";
            scope.columnActionSwitch = scope.columnActionUrl ? "url" : "method";


            if (scope.acess) {
                scope.acess.setChecked = function (checked) {
                    if (checked && checked.length > 0) {
                        angular.forEach(checked, function (value) {
                            scope.checked[value] = true;
                        });
                    }
                };
            }

        },
    };
});

angular.module('defaultTable').directive('defaultTableActionButton', function () {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        require: '^defaultTable',
        template: '<li><a ng-click="url ? redirecionar(url) : action(selecionados)"><i class="{:icone:}"></i>{:label:}{:getLinhas():}</a></li>',
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

	
	
	
