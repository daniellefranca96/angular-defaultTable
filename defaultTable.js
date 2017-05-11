angular.module('defaultTable', []);

angular.module('defaultTable').filter('renderHtml', function ($sce) {


    return function (stringToParse) {
        console.log(stringToParse);
        return $sce.trustAsHtml(stringToParse);
    }

});

angular.module("defaultTable").config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] =     $('meta[name="csrf-token"]').attr('content')
}]);

angular.module('defaultTable').provider('defaultTableConfig', function ($interpolateProvider) {

    var options = {
        urlTemplate: 'defaultTable.html',
    };


    this.set = function (opts) {
        angular.extend(options, opts);
    };

    this.setInterpolationSymbols = function (startSymbol, endSymbol) {
        $interpolate.startSymbol(startSymbol);
        $interpolate.endSymbol(endSymbol);
    };


    this.$get = function () {
        return function () {
            return angular.copy(options);
        };
    };
})

angular.module('defaultTable').controller("defaultTableCtrl", function ($scope, $http, $filter) {

});

angular.module('defaultTable').directive('defaultTable', function ($filter, $http, defaultTableConfig) {
    return {
        restrict: 'EA',
        templateUrl: defaultTableConfig().urlTemplate,
        transclude: true,
        scope: {
            listData: '=defaultTableList',
            acess: '=defaultTableAcess',
            columns: '=defaultTableColumnColumns',
            columnsAlign: '@defaultTableColumnColumnsAlign',
            fixedSearchParams: '=defaultTableFixedSearchParams',
            relations: '=defaultTableRelations',
            checkedValues: '=defaultTableCheckedValues',
            trStyle: '=defaultTableTrStyle',
            trActionMethod: '&?defaultTableTrAction',
            urlList: '@defaultTableUrlList',
            customFilterMethod: '&?defaultTableCustomFilterMethod',
            orderByTarget: '@defaultTableOrderBy',
            toggle: '@defaultTableToggle',
            toggleId: '@defaultTableToggleId',
            toggleValuesId: '@defaultTableToggleValuesId',
            toggleColumns: '=defaultTableToggleColumns',
            toggleIconExpand: '@defaultTableToggleIconExpand',
            toggleIconCollapse: '@defaultTableToggleIconCollapse',
            toggleColumnId: '@defaultTableColumnId',
            customFilterUrl: '@defaultTableCustomFilterUrl',
            limit: '=defaultTableLimit',
            total: '=defaultTableTotal',
            filterAjax: '=defaultTableAjax',
            onlySelectedCheck: '=?defaultTableOnlySelected',
            onlySelectedLabel: '@defaultTableOnlySelectedLabel',
            checkAction: '&?defaultTableColumnCheckAction',
            columnId: '@defaultTableColumnId',
            buttonActions: '=defaultTableButtonActions',
            buttonActionsLabel: '@defaultTableButtonActionsLabel',
            buttonActionsClass: '@defaultTableButtonActionsClass',
            buttonActionsIcon: '@defaultTableButtonActionsIcon',
            selectPerPage: '=defaultTableSelectPerPage',
        },
        link: function (scope, element, attrs, ctrl) {

            var urlList = scope.urlList;
            var urlFilter = scope.customFilterUrl ? scope.customFilterUrl : "/filter-data-table";

            scope.offset = 0;
            scope.orderBy = scope.orderByTarget ? true : false;
            scope.columnActionSwitch = "url";
            scope.columnActionSwitch = scope.columnActionUrl ? "url" : "method";
            scope.buttonActionsLabel = scope.buttonActionsLabel ? scope.buttonActionsLabel : 'Actions';
            scope.buttonActionsClass = scope.buttonActionsClass ? scope.buttonActionsClass : 'btn btn-primary';
            scope.buttonActionsIcon = scope.buttonActionsIcon ? scope.buttonActionsIcon : 'fa fa-cogs';
            scope.onlySelectedLabel = scope.onlySelectedLabel ? scope.onlySelectedLabel : "Only Selected";
            scope.modelFilter = {};
            scope.checked = [];
            scope.d = {};
            scope.d.limit = scope.limit ? scope.limit : 5;
            scope.list = scope.listData;
            scope.selected = [];
            var checkedValues = [];

            scope.onlySelected = function (status) {
                if (status)
                    if (!scope.filterAjax) {
                        scope.list = scope.selected;
                    } else
                        scope.filterDataTable(scope.orderBy, scope.modelFilter, scope.d.limit, scope.offset, {type: "keyup"}, scope.fixedSearchParams, scope.relations, scope.customFilterMethod, true);
                else {
                    if (!scope.filterAjax)
                        scope.list = scope.listData;
                    else
                        scope.filterDataTable(scope.orderBy, scope.modelFilter, scope.d.limit, scope.offset, {type: "keyup"}, scope.fixedSearchParams, scope.relations, scope.customFilterMethod);
                }
            };

            scope.setSelected = function (elemento, status, columnId) {
                if (status) {
                    scope.selected.push(elemento);

                    if (checkedValues.indexOf(elemento[columnId]) == -1)
                        checkedValues.push(elemento[columnId]);


                } else {
                    scope.selected = scope.selected.filter(function (m) {
                        if (m[columnId] != elemento[columnId]) return true;
                    });

                    var index = checkedValues.indexOf(elemento[columnId]);
                    if (index != -1)
                        delete checkedValues[index];
                }
            }

            scope.actionButton = function (selected, action) {

                if (action.customMethod == "customChangeStatus")
                    customChangeStatus(selected, action.customMethodAction);
                else {
                    var args = getArgs(action.method);
                    if (args.indexOf("selected") != -1)
                        action.method(selected);
                    else
                        action.method();
                }


            }

            function getArgs(func) {
                // First match everything inside the function argument parens.
                var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

                // Split the arguments string into an array comma delimited.
                return args.split(',').map(function (arg) {
                    // Ensure no inline comments are parsed and trim the whitespace.
                    return arg.replace(/\/\*.*\*\//, '').trim();
                }).filter(function (arg) {
                    // Ensure no undefined values are added.
                    return arg;
                });
            }

            function customChangeStatus(selected, customMethodAction) {
                if (selected.length > 0) {
                    $http({
                        async: false,
                        method: 'POST',
                        data: {selected: selected, customMethodAction: customMethodAction},
                        url: urlList + "/change-status-all",
                    }).then(function successCallback(response) {
                        var orderBy = scope.orderBy;
                        var modelFilter = scope.modelFilter;
                        var limit = scope.limit;
                        var offset = scope.offset;
                        var fixedSearchParams = scope.fixedSearchParams;
                        var customFilterMethod = scope.customFilterMethod;
                        var relations = scope.relations;
                        var oselected = scope.oselected;

                        scope.filterDataTable(orderBy, modelFilter, limit, offset, {type: "keyup"}, fixedSearchParams, relations, customFilterMethod, oselected);

                    }, function errorCallback(response) {
                        console.log(response.error);
                    });
                }
            }

            scope.filterDataTable = function (orderBy, modelFilter, limit, offset, evento, searchParams, relations, customFilterMethod, oselected) {

                if (evento.type == "click")
                    scope.orderByTarget = evento.currentTarget.id;

                scope.orderBy = orderBy;
                var orderByTarget = scope.orderByTarget;


                orderByTarget = orderByTarget ? orderByTarget : scope.columnId;
                orderBy = orderBy ? "asc" : "desc";


                var data = {
                    orderByTarget: orderByTarget,
                    orderBy: orderBy,
                    modelFilter: modelFilter,
                    relations: relations,
                    fixedSearchParams: searchParams,
                    limit: limit,
                    offset: offset,
                    onlySelected: oselected ? checkedValues : [],
                };

                if (angular.isDefined(scope.customFilterMethod)) {
                    scope.customFilterMethod({parameters: data});

                } else {
                    $http({
                        method: 'POST',
                        data: data,
                        url: urlList + urlFilter,
                    }).then(function successCallback(response) {

                        if (response.data.success) {
                            if (!oselected)
                                scope.listData = response.data.data;

                            scope.list = response.data.data;
                            setChecked(checkedValues);
                            scope.total = response.data.total;
                        }

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

            scope.selectPage = function (n, total, perPage, number_pages, limit, orderBy, modelFilter, fixedSearchParams, relations, customFilterMethod, oselected) {
                var offset = limit * (n - 1);
                scope.filterDataTable(orderBy, modelFilter, limit, offset, {}, fixedSearchParams, relations, customFilterMethod, oselected);
            };

            scope.getTdColumn = function (v, c) {

                var column = angular.copy(c);
                var value = "";

                if (column.id) {
                    if (column.value) {
                        index = column.value.split(".");

                        angular.forEach(index, function (value) {
                            if (v[value])
                                v = v[value];
                            else
                                throw Error("Index of column not exist");
                        });
                    } else
                        v = v[column.id] ? v[column.id] : "";


                    if (column.expression) {
                        value = eval(column.expression.replace("{value}", v));
                    } else if (column.html) {
                        value = column.html.replace("{value}", v);
                    } else if (v)
                        value = v;

                    if (column.afilters && value) {
                        angular.forEach(column.afilters, function (f, k) {
                            value = f.filter == 'date' ? new Date(value).setUTCHours(15) : value;
                            var filter = $filter(f.filter);

                            if (f.filterValue)
                                value = filter(value, f.filterValue.join(","));
                            else
                                value = filter(value);
                        });
                    }
                }

                if (!value)
                    value = column.null ? column.null : "";

                return value;

            };

            scope.getColumnsTotal = function () {
                var toogle = scope.toggle ? 1 : 0;
                var columns = scope.columns.length;
                return columns + toogle;
            }

            scope.redirecionar = function (url, value) {

                var parameters = url.match(/{[A-za-z]+}/);

                if (parameters && value) {
                    angular.forEach(parameters, function (p) {
                        id = p.replace("{", "").replace("}", "");
                        url = url.replace(p, value[id]);

                    });
                }

                window.location.href = url;
            };

            scope.getFilters = function (columns, filterAjax) {
                var filters = {};

                if (columns.length > 0 && !filterAjax) {
                    angular.forEach(columns, function (c) {
                        if (c.type == undefined && c.filter != false)
                            filters[c.id] = scope.modelFilter[c.id];
                    });
                }

                return filters;
            }

            scope.filterOrderBy = function (column) {
                scope.orderByTarget2 = scope.orderBy ? "-" + column : "+" + column;
                scope.orderBy = !scope.orderBy;
            }

            scope.trAction = function (linha, method) {
                if (angular.isDefined(method)) {
                    method({linha: linha});
                }
            }

            scope.verifyIf = function (c, elemento) {
                var nivelIf = c.ifColumn ? "ifColumn" : "if";

                if (c[nivelIf]) {
                    var expression = c[nivelIf];
                    var exp = expression.match(/{(.|\n)*?}/g);

                    if (exp && exp.length > 0) {
                        angular.forEach(exp, function (e) {
                            var column = e.replace("{").replace("}");
                            expression = expression.replace(e, elemento[column]);
                        });
                    }

                    return eval(expression);
                }

                return true;
            }

            getExecptions();

            function getExecptions() {

                if (!angular.isDefined(scope.columnId) && scope.filterAjax)
                    throw "The property columnId is obrigatory!";

                if (!angular.isDefined(scope.listData))
                    throw "The property list is obrigatory!";

                if (!angular.isDefined(scope.total))
                    throw "The property total is obrigatory!";

                if (scope.toggle) {
                    if (!angular.isDefined(scope.toggleId))
                        throw "The property toggleId is obrigatory!";
                    if (!angular.isDefined(scope.toggleColumnId))
                        throw "The property toggleColumnId is obrigatory!";
                }
            }

            function setChecked(checked) {
                if (checked && checked.length > 0) {
                    angular.forEach(checked, function (value) {
                        if (typeof value == 'object') {
                            scope.checked[value[scope.columnId]] = true;
                            if (checkedValues.indexOf(value[scope.columnId]) == -1)
                                checkedValues.push(value[scope.columnId]);

                        } else {
                            scope.checked[value] = true;
                            if (checkedValues.indexOf(value) == -1)
                                checkedValues.push(value);

                        }


                        var v = scope.listData.filter(function (e) {

                            var columnId = scope.columnId;

                            if (typeof value == 'object') {
                                if (e[columnId] == value[columnId])
                                    scope.selected.push(e);
                            } else {
                                if (e[columnId] == value)
                                    scope.selected.push(e);
                            }
                        });

                    });
                }

            };

            function refreshTable(data) {
                if (data != undefined) {
                    scope.listData = data;
                    scope.list = data;
                } else
                    scope.filterDataTable(scope.orderBy, scope.modelFilter, scope.d.limit, scope.offset, {type: "keyup"}, scope.fixedSearchParams, scope.relations, scope.customFilterMethod, scope.oselected);

                scope.selected = [];
                checkedValues = [];
            };

            function addNewLine(elemento) {
                scope.list.push(elemento);
            };

            function getSelected() {
                return scope.selected;
            }

            function setFixedParamns(fixedParams) {
                scope.fixedSearchParams = fixedParams;
            }

            function cleanChecked() {
                checkedValues = [];
                scope.selected = {};
                scope.checked = {};
            }


            if (scope.acess) {
                scope.acess.setChecked = setChecked;
                scope.acess.refreshTable = refreshTable;
                scope.acess.addNewLine = addNewLine;
                scope.acess.setFixedParamns = setFixedParamns;
                scope.acess.cleanChecked = cleanChecked;
                scope.acess.getSelected = getSelected;
            }

            if (scope.checkedValues && scope.checkedValues.length > 0)
                setChecked(scope.checkedValues);

        },
    };
});