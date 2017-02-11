/*global $, jQuery, navigator*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true  */

function SearchModal(DOMID) {
  "use strict";
  
  this.DOMID = DOMID;
  this.searchCallback = [];
}

SearchModal.prototype.display = function() {
  "use strict";
  
  $("#" + this.DOMID).modal("show");
    
  var oThis = this;
  $("#" + this.DOMID + " .searchButton").on("click", function() {
    var i;

    var inputText = $("#" + oThis.DOMID + " .searchText").val();
    if (inputText !== "") {
      for (i = 0; i < oThis.searchCallback.length; ++i) {
        oThis.searchCallback[i](inputText);
      }
    }
  });
};

SearchModal.prototype.hide = function() {
  "use strict";
  
  $("#" + this.DOMID).modal("hide");
};

var changeLayout = function(DisplayType) {
  "use strict";
  
  
};

var searchModal = new SearchModal("searchModal");

var setupSearchModal = function(searchModal) {
  "use strict";
  
  searchModal.searchCallback.push(function(inputText) {
    console.log("search text: \"" + inputText + "\"");
  });
};

$(document).ready(function() {
  "use strict";
  
  searchModal.display();
  setupSearchModal(searchModal);
});