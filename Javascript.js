/*global $, jQuery, navigator*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true  */

var searchModal = {
  
  display: function(searchCallback) {
    "use strict";
    
    $("#searchModal").modal("show");
  },
  
  clear: function() {
    "use strict";
    
  }
};

var searchResultsDisplay = {
  
  display: function() {
    "use strict";
  },
  
  clear: function() {
    "use strict";
    
  }
};

var DisplayTypes = {
  SearchModal: searchModal,
  SearchResults: searchResultsDisplay
};

var changeLayout = function(DisplayType) {
  "use strict";
  
  
};

$(document).ready(function() {
  "use strict";
  
  
});