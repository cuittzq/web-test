'use strict';

angular.module('ngApp')
.config(function($stateProvider) {
	$stateProvider
	.state('app.org', {
		url : 'org',
		views : {
			'content@' : {
				templateUrl : 'app/sys/org/org.html',
				controller : 'orgCtrl'
			}
		}
	});
})

.controller('orgCtrl', function($scope, Flash, WlOrganize) {
	//query orgs via REST
	$scope.orgs = WlOrganize.query();
	//current org, different than $scope.org, which is bound to the form
	var org;
	
	//on selection change
	$scope.$watch('orgsTree.selectedData', function(selectedOrg) {
		//keep current org
		org = selectedOrg
		//clone to $scope.org for editing
		$scope.org = angular.copy(selectedOrg);
	});
	
	$scope.add = function() {
		//new $scope.org for adding
		$scope.org = new WlOrganize();
		$scope.org.parentOrganizeId = org ? org.organizeId : undefined;
	};
	
	$scope.remove = function() {
		//remove org via REST
		org.$remove(function() {
			//remove org from orgs, tree gets updated automatically
			$scope.orgs.splice($scope.orgs.indexOf(org), 1);
			Flash.create('success', '删除成功！');
		});
	};
	
	$scope.save = function() {
		//save org via REST
		$scope.org.$save(function(savedOrg) {
			if (org && (org.organizeId == savedOrg.organizeId)) {
				//update
				//copy returned org into current org, tree gets updated automatically
				angular.copy(savedOrg, org);
			} else {
				//new
				//add returned org into orgs, tree gets updated automatically
				$scope.orgs.push(savedOrg);
				//select the new org
				$scope.orgsTree.selectedData = savedOrg;
			}
			Flash.create('success', '保存成功！');
		});
	};
	
	$scope.cancel = function() {
		angular.copy(org, $scope.org);
	};
	
});
