/*global QUnit*/
sap.ui.require(["sapmarco/projectpages/util/githubService"], function (githubService) {
	"use strict";

	QUnit.module("githubService");

	QUnit.test("Should retrieve the Wiki-Sidebar", function (assert) {
		const done = assert.async();
		isSidebarAvailable.call(this, assert);
		done();
	});
  
	function isSidebarAvailable(assert) {

	  // System under test
	  this.sSidebar = githubService.getWikiIndex();

	  // Assert
	  assert.ok(this.sSidebar, "Sidebar could be retrieved from Github");
	}
  });