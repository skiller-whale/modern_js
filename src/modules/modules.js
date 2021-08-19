const maxItemsToDisplay = 5;
const CACHE = {};

function updateCache(id, searchTerm, data) {
  CACHE[id] = CACHE[id] || {};
  CACHE[id][searchTerm] = data;
}

function itemFromCache(id, searchTerm) {
  return CACHE[id] && CACHE[id][searchTerm]
}

// add event listener to the search field input
document.getElementById("searchField").addEventListener("input", function() {
  onSearchFieldInputChange();
});

let reddit = {
    id: "reddit",
    url:
      "https://api.reddit.com/api/subreddit_autocomplete_v2.json?limit=10&include_over_18=false&query=",
    normaliseData: function(data) {
      let normalisedData = [];
      data = data.data;
      let addDisplayItem = function(item) {
        let createdDate = new Date(1000 * item.created);
        let displayItem = {
          col1: createdDate.toLocaleDateString(),
          col2: item.subscribers || "0",
          col3: '<a href="https://reddit.com' + item.url + '">' + item.title + "</a>",
        }
        normalisedData.push(displayItem);
      };
      if (data && data.children && data.children.length) {
        let dataLength = data.children.length;
        for (let i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data.children[i].data);
        }
      }
      return normalisedData;
    }
  }

let hackerNews = {
    id: "hacker-news",
    url: "http://hn.algolia.com/api/v1/search?hitsPerPage=10&query=",
    normaliseData: function(data) {
      let normalisedData = [];
      let hits = data.hits;
      let addDisplayItem = function(item) {
        let createdDate = new Date(item.created_at);
        let displayItem = {
          col1: createdDate.toLocaleDateString(),
          col2: item.points,
          col3: '<a href="' + item.url + '">' + item.title + "</a>",
        };
        normalisedData.push(displayItem);
      };
      if (hits && hits.length) {
        let dataLength = hits.length;
        for (let i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(hits[i]);
        }
      }
      return normalisedData;
    }
  }

let locations = {
    id: "locations",
    url:
      "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=",
    normaliseData: function(data) {
      let normalisedData = [];
      let addDisplayItem = function(item) {
        let displayItem = {
          col1: item.display_name,
          col2: item.lat + "," + item.lon,
        };
        normalisedData.push(displayItem);
      };
      if (data && data.length) {
        let dataLength = data.length;
        for (let i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data[i]);
        }
      }
      return normalisedData;
    }
  }

let books = {
    id: "books",
    url:
      "http://openlibrary.org/query.json?type=/type/edition&limit=10&*=&title=",
    normaliseData: function(data) {
      let normalisedData = [];
      let addDisplayItem = function(item) {
        let subjectList = item.subjects && item.subjects.join("; ");
        let displayItem = {
          col1: item.title,
          col2: item.subtitle || " ",
          col3: subjectList || " ",
          col4: item.publish_date,
        };
        normalisedData.push(displayItem);
      };
      if (data && data.length) {
        let dataLength = data.length;
        for (let i = 0; i < dataLength; i++) {
          if (normalisedData.length >= maxItemsToDisplay) {
            break;
          }
          addDisplayItem(data[i]);
        }
      }
      return normalisedData;
    }
  }

// data feed setup
let dataFeeds = {}

dataFeeds[reddit.id] = reddit
dataFeeds[hackerNews.id] = hackerNews
dataFeeds[locations.id] = locations
dataFeeds[books.id] = books

function fetchData(props) {
  if (navigator.onLine) {
    fetch(props.url + encodeURIComponent(props.searchTerm))
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        let data = props.normaliseData(json);
        updateCache(props.id, props.searchTerm, data);
        updateSearchDisplay({ id: props.id, data: data });
      });
  } else {
    if (itemFromCache(props.id, props.searchTerm)) {
      updateSearchDisplay({
        id: props.id,
        data: itemFromCache(props.id, props.searchTerm),
        offline: true
      });
    } else {
      updateSearchDisplay({ id: props.id, offline: true });
    }
  }
}

function onSearchFieldInputChange() {
  let searchTerm = document.getElementById("searchField").value;
  Object.values(dataFeeds).forEach(function(feed) {
    let feedProps = {};
    feedProps.id = feed.id;
    feedProps.url = feed.url;
    feedProps.normaliseData = feed.normaliseData;
    feedProps.searchTerm = searchTerm;
    fetchData(feedProps);
  });
  updateLastSearchTime({ searchTerm: searchTerm });
}

function updateSearchDisplay(props) {
  let searchDisplayHtml = "";
  let id = props.id;
  let data = props.data;
  let offline = props.offline;
  if (offline && data && data.length) {
    searchDisplayHtml +=
      '<div style="margin-bottom: 12px;">Offline - displaying cached results</div>';
  } else if (offline) {
    searchDisplayHtml += "<div>Offline</div>";
  }
  if (data && data.length) {
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

function updateLastSearchTime(props) {
  let lastSearchTimeHtml = "";
  let timestamp;
  if (props.searchTerm) {
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
