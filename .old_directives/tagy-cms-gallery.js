'use strict';

angular.module('tagyComponents')
    .directive('tagyCmsGallery', function ($compile, $rootScope, EditHtmlService, EditableMessageChannel, editableContentFactory, editableComponentFactory) {
        return {
            //template: '<div></div>',
            restrict: 'A',
            scope:{},
            replace:false,
            link: function postLink(scope, element, attrs) {
                scope.isGallery=true
                scope.editableComppp=false
                var gallItemTemplate=null
                var elHtml = element.html();
                var indexOfGIattr = elHtml.indexOf("tagy-cms-gallery-item");
                if(indexOfGIattr>0){
                    var itmTmplStart=elHtml.lastIndexOf('<',indexOfGIattr)
                    var itmTmplEnd=elHtml.indexOf("-->",indexOfGIattr)
                    if(itmTmplStart>-1 && itmTmplEnd>-1) {
                        gallItemTemplate=elHtml.substring(itmTmplStart,itmTmplEnd)
                    }

                }

                scope.removeElementWithEditableContent = function (fromElement){
                    fromElement=$(fromElement)

                    var edComps=[]
                    var editableComponentClass = editableComponentFactory.getViewComponentAttributeName()//"[tagy-cms-component]";
                    var editableCompDirect = editableComponentFactory.getViewComponentDirectiveName()//"tagyCmsComponent";
                    var isTopComponent=false
                    if(fromElement.is(editableComponentClass)){
                        edComps.push(fromElement)
                        isTopComponent=true
                    }else{
                        edComps=fromElement.find(editableComponentClass)
                    }

                    for (var i = 0; i < edComps.length; i++) {
                        var compEl = $(edComps[i]);
                        compEl.controller(editableCompDirect).remove(true)
                    }
                    if(!isTopComponent) {

                        var eContentObj = []
                        var editableContentClass = editableContentFactory.getViewComponentAttributeName()//"[tagy-cms-editable]";
                        var editableContentDirect = editableContentFactory.getViewComponentDirectiveName()//"tagyCmsEditable";
                        if (fromElement.is(editableContentClass)) {
                            eContentObj.push(fromElement)
                        } else {
                            eContentObj = fromElement.find(editableContentClass)
                        }
                        for (var i = 0; i < eContentObj.length; i++) {
                            var compEl = $(eContentObj[i]);
                            compEl.controller(editableContentDirect).remove(true)
                        }

                    }


                    EditableMessageChannel.dispatchUpdatedEvent(null, {element: fromElement})
                    fromElement.remove()
                }
                var showMoveGalleryElementControlsHandler=function(currScope){

                    return function(ev,valObj){
                        currScope.showMoveGalleryElementControls=true
                    }

                }

                var hideMoveGalleryElementControlsHandler=function(currScope){

                    return function(ev,valObj){
                        currScope.showMoveGalleryElementControls=false
                    }

                }

                var addGalleryControls=function(galleryItem){
                    var $galleryItem=$(galleryItem)
                    var controlsHol = $galleryItem.children(".tagy-cms-gallery-controls");

                    if(controlsHol.length<1) {
                        //var controlsHol = $("<div remove-in-production class='tagy-cms-gallery-controls' style='position: absolute;top: 0px;'><a tagy-cms-remove-gallery-item class='button tiny alert' href=''>-</a><a tagy-cms-add-gallery-item class='button tiny' href=''>+</a></div> ");
                        var controlsHol = $("<div remove-in-production class='tagy-cms-gallery-controls'>" +
                            "<style>[tagy-cms-gallery] .selected-item_remove-in-production{border:dotted 1px lime}.tagy-cms-gallery-controls .button.tiny{margin:0px;font-size:18px;padding-top: .12em;padding-bottom: .12em;padding-right: .5em;padding-left: .5em;}</style>" +
                            "<a tagy-cms-remove-gallery-item class='button tiny alert' href='' style='background-color: red;color: #ffffff;' title='remove item'><i class='fa fa-times-circle'></i></a>" +
                            "<a style='background-color: green; color: #ffffff;' tagy-cms-add-gallery-item class='button tiny' href='' title='duplicate item'><i class='fa fa-copy'></i></a>" +
                            "<a  ng-show='showMoveGalleryElementControls!=true' style='background-color: #808080; color: #ffffff;' tagy-cms-move-gallery-item class='button tiny' href='' title='cut and move item'><i class='fa fa-cut'></i></a>" +
                            "<a  ng-show='showMoveGalleryElementControls==true' style='background-color: #808080; color: #ffffff;' tagy-cms-move-gallery-item-before class='button tiny' href='' title='move to left of this item'><i class='fa fa-arrow-circle-left'></i></a>" +
                            "<a  ng-show='showMoveGalleryElementControls==true' style='background-color: #808080; color: #ffffff;' tagy-cms-move-gallery-item-after class='button tiny' href=''><i class='fa fa-arrow-circle-right' title='move to right of this item'></i></a>" +
                            "<a ng-show='showMoveGalleryElementControls==true' style='background-color: #808080; color: #ffffff;' tagy-cms-cancel-move-gallery-item class='button tiny' href='' title='undo move'><i class='fa fa-undo'></i></a>" +
                            "</div> ");
                        $compile(controlsHol)(scope);
                        $galleryItem.prepend(controlsHol)
                    }
                    $("[tagy-cms-add-gallery-item]",controlsHol).on("click",function(ev){

                        //if(!ev.isPropagationStopped()) {
                        var $newGItem
                        if( gallItemTemplate != null ){
                            $newGItem=$(gallItemTemplate)
                        } else{
                            var itmClone=$galleryItem.clone().wrap('<div>').parent().html()
                            itmClone=EditHtmlService.cleanRemoveInProductionCssClasses(itmClone)
                            $newGItem=$(EditHtmlService.cleanEditableMarkupWraps(itmClone))

                        }

                        addGalleryControls($newGItem)
                        $galleryItem.after($newGItem)
                        var newScope = scope.$new(true);
                        newScope.$on('tagy-cms-gallery:showMoveGalleryElementControls',showMoveGalleryElementControlsHandler(newScope))
                        newScope.$on('tagy-cms-gallery:hideMoveGalleryElementControls',hideMoveGalleryElementControlsHandler(newScope))
                        $compile($newGItem)(newScope);
                        EditableMessageChannel.dispatchUpdatedEvent(null, {element: $galleryItem})
                        $rootScope.$apply()
                        ev.preventDefault()
                        if (ev && ev.stopPropagation)ev.stopPropagation()
                        if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                        // }
                    })
                    $("[tagy-cms-remove-gallery-item]",controlsHol).on("click",function(ev){

                        if (confirm("You want to delete this?")) {
                            scope.removeElementWithEditableContent($galleryItem)
                            $rootScope.$apply()
                            ev.preventDefault()
                            if (ev && ev.stopPropagation)ev.stopPropagation()
                            if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                        }
                        // }
                    })

                    $("[tagy-cms-move-gallery-item]",controlsHol).on("click",function(ev){
                        $("#tagy-cms-gallery-element-selected-to-move").removeAttr("id")
                        var moveEl=$galleryItem.attr('id','tagy-cms-gallery-element-selected-to-move')

                        $rootScope.$broadcast('tagy-cms-gallery:showMoveGalleryElementControls',{element:moveEl})
                        //EditableMessageChannel.dispatchUpdatedEvent(null, {element: $galleryItem})
                        $rootScope.$apply()
                        ev.preventDefault()
                        if (ev && ev.stopPropagation)ev.stopPropagation()
                        if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                    })

                    $("[tagy-cms-move-gallery-item-before]",controlsHol).on("click",function(ev){

                        var $moveEl = $('#tagy-cms-gallery-element-selected-to-move');
                        $galleryItem.before($moveEl)
                        EditableMessageChannel.dispatchUpdatedEvent(null, {element: $moveEl})
                        $moveEl.removeAttr("id")
                        $rootScope.$broadcast('tagy-cms-gallery:hideMoveGalleryElementControls',{element:$moveEl})
                        $rootScope.$apply()
                        ev.preventDefault()
                        if (ev && ev.stopPropagation)ev.stopPropagation()
                        if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                    })

                    $("[tagy-cms-move-gallery-item-after]",controlsHol).on("click",function(ev){
                        var $moveEl = $('#tagy-cms-gallery-element-selected-to-move');
                        $galleryItem.after($moveEl)
                        EditableMessageChannel.dispatchUpdatedEvent(null, {element: $moveEl})
                        $moveEl.removeAttr("id")
                        $rootScope.$broadcast('tagy-cms-gallery:hideMoveGalleryElementControls',{element:$moveEl})

                        $rootScope.$apply()
                        ev.preventDefault()
                        if (ev && ev.stopPropagation)ev.stopPropagation()
                        if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                    })


                    $("[tagy-cms-cancel-move-gallery-item]",controlsHol).on("click",function(ev){
                        $("#tagy-cms-gallery-element-selected-to-move").removeAttr("id")
                        $rootScope.$broadcast('tagy-cms-gallery:hideMoveGalleryElementControls',{element:null})
                        $rootScope.$apply()
                        ev.preventDefault()
                        if (ev && ev.stopPropagation)ev.stopPropagation()
                        if (ev && ev.stopImmediatePropagation)ev.stopImmediatePropagation()
                    })

                    scope.$on('tagy-cms-gallery:showMoveGalleryElementControls',showMoveGalleryElementControlsHandler(scope))
                    scope.$on('tagy-cms-gallery:hideMoveGalleryElementControls',hideMoveGalleryElementControlsHandler(scope))

                    var findParentGalleryItem=function(elem ){
                        var curr=$(elem)//$($("article[tagy-cms-gallery]").find("[tagy-cms-add-gallery-item]")[0])
                        var gall=curr.closest("[tagy-cms-gallery]")
                        var ancestors=curr.parents()
                        for (var i = 0; i < ancestors.length; i++) {
                            var obj = $(ancestors[i]);
                            if(obj.is(gall)){
                                return $(ancestors[i-1])
                            }
                        }
                    }
                    $("[tagy-cms-remove-gallery-item]",controlsHol).parent().hover(function(ev){
                        var gallItem=findParentGalleryItem($(ev.target))
                        if(gallItem) {
                            gallItem.addClass('selected-item_remove-in-production')
                        }
                    },function(ev){
                        var gallItem=findParentGalleryItem($(ev.target))
                        if(gallItem)gallItem.removeClass('selected-item_remove-in-production')
                    })

                    //$galleryItem.css({position:"relative"})
                }


                element.children().each(function(ind,galleryItem){
                    addGalleryControls(galleryItem)
                })


            }
        };
    });
