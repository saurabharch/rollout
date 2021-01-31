// cookie warning body
var cookieWarning = $("#cookie-warning-bottom-navigation");
//allowed country where show cookie warning
var allowCookieWarningCountry = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "United Kingdom",
  "England",
  "United States"
];
// perform cookie opearations
var pushGeekCookieOperation = {
  // cookie property
  cookie: {
    get: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      if (localStorage.getItem(cname) != null)
        return localStorage.getItem(cname);
      return "";
    },
    // set cookie value based on data, type of data is array
    set: function(data) {
      // 0=>cname,1=>value,2=>expiry,3=>path

      data.forEach(function(e) {
        var eT = new Date();
        eT.setDate(eT.getDate() + e[2]);
        document.cookie =
          "" + e[0] + "=" + e[1] + "; expires=" + eT + ";path=" + e[3] + ";";
        if (
          typeof navigator.cookieEnabled != "undefined" &&
          !navigator.cookieEnabled
        )
          localStorage.setItem(e[0], e[1]);
      });
    }
  },
  // insert pushengage geo file that able to show user region,country,city, state
  insertFile: function(callback) {
    var head = document.getElementsByTagName("head")[0];
    var src = src ? src : "http://localhost:5500/api/ami/position.js";
    var script = document.createElement("script");
    script.src = src;
    script.onload = function() {
      return callback(true);
    };
    head.appendChild(script);
  }
};

// click on closed button in bottom navigation
$("#cookie-warning-bottom-navigation__close").on("click", function() {
  hideBottomNavigation();
});

// click on ok button in bottom navigation
$("#cookie-warning-bottom-navigation__ok-btn").on("click", function() {
  pushGeekCookieOperation.cookie.set([["pgCookieWarning", false, 180, "/"]]);
  hideBottomNavigation();
});

// hide bootom navigation warning bar
function hideBottomNavigation() {
  cookieWarning.hide(0, function() {
    cookieWarning.remove();
  });
}

// condition for displaying cookie warning war
$(document).ready(function() {
  if (pushGeekCookieOperation.cookie.get("pgCookieWarning") != "false") {
    pushGeekCookieOperation.insertFile(function(res) {
      if (
        res &&
        $.inArray(pgGeoInfo.geobytescountry, allowCookieWarningCountry) != -1
      ) {
        cookieWarning.show();
      }
    });
  }
});
