angular.module('defaultTable', [], function($interpolateProvider) {
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

angular.module('defaultTable').controller("defaultTableCtrl", function($scope, $http){
	  $scope.offset 	= 0;
	  $scope.orderBy = false;
	  var token = $scope.token;
	  var urlList 	= $scope.urlList;
	  var lista = lista;
	  
	  $scope.linhas 	= [];
	  
	  $scope.filterDataTable =  function (orderBy, modelFilter, limit, offset, evento){
		  
			if(evento.type == "click")
				$scope.orderByTarget = evento.currentTarget.id;
				
			$scope.orderBy = orderBy;
			var orderByTarget = $scope.orderByTarget;
			
			if(orderBy)
				orderBy = "asc";
			else
				orderBy = "desc";
			
			
			//INCLUIR NG-MODEL NA DIRECTIVA
			$scope.limit = limit;
			$scope.modelFilter = modelFilter;
			
			var data = {
				orderByTarget:orderByTarget, 
				orderBy: orderBy, 
				_token:token, 
				modelFilter:modelFilter, 
				limit: limit,
				offset: offset
			};
			
			$http({
			  async: false,
			  method: 'POST',
			  data:  data,
			  url: urlList+"/filter-data-table",
			}).then(function successCallback(response) {
					$scope.lista = response.data.data;
					
					if(evento.type == "keyup")
						$scope.total = response.data.total ? response.data.total : $scope.total;
						
			  }, function errorCallback(response) {
				  console.log(response.error);
			  });
		 };
		 
    	$scope.setPagesNumber = function(total, limit){
    		var perPage = total/limit;
    		var number_pages = Math.ceil(perPage);
    		$scope.perPage = perPage;
    		$scope.number_pages = number_pages;
    		
    		var pagination = [];
    		
    		if(number_pages > 1){
    			for(var i=1; i<=number_pages; i++){
    				pagination.push(i);
    			}
    		}
    		
    		return pagination;
    	};
    	
    	$scope.selectPage = function(n, total, perPage, number_pages, limit, orderBy, modelFilter){
    		var offset = limit*(n-1);		
    		$scope.filterDataTable(orderBy, modelFilter, limit, offset, {});
    	};
    	
    	$scope.redirecionar = function(url){
			window.location.href = url;
		};
		
		
		$scope.deletar = function(lista, linhas){
				var selected = [];
				
				if(linhas != {})
					for (var i in linhas)
						selected.push(parseInt(i));
				
				if(selected.length > 0){
					ajaxAPI.deleteAll(selected, token, urlList+"/delete-all", function(response){
						
						if(response.data.success){
							lista = lista.filter(function(obj){
								if(selected.indexOf(obj.id) == -1) return obj;
							});
							
							$$scope.lista = lista;
							
						} else {
							message.classe = "alert alert-danger";
							message.title = "Erro!"
							message.message = "Erro ao deletar!";
							message.show 	= true;
						}
						
						
					}, function(response){
						console.log(response.data.error);
						message.classe = "alert alert-danger";
						message.title = "Erro!"
						message.message = "Erro na requisição!";
						message.show 	= true;
					});
				}	
			};

			$scope.nullCamp = function(value = null){
				if(value == 0 || value.length == 0)
					return true;
				return false;
			};
			
			this.setLista = function(lista){
				lista = lista;
			}
});

angular.module('defaultTable').directive('defaultTable', function(){
		    return {
		      restrict: 'EA',
		      templateUrl: '/default-table',
		      transclude: true,
		      scope: {
		    	lista: '=defaultTableLista',
		    	columns: '=defaultTableColumnColumns',
		    	token: '@defaultTableToken',
		    	urlList: '@defaultTableUrlList',
		    	orderByTarget: '@defaultTableOrderBy',
		    	limit: '=defaultTableLimit',
		        total: '=defaultTableTotal',
		        columnId:'@defaultTableColumnId',
		        columnAction:'@defaultTableColumnAction',
		        columnActionUrl:'@defaultTableColumnActionUrl',
		        columnActionMethod:'&defaultTableColumnActionMethod',
		        columnActionClass:'@defaultTableColumnActionClass',
		        columnActionLabel:'@defaultTableColumnActionLabel',
		        columnCheckbox:'=defaultTableColumnCheckbox',
		        checkboxModel:'=defaultTableCheckboxModel',
		        buttonActions:'=defaultTableButtonActions',
		        selectLinePerPage:'=defaultTableSelectLinePerPage',
		        selectLinePerPageValues:'=defaultTableSelectLinePerPageValues',
		      },
		      controller: "defaultTableCtrl",
		      link: function(scope, element, attrs, ctrl){
		    	
		    	  scope.getColumns = function(columnCheckbox, columnAction, columns){
		    		  var checkbox 	= scope.columnCheckbox 	? 1 : 0;
		    		  var action	= scope.columnAction 	? 1 : 0;
		    		  return columns+action+checkbox;
		    	  }
		    	  
		    	  scope.columnActionSwitch = "url";
		    	  scope.columnActionSwitch = scope.columnActionUrl ? "url" : "method";
		    	  ctrl.setLista(scope.lista);
		    	  
		      },
		    };
	 });

angular.module('defaultTable').directive('defaultTableActionButton', function(){
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		require: '^defaultTable',
		template: '<li><a ng-click="url ? redirecionar(url) : (customDelete ? deletar() : action)"><i class="{:icone:}"></i>{:label:}</a></li>',
		scope: {
			action: 		"&defaultTableActionButtonMethod",
			url: 			"@defaultTableActionButtonUrl",
			label: 			"@defaultTableActionButtonLabel",
			icone: 			"@defaultTableActionButtonIcone",
			customDelete: 	"@defaultTableActionButtonCustomDelete",
		},
		controller: "defaultTableCtrl",
		link:	function(scope, element, attrs, ctrl){
			console.log(ctrl.lista);
		}
	}
});
//	angular.module('defaultTable').directive('defaultTableColumnThFilter', function(){
//		return {
//			restrict: 'EA',
//			require: '^defaultTable',
//			transclude: true,
//			replace: true,
//			template: 		'<th style="{:style:}">'+
//							'<input type="text" class="form-control" ng-model="modelFilter[id]" ng-if="type==\'input\'" ng-keyup="filterDataTable(orderBy, modelFilter, limit, offset,  $event)">'+
//							'<select class="form-control" ng-model="modelFilter[id]" ng-if="type==\'select\'" ng-options="v.id as v.descricao in values" ng-keyup="filterDataTable(orderBy, modelFilter, limit, offset,  $event)">'+
//							'</th>',
//			scope: {
//				style: "=defaultTableColumnThFilterStyle",
//				id: "=defaultTableColumnThFilterId",
//				type: "@defaultTableColumnThFilterType",
//				values: "=defaultTableColumnThFilterValues",
//			},
//		}
//	});
//	angular.module('defaultTable').directive('defaultTableColumnTh', function(){
//		return {
//			restrict: 'EA',
//			transclude: true,
//			require: '^defaultTable',
//			template: '<th style="{:style:}" ng-transclude></th>',
//			scope: {
//				style: "=defaultTableColumnThFilterStyle",
//				id: "=defaultTableColumnThFilterId",
//				type: "@defaultTableColumnThFilterType",
//				values: "=defaultTableColumnThFilterValues",
//			},
//		}
//	});
	
	
	
	
