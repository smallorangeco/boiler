/*---------------------------------------------
 * UI Factory
 *-------------------------------------------*/
(function () {
    'use strict';

    angular.module('app.core').factory('uiService', [
        '$compile',
        uiFactory
    ]);

    function uiFactory($compile) {
        return{
            modal: modal
        };

        /*====================================*/

        // # Modal
        var modalOpened = 0;
        var modalObj;
        
        function modal(params, scope) {
            if (params) {
                modalObj = '<div class="modal fade modal-editor">';
                modalObj += '<div class="modal-dialog ' + (params.size || '') + '">';
                modalObj += '<div class="modal-content">';
                modalObj += '<div class="modal-header">';
                modalObj += '<button type="button" class="close" data-dismiss="modal" ng-if="!modalForm.$invalid"><span aria-hidden="true">&times;</span></button>';
                modalObj += '<h4 class="modal-title">' + params.title + '</h4>';
                modalObj += '</div>';
                modalObj += '<div class="modal-body">';
                modalObj += params.content;
                modalObj += '</div>';
                modalObj += '<div class="modal-footer">';
                if (scope && scope.callback) {
                    modalObj += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel <i class="fa fa-times"></i></button>';
                    modalObj += '<button type="button" class="btn btn-primary" ng-click="callback()" ng-disabled="modalForm.$invalid">Continue <i class="fa fa-check"></i></button>';
                } else if (scope) {
                    modalObj += '<button type="button" class="btn btn-default" ng-disabled="modalForm.$invalid" data-dismiss="modal">Continue <i class="fa fa-angle-right"></i></button>';
                } else {
                    modalObj += '<button type="button" class="btn btn-default" data-dismiss="modal">Continue <i class="fa fa-angle-right"></i></button>';
                }
                modalObj += '</div>';
                modalObj += '</div>';
                modalObj += '</div>';
                modalObj += '</div>';

                if (scope) {
                    modalObj = $compile(modalObj)(scope);
                } else {
                    modalObj = angular.element(modalObj);
                }

                //Increment modal modalOpened
                modalOpened++;

                //Create Modal
                modalObj.modal({
                    backdrop: 'static',
                    keyboard: false
                }).on('hidden.bs.modal', function (e) {
                    modalObj.remove();
                    //Decrement modal modalOpened
                    modalOpened--;

                    //If some modal remains, keep moda-open class
                    if (modalOpened) {
                        angular.element('body').addClass('modal-open');
                    }
                });
            } else {
                modalObj.modal('hide');
            }
        }
    }
})();