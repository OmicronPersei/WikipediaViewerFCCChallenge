/*global $, jQuery, navigator*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true  */

function SearchModal(DOMID) {
  "use strict";
  
  this.DOMID = DOMID;
  this.searchCallback = [];
  this.randomArticleCallback = [];
  
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
  
  $("#" + this.DOMID + " .randomArticleButton").on("click", function() {
    var i;
    for (i = 0; i < oThis.randomArticleCallback.length; ++i) {
      oThis.randomArticleCallback[i]();
    }
  });
}

SearchModal.prototype.display = function() {
  "use strict";
  
  $("#" + this.DOMID).modal("show");
  $("#" + this.DOMID + " .searchText").val("");
  
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
  mainPanel += "<div class='collapse searchResultsCollapse'>";
  mainPanel += "  <div class='panel panel-default searchResultsPanel'>";
  mainPanel += "    <div class='panel-heading'>Search results for \"" + searchText + "\"";
  mainPanel += "    <button class='btn btn-default searchAgainButton pull-right'>Search again</button></div>";
  mainPanel += "    <div class='panel-body'>";
  
  var i;
  for (i = 0; i < searchResults[1].length; ++i) {
    mainPanel += "    <a href='" + searchResults[3][i] + "' target='_blank'>";
    mainPanel += "      <div class='panel panel-default searchResult'>";
    mainPanel += "        <div class='panel-heading'>" + searchResults[1][i] + "</div>";
    mainPanel += "        <div class='panel-body'>" + searchResults[2][i] + "</div>";
    mainPanel += "      </div>";
    mainPanel += "    </a>";
  }
  
  mainPanel += "</div></div>";
  
  $("#" + this.DOMID).html(mainPanel);
  $("#" + this.DOMID + " .searchResultsCollapse").collapse("show");
  
  var oThis = this;
  $("#" + this.DOMID + " .searchAgainButton").on("click", function() {
    var i;
    var searchCallsbacks = oThis.newSearchCallback;
    for (i = 0; i < searchCallsbacks.length; ++i) {
      searchCallsbacks[i]();
    }
  });
  
};

SearchResultsDisplay.prototype.clear = function(finishedCallback) {
  "use strict";
  
  var finishedCallbackRaised = false;
  var oThis = this;
  $("#" + this.DOMID + " .searchResultsCollapse").on("hidden.bs.collapse", function() {
    $("#" + oThis.DOMID).html("");
    finishedCallbackRaised = true;
    finishedCallback();
  });
  
  $("#" + this.DOMID + " .searchResultsCollapse").collapse("hide");
  
  if (!finishedCallbackRaised) {
    finishedCallback();
  }
};

var constructWikipediaSearchString = function(searchText) {
  "use strict";
  //Example below
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

var setupSearchModal = function(searchModal, searchResultsDisplay) {
  "use strict";
  
  searchModal.searchCallback.push(function(inputText) {
    
    searchModal.hide();
    
    getSearchResultsFromWikipedia(inputText, function(resultsObj) {
      
      searchResultsDisplay.clear(function() {
        searchResultsDisplay.displaySearchResults(resultsObj);
      });
    });
  });
  
  var domThis = this;
  searchModal.randomArticleCallback.push(function () {
    window.open("https://en.wikipedia.org/wiki/Special:Random", "_blank");
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
  
  var searchModal = new SearchModal("searchModal");
  var searchResultsDisplay = new SearchResultsDisplay("searchResults");
  
  setupSearchModal(searchModal, searchResultsDisplay);
  setupSearchResultsDisplay(searchResultsDisplay, searchModal);
  
  searchModal.display();
  
  
});