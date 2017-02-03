<div class="row">
    <div class="col-md-4" ng-if="buttonActions.length > 0">
        <div class="btns-group">
            <div class="btn-group actions">
                <a class="btn btn-primary" href="javascript:void(0)">
                    <i class="fa fa-cogs"></i> Ações
                </a>
                <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                    <span class="fa fa-caret-down"></span>
                </a>
                <ul class="dropdown-menu">
                    <li ng-repeat="a in buttonActions">
                        <a ng-click="a.url ? redirecionar(a.url) : actionButton(selected, a)"><i class="{:a.icone:}"></i>{:a.label:}</a>
                    </li>
                </ul>
            </div> <!-- btn-group ::end::-->
        </div> <!-- btns-group ::end::-->
    </div>
</div>
<br>
<table class="table table-bordered table-hover" role="grid" ng="lista.length" ng-init="toggleClick = []">
    <thead>
   <!-- HEADER-->
    <tr>
        <th width="5%" ng-if="columnCheckbox"></th>
        <th width="5%" ng-if="toggle"></th>
        <th ng-repeat="t in columns">
            <a ng-if="(filterAjax || filterAjax == undefined)" id="{:t.id:}"
                    ng-click="filterDataTable(!orderBy, modelFilter, limit, offset,  $event, fixedSearchParams, relations, customFilterMethod)">{:t.descricao:}</a><span ng-if="filterAjax == false">{:t.descricao:}</span></th>
        <th ng-if="columnAction"></th>
    </tr>
   <!--FILTER-->
    <tr ng-if="filterAjax || filterAjax == undefined">
        <th width="5%" ng-if="columnCheckbox"></th>
        <th ng-if="toggle"></th>
        <th ng-repeat="t in columns">
            <input ng-if="(t.filter == undefined || t.filter !== false) && (!t.filterType || t.filterType === 'input')"
                   type="text" class="form-control" ng-model="modelFilter[t.id]"
                   ng-keyup="filterDataTable(orderBy, modelFilter, limit, offset,  $event, fixedSearchParams, relations, customFilterMethod)">
            <select ng-if="t.filterType === 'select'" ng-options="x.id as x.descricao for x in t.filterOptions"
                    class="form-control" ng-model="modelFilter[t.id]"
                    ng-change="filterDataTable(orderBy, modelFilter, limit, offset,  {type:'keyup'}, fixedSearchParams, relations, customFilterMethod)">
            </select>
        </th>
        <th ng-if="columnAction"></th>
    </tr>
    <tr ng-if="filterAjax == false">
        <th width="5%" ng-if="columnCheckbox"></th>
        <th ng-if="toggle"></th>
        <th ng-repeat="t in columns">
            <input ng-if="(t.filter == undefined || t.filter !== false) && (!t.filterType || t.filterType === 'input')"
                   type="text" class="form-control" ng-model="modelFilter[t.id]" ng-model="search">
            <select ng-if="t.filterType === 'select'" ng-options="x.id as x.descricao for x in t.filterOptions"
                    class="form-control" ng-model="modelFilter[t.id]" ng-model="search">
            </select>
        </th>
        <th ng-if="columnAction"></th>
    </tr>
    </thead>
    <tbody>
    <tr ng-repeat="l in lista | filter:search" align="{:columnsAlign:}">
       <!-- CHECKBOX-->
        <td ng-if="columnCheckbox && !l.toogle">
            <input type="checkbox"
                   ng-click="checkAction({elemento:l, status:selecionados[l[columnId]]}, setSelected(l, selecionados[l[columnId]], columnId))"
                   ng-model="selecionados[l[columnId]]">
        </td>
        <!--TOGGLE-->
        <th ng-if="!l.toogle && toggle">
            <span ng-click="toggleClick[l[columnId]] = !toggleClick[l[columnId]]" class="{:toggleClick[l[columnId]] ? toggleIconCollapse : toggleIconExpand:}"></span>
        </th>

       <!-- CONTENT-->
        <td ng-if="!l.toogle" align="{:c.tdAlign:}" ng-repeat="c in columns" ng-init="toggleClick[l[columnId]] = false">
            <span ng-class="c.tdTextClass" ng-style="c.tdTextStyle">{:getTdColumn(l, c):}</span>
        </td>
        <td align="middle" width="5%" ng-if="!l.toogle">
            <a href="{:columnActionUrl+'/'+l[columnId]:}" class="btn {:columnActionClass:}"
               ng-show="columnActionSwitch == 'url'">
                {:columnActionLabel:}
            </a>
            <a ng-click="columnActionMethod({elemento: l})" class="btn {:columnActionClass:}"
               ng-hide="columnActionSwitch == 'url'">
                {:columnActionLabel:}
            </a>
        </td>
        <td ng-if="l.toogle" colspan="{:getColumnsTotal():}" ng-show="toggleClick[l.id]">
            <table class="table table-bordered table-hover">
                <tr>
                    <th width="2%"></th>
                    <th ng-repeat="c in toggleColumns">{:c.descricao:}</th>
                </tr>
                <tr ng-repeat="v in l.value track by $index">
                    <td width="2%"></td>
                    <td align="{:tv.tdAlign:}" ng-repeat="tv in toggleColumns track by $index"><span
                                ng-class="tv.tdTextClass" ng-style="tv.tdTextStyle">{:getTdColumn(v, tv):}</span></td>
                </tr>
            </table>
        </td>
    </tr>
    <tr ng-if="lista.length == 0">
        <td colspan="{:getColumnsTotal():}"
            style="font-weight:bold;fontsize:16px;" align="middle">Não há dados cadastrados!
        </td>
    </tr>
    </tbody>
</table>
<div class="row">
    <div class="col-md-2 pull-right" ng-if="selectLinePerPage && selectLinePerPageValues.length>0">
        <select ng-model="limit" class="form-control"
                ng-change="filterDataTable(orderBy, modelFilter, limit, offset, {}, fixedSearchParams, relations, customFilterMethod)"
                ng-options="x for x in selectLinePerPageValues">
        </select>
    </div>
</div>
<ul class="pagination" ng-if="filterAjax || filterAjax == undefined">
    <li ng-repeat="n in setPagesNumber(total, limit)"><a
                ng-click="selectPage(n, total, perPage, number_pages, limit, orderBy, modelFilter, fixedSearchParams, relations, customFilterMethod)">{:n:}</a>
    </li>
</ul>

