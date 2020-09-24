//Create UTM params referral cookie
function createCookie(cookie) {
  //Get referral utm parameters
  var cookie = getCookie("referral");
  var cookie_utmsource = "";
  var cookie_utmmedium = "";
  var cookie_utmcampaign = "";
  if (cookie) {
    cookie = JSON.parse(cookie);
    if (cookie.utm_source) cookie_utmsource = cookie.utm_source;
    if (cookie.utm_medium) cookie_utmmedium = cookie.utm_medium;
    if (cookie.utm_campaign) cookie_utmcampaign = cookie.utm_campaign;
  }
  var cookie_object = {};
  if (getUrlParameter("utm_source"))
    cookie_object.utm_source = getUrlParameter("utm_source");
  else if ($_GET["utm_source"]) cookie_object.utm_source = $_GET["utm_source"];
  else if (cookie_utmsource) cookie_object.utm_source = cookie_utmsource;

  if (getUrlParameter("utm_medium"))
    cookie_object.utm_medium = getUrlParameter("utm_medium");
  else if ($_GET["utm_medium"]) cookie_object.utm_medium = $_GET["utm_medium"];
  else if (cookie_utmmedium) cookie_object.utm_medium = cookie_utmmedium;

  if (getUrlParameter("utm_campaign"))
    cookie_object.utm_campaign = getUrlParameter("utm_campaign");
  else if ($_GET["utm_campaign"])
    cookie_object.utm_campaign = $_GET["utm_campaign"];
  else if (cookie_utmcampaign) cookie_object.utm_campaign = cookie_utmcampaign;

  if (document.referrer) cookie_object.referral_url = document.referrer;
  else cookie_object.referral_url = "https://pushgeek.com";

  //Over writing utm_source when UTM Source parameter is empty
  if (!cookie_object.utm_source) {
    if ($_GET["gclid"]) {
      //If google adds id exists
      cookie_object.utm_source = "GoogleAds";
    } else if (document.referrer.indexOf("pushgeek.com/blog/") != -1) {
      //Referral URL contains PushEngage blog URL
      cookie_object.utm_source = "Blog";
    } else if (document.referrer.indexOf("google") != -1) {
      //If referral URL from google organic search
      cookie_object.utm_source = "GoogleOrganic";
    } else {
      //If above conditions are not satisified as per the documentation we need to update source with subdomain
      if (document.referrer) {
        if (getUrlParameter("utm_source")) {
          //If referral url has utm parameters
          cookie_object.utm_source = getUrlParameter("utm_source");
          if (getUrlParameter("utm_medium"))
            cookie_object.utm_source = getUrlParameter("utm_medium");
          if (getUrlParameter("utm_campaign"))
            cookie_object.utm_source = getUrlParameter("utm_campaign");
        } else {
          var url_arr = [];
          url_arr = document.referrer.split("/");
          if (url_arr.length >= 3 && !cookie_object.utm_source)
            cookie_object.utm_source = url_arr[2];
        }
      } else if (!cookie_object.utm_source)
        cookie_object.utm_source = "Dashboard";
    }
  }
  //Create cookie
  document.cookie = "referral=" + JSON.stringify(cookie_object) + "; path=/";
}

//Get referral url parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(document.referrer);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
