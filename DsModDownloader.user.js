// ==UserScript==
// @author         Aq
// @name           DsModDownloader
// @namespace      aq
// @description    DS/DST mods directly downloader for tieba & steam
// @include        *steamcommunity.com/sharedfiles/filedetails/?id=*
// @include		   *tieba.baidu.com/p/*
// @grant          GM_xmlhttpRequest
// @grant          GM_info
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @version        0.0.1
// @license        MIT
// ==/UserScript==
(function (w, d) {
  var API_GET_PUBLISHED_FILE_DETAILS = 'http://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v0001/';
  var curDomain = - 1; // 1 - tieba, 0 - steam
  function getDlUrl(modID, $dlButton) {
    GM_xmlhttpRequest({
      method: 'POST',
      url: API_GET_PUBLISHED_FILE_DETAILS,
      data: 'itemcount=1&publishedfileids[0]=' + modID + '&format=json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onload: function (response) {
        data = $.parseJSON(response.responseText);
        console.log(data);
        var fileurl = data.response.publishedfiledetails[0].file_url;
        if (curDomain) {
          $dlButton.text(fileurl);
        } 
        else {
        }
      },
      onerror: function (reponse) {
        //alert('error');
        console.log(reponse);
      }
    });
  };
  function htmlParser() {
    if (d.domain.toLowerCase().indexOf('baidu.com') > 0) {
      curDomain = 1;
      $(d).on('mouseover', '.d_post_content a,.lzl_content_main a', function (e) {
        var linkToAnyls = $(this).text();
        var pattern = /steamcommunity.com\D*([0-9]{2,15})/i;
        var modID = pattern.exec(linkToAnyls);
        modID && $(this).after('<span class="aq_id" style="cursor:default;color:blue;margin-left:3px;margin-right:2px">' + modID[1] + '</span>|<span class="aq_dl" style="cursor:pointer;color:red;margin-left:2px;margin-right:2px;">解析中...</span>|<span class="aq_lnk" style="cursor:pointer;color:blue;margin-left:2px;margin-right:3px">转到steam页面</span>').hide();
        getDlUrl(modID[1], $(this).next().next());
      });
      $(d).on('click', '.aq_dl', function (e) {
        window.location.href = $(this).html();
      });
      $(d).on('click', '.aq_lnk', function (e) {
        window.location.href = 'http://steamcommunity.com/sharedfiles/filedetails/?id=' + $(this).prev().prev().text();
      });
    } 
    else if (d.domain.toLowerCase().indexOf('steamcommunity.com') > 0) {
      curDomain = 0;
    } 
    else {
    }
  }
  htmlParser();
}) (window, document, undefined);
