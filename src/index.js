// add event listener to the search field input
document.getElementById("searchField").addEventListener("input", function() {
  onSearchFieldInputChange();
});

var maxItemsToDisplay = 5;

// data feed setup
var dataFeeds = {
  reddit: {
    id: "reddit",
    url:
      "https://api.reddit.com/api/subreddit_autocomplete_v2.json?limit=10&include_over_18=false&query=",
    normaliseData: function(data) {
      var normalisedData = [];
      var data = data.data;
      var i;
      var dataLength = 0;
      var addDisplayItem = function(item) {
        var displayItem = {};
        var createdDate = new Date(1000 * item.created);
        displayItem.col1 = createdDate.toLocaleDateString();
        displayItem.col2 = item.subscribers || "0";
        displayItem.col3 =
          '<a href="https://reddit.com"' + item.url + ">" + item.title + "</a>";
        normalisedData.push(displayItem);
      };
      if (data && data.children && data.children.length) {
        dataLength = data.children.length;
        for (i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data.children[i].data);
        }
      }
      return normalisedData;
    }
  },
  "hacker-news": {
    id: "hacker-news",
    url: "http://hn.algolia.com/api/v1/search?hitsPerPage=10&query=",
    normaliseData: function(data) {
      var normalisedData = [];
      var hits = data.hits;
      var i;
      var dataLength = 0;
      var addDisplayItem = function(item) {
        var displayItem = {};
        var createdDate = new Date(item.created_at);
        displayItem.col1 = createdDate.toLocaleDateString();
        displayItem.col2 = item.points;
        displayItem.col3 = '<a href="' + item.url + '">' + item.title + "</a>";
        normalisedData.push(displayItem);
      };
      if (hits && hits.length) {
        dataLength = hits.length;
        for (i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(hits[i]);
        }
      }
      return normalisedData;
    }
  },
  locations: {
    id: "locations",
    url:
      "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=",
    normaliseData: function(data) {
      var normalisedData = [];
      var i;
      var dataLength = 0;
      var addDisplayItem = function(item) {
        var displayItem = {};
        displayItem.col1 = item.display_name;
        displayItem.col2 = item.lat + "," + item.lon;
        normalisedData.push(displayItem);
      };
      if (data && data.length) {
        dataLength = data.length;
        for (i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data[i]);
        }
      }
      return normalisedData;
    }
  },
  books: {
    id: "books",
    url:
      "http://openlibrary.org/query.json?type=/type/edition&limit=10&*=&title=",
    normaliseData: function(data) {
      var normalisedData = [];
      var i;
      var dataLength = 0;
      var addDisplayItem = function(item) {
        var subjectList = item.subjects && item.subjects.join("; ");
        var displayItem = {};
        displayItem.col1 = item.title;
        displayItem.col2 = item.subtitle || " ";
        displayItem.col3 = subjectList || " ";
        displayItem.col4 = item.publish_date;
        normalisedData.push(displayItem);
      };
      if (data && data.length) {
        dataLength = data.length;
        for (i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data[i]);
        }
      }
      return normalisedData;
    }
  }
};

function fetchData(id, url, searchTerm, normaliseData) {
  fetch(url + encodeURIComponent(searchTerm))
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var data = normaliseData(json);
      updateSearchDisplay(id, data);
    });
}

function onSearchFieldInputChange() {
  var searchTerm = document.getElementById("searchField").value;
  var fetchDataFeed = function(dataFeed) {
    var id = dataFeed.id;
    var url = dataFeed.url;
    var normaliseData = dataFeed.normaliseData;
    fetchData(id, url, searchTerm, normaliseData);
  };
  Object.keys(dataFeeds).forEach(function(key) {
    fetchDataFeed(dataFeeds[key]);
  });
  updateLastSearchTime(searchTerm);
}

function updateSearchDisplay(id, data) {
  var searchDisplayHtml = "";
  if (data.length) {
    searchDisplayHtml += '<table class="table table-striped">';
    searchDisplayHtml += "<tbody>";

    data.map(function(columns) {
      searchDisplayHtml += "<tr>";
      if (columns.col1) {
        searchDisplayHtml += "<td>";
        searchDisplayHtml += columns.col1;
        searchDisplayHtml += "</td>";
      }
      if (columns.col2) {
        searchDisplayHtml += "<td>";
        searchDisplayHtml += columns.col2;
        searchDisplayHtml += "</td>";
      }
      if (columns.col3) {
        searchDisplayHtml += "<td>";
        searchDisplayHtml += columns.col3;
        searchDisplayHtml += "</td>";
      }
      if (columns.col4) {
        searchDisplayHtml += "<td>";
        searchDisplayHtml += columns.col4;
        searchDisplayHtml += "</td>";
      }
      searchDisplayHtml += "</tr>";
    });

    searchDisplayHtml += "</tbody>";
    searchDisplayHtml += "</table>";
  }
  document.getElementById(id).innerHTML = searchDisplayHtml;
}

function updateLastSearchTime(searchTerm) {
  var lastSearchTimeHtml = "";
  var timestamp;
  if (searchTerm) {
    timestamp = new Date();
    lastSearchTimeHtml =
      "<small>Last search: " +
      timestamp.toLocaleDateString() +
      " " +
      timestamp.toLocaleTimeString() +
      "</small>";
  }
  document.getElementById("last-search-time").innerHTML = lastSearchTimeHtml;
}
