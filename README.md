# angular-defaultTable

A table for AngularJs with sorting, filtering, pagination, ajax and more.<br/>

[Demo](https://plnkr.co/edit/9OkioBtUJo9czYxtC9Ob?p=preview)

## Requirements
- Angular 1.6 or higher
- Bootstrap 3

## Instalation

```<script src="defaultTable.js"></script>```

```angular.module("app", ["defaultTable"]);```

## Example Usage
```html
  <default-table
      default-table-limit="2"
      default-table-total="total"
      default-table-list="[
          {id:4, label:'Apple'},
          {id:2, label:'Microsoft'},
          {id:3, label:'Google'},
          {id:1, label:'Yahoo'},
          ]"
      default-table-column-columns="[
                                      {type:'checkbox'},
                                      {id:'id', label:'Id'},
                                      {id:'label', label:'Description'},
                                      {type:'action', buttonClass:'btn-primary', label:'Edit'},
                                      {type:'action', buttonClass:'btn-danger', label:'Delete'}
                                    ]"
      default-table-button-actions="[{icone:'fa fa-ban fa-fw', label:'Deletar'}]"
      default-table-select-line-per-page="true"
      default-table-select-line-per-page-values="[2, 5, 10]">
</default-table>
```
## Columns

The columns of the table are defined by the array of objects passed in the attribute `default-table-column-columns`.

### Data Column
The attributes avaliable in this object are:

- **Id**<br/>
Index of the column in the array of data(if you have want to acess a property inside a object then just type index.property)
```
{id:'name'}
{id:'adress.number'}
```
- **Label**<br/>
Label that is shown in the column header.
```
{id:'name', label:'Name'}
```

- **Text Class**<br/>
Defines a class to the text of the column.
```
{id:'name', label:'Name', tdTextClass:'defaultClass'}
```

- **Text Style**<br/>
Defines a style to the text of the column.
```
{id:'name', label:'Name', tdTextStyle:'color:blue'}
```
- **Column Align**<br/>
Defines the align of the column.
```
{id:'name', label:'Name', tdAlign:'right'}
```
- **Column Null Value**<br/>
Defines a default null value for the column.
```
{id:'name', label:'Name', null:'Empty'}
```
- **Column Expression**<br/>
Apply an expression in the column(use the mark {value} to represent the value of column).
```
{id:'name', label:'Name', tdAlign:'right', expression:'\'{value}\'.toUpperCase()'}
```
- **Column Angular Filters**<br/>
Apply an angular filter such as date or upperCase.
```
{id:'date', label:'Date', afilters:[{filter:'date', filterValue:['short']}]}
```

- **Column Filter**<br/>
Defines a filter to the column.<br/>
filter: boolen that defines if the column has or not a filter(the default value is true)<br/>
filterType(optional): defines the type of the filter input or select(the default value is input)<br/>
filterOptions(optional): defines the options of the select(the attributes id and label are mandatory)
```
{id:'category', label:'Category', filter:true, filterType:'select', filterOptions:[{id:'car', label:'Car'}, {id:'bike', label:'Bike'}]}
```

### Action Columns
type: defines the type of the column(checkbox or action)<br/>

**Checkbox**<br/>
action(optional): function to execute when checked.<br/>

```
$scope.defaultAction = function(element, status){
  console.log(element);
}
```

```
{type:'checkbox', action:defaultAction}
```
**Action**<br/>
label: label to be display on the button.<br/>
buttonClass(optional): class of the button.<br/>
buttonIcon(optional): icon of the button.<br/>
url(optional): url to redirect when clicked, to send parameters just mark then putting the id of the column between keys(example: {name}).<br/>
action(optional): function to be executed when clicked.

```
$scope.defaultAction = function(element){
  console.log(element);
}

{type:'action', buttonClass:'btn-primary', buttonIcon:'glyphicon glyphicon-pencil', label:'Edit'}
{type:'action', buttonClass:'btn-danger', label:'Delete', action:defaultAction}

```

## Options

### Limit
The attribute `default-table-limit` defines the limit of values displayed by page.<br/>

This value can be dynamic by using the attribute `default-table-select-per-page` that receives an array with the limit options.

### Columns Align
The attribute `default-table-column-columns-align` define a default align to all the columns.

### Line Style
The attribute `default-table-tr-style` define a style to the line.

### Line Action
The attribute `default-table-tr-action` receives a function to execute when the line is clicked.

### Ajax
The attribute `default-table-ajax` i a boolean the defines if the search for ajax is active, this features work together with this attributes below:<br/>

**Column Id(mandatory)**<br/>
The attribute `default-table-column-id` defines the line identifier.<br/>

**Url**<br/>
The attribute `default-table-url-list` defines the base url to the custom actions with ajax. Example: app/empresas/.<br/>

**Custom Filter URL**<br/>
The attribute `default-table-custom-filter-url` defines a custom filter url(the default is filter-data-table).<br/>

**Token**<br/>
The attribute `default-table-token` defines a token to be send in the request.<br/>

**Fixed Search Params**<br/>
The attribute `default-table-fixed-search-params` defines fixed search params to be send in the request.<br/>

**Relations**<br/>
The attribute `default-table-relations` receives an array of relations to be send in the request.<br/>

**Custom Filter Action**<br/>
The attribute `default-table-custom-filter-method` receives a custom filter function to be executed.<br/>

**Filter Object**<br/>
The object send in the ajax request or in the custom method:
````
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
```

### Toggle
The toggle feature display a another table under each line, in order to this to work your array of data must have another array of objects with the toggle values.

**Toggle**<br/>
The attribute `default-table-toggle` is a boolean that defines if the feature is active.<br/>

**Toggle Id**<br/>
The attribute `default-table-toggle-id` is the index of the toggle values in the data array.<br/>

**Toggle Columns**<br/>
The attribute `default-table-toggle-columns` array of objects with the same format and parameters of the one in the table.<br/>

**Toggle Icon Expand**<br/>
The attribute `default-table-toggle-icon-expand` defines the expand icon.<br/>

**Toggle Icon Collapse**<br/>
The attribute `default-table-toggle-icon-collpase` defines the collapse icon.<br/>


## Custom Template Url
In case of the template not be able to be included and generate an error, you can define a custom url.<br/>
P.S.: This must be used in Laravel, the template must be include in the routes to work.

```
app.config(["defaultTableConfig", function(defaultTableConfig) {
  defaultTableConfig.set({urlTemplate:'default-url'});
}]);
```

## License

MIT

















