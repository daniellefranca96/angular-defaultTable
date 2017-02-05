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

});


angular.module('defaultTable').directive('defaultTable', function ($filter, $http) {
    return {
        restrict: 'EA',
        templateUrl: 'defaultTable.html',
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
            customFilterMethod: '&?defaultTableCustomFilterMethod',
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
            checkAction: '&?defaultTableColumnCheckAction',
            buttonActions: '=defaultTableButtonActions',
            message: '=defaultTableMessage',
            selectLinePerPage: '=defaultTableSelectLinePerPage',
            selectLinePerPageValues: '=defaultTableSelectLinePerPageValues',
        },
        link: function (scope, element, attrs, ctrl) {

            var token = scope.token;
            var urlList = scope.urlList;
            var lista = lista;
            var urlFilter = scope.customFilterUrl ? scope.customFilterUrl : "/filter-data-table";

            scope.offset = 0;
            scope.orderBy = false;
            scope.columnActionSwitch = "url";
            scope.columnActionSwitch = scope.columnActionUrl ? "url" : "method";
            scope.ajax = scope.filterAjax ? scope.filterAjax : true;
            scope.modelFilter = {};
            scope.selected = [];

            scope.setSelected = function (elemento, status, columnId) {
                if (status)
                    scope.selected.push(elemento);

                else {
                    scope.selected = scope.selected.filter(function (m) {
                        if (m[columnId] != elemento[columnId]) return true;
                    })
                }
            }

            scope.actionButton = function (selected, action) {
                if (action.customMethod == "customChangeStatus")
                    customChangeStatus(selected, action.customMethodAction);
                else
                    action.method({elements: selected});

            }

            function customChangeStatus(selected, customMethodAction) {
                $http({
                    async: false,
                    method: 'POST',
                    data: {selected: selected, _token: token, customMethodAction: customMethodAction},
                    url: urlList + "/change-status-all",
                }).then(function successCallback(response) {
                    var orderBy = scope.orderBy;
                    var modelFilter = scope.modelFilter;
                    var limit = scope.limit;
                    var offset = scope.offset;
                    var fixedSearchParams = scope.fixedSearchParams;
                    var relations = scope.relations;

                    scope.filterDataTable(orderBy, modelFilter, limit, offset, {type: "keyup"}, fixedSearchParams, relations);

                    scope.selected = [];

                }, function errorCallback(response) {
                    console.log(response.error);
                });
            }

            scope.filterDataTable = function (orderBy, modelFilter, limit, offset, evento, searchParams, relations, customFilterMethod, $filter) {

                if (evento.type == "click")
                    scope.orderByTarget = evento.currentTarget.id;

                scope.orderBy = orderBy;
                var orderByTarget = scope.orderByTarget;

                if (orderBy)
                    orderBy = "asc";
                else
                    orderBy = "desc";


                //INCLUIR NG-MODEL NA DIRECTIVA
                scope.limit = limit;
                scope.modelFilter = modelFilter;

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

                if(angular.isDefined(customFilterMethod)){
                    customFilterMethod();

                } else {
                    $http({
                        async: false,
                        method: 'POST',
                        data: data,
                        url: urlList + urlFilter,
                    }).then(function successCallback(response) {
                        scope.lista = response.data.data;

                        if (evento.type == "keyup")
                            scope.total = response.data.total ? response.data.total : scope.total;

                    }, function errorCallback(response) {
                        console.log(response.error);
                    });
                }
            };

            scope.setPagesNumber = function (total, limit) {
                var perPage = total / limit;
                var number_pages = Math.ceil(perPage);
                scope.perPage = perPage;
                scope.number_pages = number_pages;

                var pagination = [];

                if (number_pages > 1) {
                    for (var i = 1; i <= number_pages; i++) {
                        pagination.push(i);
                    }
                }

                return pagination;
            };

            scope.selectPage = function (n, total, perPage, number_pages, limit, orderBy, modelFilter, fixedSearchParams, relations, customFilterMethod) {
                var offset = limit * (n - 1);
                scope.filterDataTable(orderBy, modelFilter, limit, offset, {}, fixedSearchParams, relations, customFilterMethod);
            };

            if (scope.toggle) {

                scope.toggleClick = [];

                l = [];

                if (scope.listaData.length > 0) {
                    angular.forEach(scope.listaData, function (value) {
                        l.push(value);
                        var toggle = {toogle: true, value: value[scope.toogleId], id: value[scope.columnId]};
                        l.push(toggle)

                    });
                }

                scope.lista = l;

            } else
                scope.lista = scope.listaData;


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
                var checkbox = scope.columnCheckbox ? 1 : 0;
                var action = scope.columnAction ? 1 : 0;
                var toogle = scope.toggle ? 1 : 0;
                var columns = scope.columns.length;
                return columns + action + checkbox + toogle;
            }

            scope.redirecionar = function (url) {
                window.location.href = url;
            };

            scope.getFilters = function(columns){
                filters = {};

                if(columns.length>0){
                    angular.forEach(columns, function(c){
                        if(c.type == undefined && c.filter != false)
                            filters[c.id] = scope.modelFilter[c.id];
                    });
                }

                return filters;
            }

            scope.filterOrderBy = function(column){
                scope.orderByTarget = scope.orderBy ? "-"+column : "+"+column;
                scope.orderBy = !scope.orderBy;
            }

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

	
	
	
