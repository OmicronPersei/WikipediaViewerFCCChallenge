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

function SearchResultsDisplay(DOMID) {
  "use strict";
  
  this.DOMID = DOMID;
  this.newSearchCallback = [];
}

SearchResultsDisplay.prototype.displaySearchResults = function(searchResults) {
  "use strict";
  
  var searchText = searchResults[0];
  //Create panel to contain all of the search results.
  var mainPanel = "";
  mainPanel += "<div class='panel panel-default'>";
  mainPanel += "  <div class='panel-heading'>Search results for \"" + searchText + "\"";
  mainPanel += "<button class='btn btn-default searchAgainButton'>Search again</button></div>";
  mainPanel += "  <div class='panel-body'>";
  
  var i;
  for (i = 0; i < searchResults[1].length; ++i) {
    mainPanel += "    <div class='panel panel-default'>";
    mainPanel += "      <div class='panel-heading'>" + searchResults[1][i] + "</div>";
    mainPanel += "      <div class='panel-body'>" + searchResults[2][i] + "</div>";
    mainPanel += "    </div>";
  }
  
  mainPanel += "</div>";
  
  $("#" + this.DOMID).html(mainPanel);
  var oThis = this;
  $("#" + this.DOMID + " .searchAgainButton").on("click", function() {
    var i;
    var searchCallsbacks = oThis.newSearchCallback;
    for (i = 0; i < searchCallsbacks.length; ++i) {
      searchCallsbacks[i]();
    }
  });
};

SearchResultsDisplay.prototype.startNewSearch = function() {
  "use strict";
  
  
};

SearchResultsDisplay.prototype.clear = function() {
  "use strict";
  
  $("#" + this.DOMID).html("");
};



var constructWikipediaSearchString = function(searchText) {
  "use strict";
  //https://en.wikipedia.org/w/api.php?action=opensearch&search=api&limit=10&namespace=0&format=json
  var searchString = encodeURI(searchText.replace(" ", "+"));
  
  return "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchString + "&limit=10&namespace=0&format=json";
};

var getSearchResultsFromWikipedia = function(searchText, searchResultsCallback) {
  "use strict";
  var searchCall = constructWikipediaSearchString(searchText);
  $.ajax( {
    dataType: "jsonp",
    url: searchCall,
    data: null,
    success: function(obj) {
    searchResultsCallback(obj);
    }});
};

var searchModal = new SearchModal("searchModal");
var searchResultsDisplay = new SearchResultsDisplay("searchResults");

var setupSearchModal = function(searchModal, searchResultsDisplay) {
  "use strict";
  
  searchModal.searchCallback.push(function(inputText) {
    
    searchModal.hide();
    
    getSearchResultsFromWikipedia(inputText, function(resultsObj) {
      
      searchResultsDisplay.clear();
      searchResultsDisplay.displaySearchResults(resultsObj);
      
    });
  });
};

var setupSearchResultsDisplay = function(searchResultsDisplay, searchModal) {
  "use strict";
  
  searchResultsDisplay.newSearchCallback.push(function() {
    searchModal.display();
  });
};

$(document).ready(function() {
  "use strict";
  
  setupSearchModal(searchModal, searchResultsDisplay);
  setupSearchResultsDisplay(searchResultsDisplay, searchModal);
  
  searchModal.display();
  
  
});