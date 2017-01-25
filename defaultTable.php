<div class="row">
	<div class="col-md-4" ng-if="buttonActions">
	    <div class="btns-group">
	        <div class="btn-group actions">
	          <a class="btn btn-primary" href="javascript:void(0)">
	            <i class="fa fa-cogs"></i> Ações
	          </a>
	          <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
	            <span class="fa fa-caret-down"></span>
	          </a>
	          <ul class="dropdown-menu" ng-transclude>
	          </ul>
	        </div> <!-- btn-group ::end::-->
	      </div> <!-- btns-group ::end::-->
	</div>
	<div class="col-md-2 pull-right" ng-if="selectLinePerPage && selectLinePerPageValues.length>0">
		<select ng-model="limit" class="form-control" ng-change="filterDataTable(orderBy, modelFilter, limit, offset, {})" ng-options="x for x in selectLinePerPageValues">
		</select>
	</div>
</div>
<br>
<table class="table table-bordered table-hover" role="grid" ng="lista.length">
	<thead>
		<tr>
			<th width="5%" ng-if="columnCheckbox"></th>
			<th ng-repeat="t in columns"><a id="{:t.id:}" ng-click="filterDataTable(!orderBy, modelFilter, limit, offset,  $event)">{:t.descricao:}</a></th>
			<th ng-if="columnAction"></th>
		</tr>
		<tr>
			<th width="5%" ng-if="columnCheckbox"></th>
			<th ng-repeat="t in columns">
				<input type="text" class="form-control" ng-model="modelFilter[t.id]"  ng-keyup="filterDataTable(orderBy, modelFilter, limit, offset,  $event)">
			</th>
			<th ng-if="columnAction"></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="l in lista track by $index">
			<td ng-if="columnCheckbox"><input type="checkbox" ng-model="linhas[l[columnCheckboxId]]"></td>
			<td ng-repeat="c in columns">{:(l[c.id].length != 0 && l[c.id]) ? l[c.id] : (c.null != undefined ? c.null : "-") :}</td>
			<td align="middle" width="5%">
				<a href="{:columnActionUrl+'/'+l[columnId]:}" class="btn {:columnActionClass:}" ng-show="columnActionSwitch == 'url'">
					{:columnActionLabel:}
				</a>
				<a ng-click="columnActionMethod({elemento: l})" class="btn {:columnActionClass:}" ng-hide="columnActionSwitch == 'url'">
					{:columnActionLabel:}
				</a>
			</td>
		</tr>
		<tr ng-if="lista.length == 0">
			<td colspan="{:getColumns(columnCheckbox, columnAction, columns.length):}" style="font-weight:bold;fontsize:16px;" align="middle">Não há dados cadastrados!</td>
		</tr>
	</tbody>
</table>
<ul class="pagination">
  <li ng-repeat="n in setPagesNumber(total, limit)"><a ng-click="selectPage(n, total, perPage, number_pages, limit, orderBy, modelFilter)">{:n:}</a></li>
</ul>

