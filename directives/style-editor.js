'use strict';

angular.module('tagyComponents')
  .directive('styleEditor', function (EditableMessageChannel,EditableStyleSer,markupChangeIdFac,EditHtmlService) {
    return {
      template: '<div style="overflow: scroll;height: 500px;display: block;">' +
          ' <ul style="list-style: none;">' +
          '<li ng-repeat="styleValueObj in editableStyleValues"><style-value-editor-dr style-Value-Obj="styleValueObj"></style-value-editor-dr></li>' +
          '</ul></div>',
      restrict: 'E',
        scope:{
            //editHtml:'@',
            //editableStyleValues:'='
        },
        link: function postLink(scope, element, attrs) {

            EditableMessageChannel.onEditableStyleItemAdded(scope,function(styleItem, updatedStyleItems){
                scope.editableStyleValues=updatedStyleItems
            })

            //var dontUpdateOnChangeId

            /*EditableMessageChannel.onEditableHtmlMarkupChange(scope,function(markup, changeId, markupWithEditFrameworkResources){
                if(changeId>dontUpdateOnChangeId||dontUpdateOnChangeId==null|| markupChangeIdFac.getMarkupChangeId(scope.editHtml)==null ) {
                    scope.editHtml=markup
                    scope.editableStyleValues= EditableStyleSer.getEditableValuesFromMarkup(markup)
                }
            })*/

            /*EditableMessageChannel.onStyleValueChange(scope, function(value){
                                                     ... add this listener in iframe and update html there & dispatch event
                var mkp=EditableStyleSer.updateMarkupWithNewValues(scope.editHtml,value)
                mkp=markupChangeIdFac.changeMarkupChangeId(mkp)
                dontUpdateOnChangeId=markupChangeIdFac.getCurrentChangeId(mkp)
                scope.editHtml=mkp
                EditHtmlService.editHtmlMarkup(mkp,false,scope.rootRelPagePath)
            })*/
      }
    };
  });
