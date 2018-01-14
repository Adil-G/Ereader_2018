// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

  .run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The internet is disconnected on your device."
            })
            .then(function(result) {
              if(!result) {
                //ionic.Platform.exitApp();
              }
            });
        }
      }
    });
  })


  .controller('SoundCtrl', function($scope,$ionicPlatform,$state, $ionicLoading, $ionicPopup,$timeout, $http, $q) {
    //console.log = function() {};
    var PAGE_WAIT_TIME = 1000;
    $scope.initialized = false;
    $scope.dontTriggerEndCallback = false;
    $scope.flags = [];
    $scope.loaderProg = $ionicLoading;
    $scope.ionicPopup = $ionicPopup;
    $scope.timeout = $timeout;
    $scope.index = 0;
    $scope.highlightStack = [];
    $scope.langNotChanged = true;
    $scope.languageOptions = {
      voice: "UK English Male",
      lang:"en",
      isGoogle: false,
      langSpeak: "en-GB",
      speed: 1.0,
      translate: "checked"

    };
    $scope.languageOptions.display = "EN";
    $scope.need2Translate = true;
    $scope.gTranslate = function(phrase, lang, voice, params)
    {
      $scope.dontTriggerEndCallback = false;
      $scope.voiceParameters.rate = $scope.languageOptions.speed;
      $scope.voiceParametersStop.rate =  $scope.languageOptions.speed;
      $scope.voiceParametersBlank.rate = $scope.languageOptions.speed;
      if($scope.langNotChanged || $scope.languageOptions.translate != "checked")
      {
        if($scope.languageOptions.isGoogle) {
          $scope.voiceParameters.onstart();
          TTS
            .speak({
              text: phrase,
              locale: $scope.languageOptions.langSpeak,
              rate: $scope.languageOptions.speed
            }, function () {
              //alert('success');
              $scope.voiceParameters.onend();
            }, function (reason) {
              $scope.voiceParameters.onerror();
            });
        }
        else
        responsiveVoice.speak(phrase, voice, params);
        return phrase;
      }
      var langData = {
        'phrase':phrase,
        'lang':lang
      };
      var arr = [];
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Origin': 'http://localhost:8101',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      };
      console.log("()SJD(JFSDF");
      console.log(phrase);
      console.log(lang);
      var data = $.param({"phrase":phrase,"lang":lang}
      );

      var config = {
        headers : {
          'Content-Type': 'text/html'
        }
      };
      var req = {
        method: 'POST',
        url: 'https://blooming-sea-87084.herokuapp.com/',
        headers: {
          'Content-Type': "application/json"
        },
        data: {"phrase":phrase,"lang":lang}
      };
      //alert(lang);
      $http(req)
        .success(function (data, status, headers, config) {
          $scope.PostDataResponse = data;
          console.log(data);
          if($scope.languageOptions.isGoogle) {
            $scope.dontTriggerEndCallback = false;
            $scope.voiceParameters.onstart();
            TTS
              .speak({
                text: data,
                locale: $scope.languageOptions.langSpeak,
                rate: $scope.languageOptions.speed
              }, function () {
                //alert('success');
                $scope.voiceParameters.onend();
              }, function (reason) {
                $scope.voiceParameters.onerror();
              });

          }
          else
            responsiveVoice.speak(data, voice, params);
        })
        .error(function (data, status, header, config) {
          $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
          console.log($scope.ResponseDetails);
          if($scope.languageOptions.isGoogle) {
            $scope.dontTriggerEndCallback = false;
            $scope.voiceParameters.onstart();
            TTS
              .speak({
                text: phrase,
                locale: $scope.languageOptions.langSpeak,
                rate: $scope.languageOptions.speed
              }, function () {
                //alert('success');
                $scope.voiceParameters.onend();
              }, function (reason) {
                $scope.voiceParameters.onerror();
              });
          }
          else
          responsiveVoice.speak(phrase, voice, params);
        });


      return phrase;
    };
    $scope.translateOptions = function()
    {
      $ionicPopup.prompt({
        templateUrl: 'templates/translate.html',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Done</b>',
            type: 'button-positive',

            onTap: function(e) {
              var selectedOpts = $("#voiceselection option:selected");
              var speedOpts = $("#speed");
              //var translateOpts = $("#translate");
              $scope.languageOptions.lang =  selectedOpts.attr("data-lang");

              $scope.languageOptions.speed = speedOpts.val();
              //$scope.languageOptions.translate = translateOpts.val();

              if(selectedOpts.attr("data-google") == "yes")
              {
                $scope.languageOptions.langSpeak = selectedOpts.attr("data-gspeak");
                $scope.languageOptions.isGoogle = true;

              }
              else $scope.languageOptions.isGoogle = false;
              $scope.languageOptions.display = selectedOpts.attr("data-lang").toUpperCase();
              $scope.languageOptions.voice  = selectedOpts.val();
              $scope.langNotChanged = false;
              console.log("CHOSEN OPTIONS:");
              console.log($scope.languageOptions);
            }
          }
        ]
      });

    };
    $scope.speakT = function(phrase, voice, params)
    {
      $scope.gTranslate(phrase,$scope.languageOptions.lang, $scope.languageOptions.voice, params);
    };
    $scope.openNav  =function(){
      console.error("opening side bar");
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("outerContainer").style.marginLeft = "250px";
    };

    $scope.promptX = function()
    {
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);
      if($scope.myPopup)
        $scope.myPopup.close();
      $scope.myPopup = $scope.ionicPopup.prompt({
        template: '<input type="password">',
        title: "No text on this page",
        subTitle: 'Do you want to go to the next page?',
        buttons: [
          { text: 'Stay On This Page' },
          {
            text: '<b>Next Page</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.speakT("Blank Page", "UK English Male", $scope.voiceParameters);
              $scope.nextPage();
            }
          }
        ]
      });
      $scope.myPopup.then(function(res) {
        /*(if(res) {
         $scope.nextPage();
         }*/

      });
      /*$scope.timeout(function() {
       $scope.myPopup.close(); //close the popup after 3 seconds for some reason
       $scope.nextPage();
       }, 3000);*/
      $timeout(function() {

      }, 3000);
    };

    this.pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
    var checkInternet = async function(){
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The internet is disconnected on your device."
            })
            .then(function(result) {
              if(!result) {
                //ionic.Platform.exitApp();
              }
            });
        }
      }
    };

    $scope.voiceStartCallback  = function() {
      $scope.dontTriggerEndCallback = true;
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);
      if($scope.focusON)
        $scope.focusPage();
    };
    $scope.pageRendered = false;
    /*
     The responsive-voice narrator has stopped talking.
     */
    $scope.voiceEndCallback = function() {
      console.log("is talking = "+$scope.isTalking);
      console.log("page rendered = "+$scope.pageRendered);
      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else
      responsiveVoice.cancel();
      if ($scope.pageRendered && $scope.dontTriggerEndCallback)
        $scope.talkCont(false);

    };
    /*
     The responsive-voice narrator has stopped talking.
     */
    $scope.voiceEndCallbackBlank = function() {
      console.log("is talking = "+$scope.isTalking);
       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      if ($scope.pageRendered)
        $scope.nextPage();

    };
    /*
     The responsive-voice narrator has encountered an error.
     */
    $scope.voiceErrorCallback= function() {
      console.log("ERROR!");
      TTS
        .speak('', function () {
        }, function (reason) {
        });
      responsiveVoice.cancel();
      $scope.speakT("Blank Page", "UK English Male", $scope.voiceParameters);


    };
    /*
     The responsive-voice narrator voice PARAMETERS (assigning callback functions).
     */
    $scope.voiceParameters = {
      onstart: $scope.voiceStartCallback,
      onend: $scope.voiceEndCallback,
      onerror: $scope.voiceErrorCallback,
      rate: $scope.languageOptions.speed
    };
    $scope.voiceParametersStop = {
      onstart: function(){},
      onend: function(){},
      onerror:function(){},
      rate: $scope.languageOptions.speed
    };
    $scope.voiceParametersBlank = {
      onstart: $scope.voiceStartCallback,
      onend: $scope.voiceEndCallbackBlank,
      onerror: $scope.voiceErrorCallback,
      rate: $scope.languageOptions.speed
    };
    /*
     This function is used to link multiple groups of text lying on the same line
     into one speech stream. This is so that the narrator speaks the entire line as a whole.
     This is needed, as some PDFs groups text of text per word or shorter.

     - isForward: a boolean telling the program whether or not to move back a line
     or simply just continue to the next line.
     */
    var linkLines5 = function()
    {
      $scope.isTalking = true;

      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      var sents = page.textLayer.textDivs;
      for (var k = 0; k < sents.length; k++)
      {
        $scope.resetStyle(sents, k);
      }


      console.log("playing sound");
      var button = $( "#play");
      if($scope.isTalking)
      {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
      }
      else {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );

      }

      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      sents = page.textLayer.textContent.items;


      if($scope.highlightStack)

        while($scope.highlightStack.length > 0)
        {
          var indexToClear = $scope.highlightStack.pop();
          $scope.resetStyle(page.textLayer.textDivs, indexToClear);
        }

      if($scope.index < (sents.length) && $scope.index >= (0) )
      {
        console.log("below is textLayer data:");
        console.log(page.textLayer);
        console.log($(page.textLayer.textDivs[$scope.index]).css("background-color"));

        console.log($scope.index);
        try {
          var sayAll = "";

          if($scope.index < 0){
            /**
             * GO TO PREVIOUS PAGE
             */
            console.log("(IS TALKING) scoe.onNextPa();");
            $scope.index = 0;
            $scope.prevPage();
          }
          else if($scope.index >= sents.length){
            /**
             * GO TO NEXT PAGE
             */
            console.log("(IS TALKING) scoe.onNextPa();");
            $scope.index =0;
            $scope.nextPage();
          }
          var targetPosition = sents[$scope.index].transform[5];
          var lightCount =0;
          if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          while((($scope.index < sents.length && $scope.index >=0)&&(Math.abs(sents[$scope.index].transform[5] - targetPosition) < sents[$scope.index].height * 3))
          || (($scope.index < sents.length && $scope.index >=0)&&(sayAll.match(/\S+/g)||[]).length < 10))
          {
            console.log($(page.textLayer.textDivs[$scope.index]));

            //$(page.textLayer.textDivs[$scope.index]).css("border-width", "3");
            $(page.textLayer.textDivs[$scope.index]).css("border-top-width", "0");
            $(page.textLayer.textDivs[$scope.index]).css("background-color", "rgba(255,255,0,0.4)");
            $(page.textLayer.textDivs[$scope.index]).css("border-right-width", "0");
            $(page.textLayer.textDivs[$scope.index]).css("border-left-width", "0");

            $(page.textLayer.textDivs[$scope.index]).css("border-color", "rgba(255,0,0,1)");
            $(page.textLayer.textDivs[$scope.index]).css("border-style", "solid");
            $scope.highlightStack.push($scope.index);
            console.log(sents[$scope.index]);
            sayAll += sents[$scope.index++].str.toLowerCase();

          }
          $ionicLoading.hide();
          var whatToSay = sayAll.replace(/[^a-zA-Z0-9\s\+\%\$\.\?!,—]/g, '');
          console.log("saying: "+whatToSay);
          $scope.speakT(whatToSay, "UK English Male", $scope.voiceParameters);
        }catch (err)
        {
          console.log(err);
          $scope.voiceErrorCallback();
        }
      }
      else if($scope.index < 0){
        /**
         * GO TO PREVIOUS PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index = 0;
        $scope.prevPage();
      }
      else if($scope.index >= sents.length){
        /**
         * GO TO NEXT PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index =0;
        $scope.nextPage();
      }
    };
    var linkLines4 = function()
    {
      $scope.isTalking = true;

      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      var sents = page.textLayer.textDivs;
      for (var k = 0; k < sents.length; k++)
      {
        $scope.resetStyle(sents, k);
      }


      console.log("playing sound");
      var button = $( "#play");
      if($scope.isTalking)
      {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
      }
      else {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );

      }

      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      sents = page.textLayer.textContent.items;


      if($scope.highlightStack)

        while($scope.highlightStack.length > 0)
        {
          var indexToClear = $scope.highlightStack.pop();
          $scope.resetStyle(page.textLayer.textDivs, indexToClear);
          $scope.index--;
        }

      if($scope.index < (sents.length) && $scope.index >= (0) )
      {
        console.log("below is textLayer data:");
        console.log(page.textLayer);
        console.log($(page.textLayer.textDivs[$scope.index]).css("background-color"));

        console.log($scope.index);
        try {
          var sayAll = "";

          if($scope.index < 0){
            /**
             * GO TO PREVIOUS PAGE
             */
            console.log("(IS TALKING) scoe.onNextPa();");
            $scope.index = 0;
            $scope.prevPage();
          }
          else if($scope.index >= sents.length){
            /**
             * GO TO NEXT PAGE
             */
            console.log("(IS TALKING) scoe.onNextPa();");
            $scope.index =0;
            $scope.nextPage();
          }
          var targetPosition = sents[$scope.index].transform[5];
          var lightCount =0;
          if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          while((($scope.index < sents.length && $scope.index >=0)&&(Math.abs(sents[$scope.index].transform[5] - targetPosition) < sents[$scope.index].height * 3))
          || (($scope.index < sents.length && $scope.index >=0)&&(sayAll.match(/\S+/g)||[]).length < 10))
          {
            console.log($(page.textLayer.textDivs[$scope.index]));

            //$(page.textLayer.textDivs[$scope.index]).css("border-width", "3");
            $(page.textLayer.textDivs[$scope.index]).css("border-top-width", "0");
            $(page.textLayer.textDivs[$scope.index]).css("background-color", "rgba(255,255,0,0.4)");
            $(page.textLayer.textDivs[$scope.index]).css("border-right-width", "0");
            $(page.textLayer.textDivs[$scope.index]).css("border-left-width", "0");

            $(page.textLayer.textDivs[$scope.index]).css("border-color", "rgba(255,0,0,1)");
            $(page.textLayer.textDivs[$scope.index]).css("border-style", "solid");
            $scope.highlightStack.push($scope.index);
            console.log(sents[$scope.index]);
            sayAll += sents[$scope.index++].str.toLowerCase();

          }
          $ionicLoading.hide();
          var whatToSay = sayAll.replace(/[^a-zA-Z0-9\s\+\%\$\.\?!,—]/g, '');
          console.log("saying: "+whatToSay);
           $scope.speakT(whatToSay, "UK English Male", $scope.voiceParameters);
        }catch (err)
        {
          console.log(err);
          $scope.voiceErrorCallback();
        }
      }
      else if($scope.index < 0){
        /**
         * GO TO PREVIOUS PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index = 0;
        $scope.prevPage();
      }
      else if($scope.index >= sents.length){
        /**
         * GO TO NEXT PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index =0;
        $scope.nextPage();
      }
    };
    var linkLines3 = function()
    {
      $scope.isTalking = true;
      $scope.dontTriggerEndCallback = false;
      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      var sents = page.textLayer.textDivs;
      for (var k = 0; k < sents.length; k++)
      {
        $scope.resetStyle(sents, k);
      }


      console.log("playing sound");
      var button = $( "#play");
      if($scope.isTalking)
      {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
      }
      else {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );

      }

      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      sents = page.textLayer.textContent.items;


      if($scope.highlightStack)
        while($scope.highlightStack.length > 0)
        {
          var indexToClear = $scope.highlightStack.pop();
          $scope.resetStyle(page.textLayer.textDivs, indexToClear);
          $scope.index--;
        }

      if($scope.index < (sents.length) && $scope.index >= (0) )
      {

      }
      else if($scope.index < 0){
        /**
         * GO TO PREVIOUS PAGE
         */
        $scope.index = 0;
      }
      else if($scope.index >= sents.length){
        /**
         * GO TO NEXT PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        gobacAlittle();
      }
      console.log("below is textLayer data:");
      console.log(page.textLayer);
      console.log($(page.textLayer.textDivs[$scope.index]).css("background-color"));

      console.log($scope.index);
      try {
        var sayAll = "";
        var targetPosition = sents[$scope.index].transform[5];
        var lightCount =0;
        if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        while((($scope.index < sents.length && $scope.index >=0)&&(Math.abs(sents[$scope.index].transform[5] - targetPosition) < sents[$scope.index].height * 3))
        || (($scope.index < sents.length && $scope.index >=0)&&(sayAll.match(/\S+/g)||[]).length < 10))
        {
          console.log($(page.textLayer.textDivs[$scope.index]));

          //$(page.textLayer.textDivs[$scope.index]).css("border-width", "3");
          $(page.textLayer.textDivs[$scope.index]).css("border-top-width", "0");
          $(page.textLayer.textDivs[$scope.index]).css("background-color", "rgba(255,255,0,0.4)");
          $(page.textLayer.textDivs[$scope.index]).css("border-right-width", "0");
          $(page.textLayer.textDivs[$scope.index]).css("border-left-width", "0");

          $(page.textLayer.textDivs[$scope.index]).css("border-color", "rgba(255,0,0,1)");
          $(page.textLayer.textDivs[$scope.index]).css("border-style", "solid");
          $scope.highlightStack.push($scope.index);
          console.log(sents[$scope.index]);
          sayAll += sents[$scope.index++].str.toLowerCase();

        }
        $ionicLoading.hide();
        var whatToSay = sayAll.replace(/[^a-zA-Z0-9\s\+\%\$\.\?!,—]/g, '');
        console.log("saying: "+whatToSay);
        $scope.speakT(whatToSay, "UK English Male", $scope.voiceParameters);
      }catch (err)
      {
        console.log(err);
        $scope.voiceErrorCallback();
      }
    };
    var gobacAlittle = function()
    {
      $scope.isTalking = true;

      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      var sents = page.textLayer.textDivs;
      for (var k = 0; k < sents.length; k++)
      {
        $scope.resetStyle(sents, k);
      }


      console.log("playing sound");
      var button = $( "#play");
      if($scope.isTalking)
      {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
      }
      else {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );

      }

      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      sents = page.textLayer.textContent.items;


      if($scope.highlightStack)
        while($scope.highlightStack.length > 0)
        {
          var indexToClear = $scope.highlightStack.pop();
          $scope.resetStyle(page.textLayer.textDivs, indexToClear);
          $scope.index--;
        }

      var sayAll = "";
      /*
       if(isPrevPage) {
       $scope.index = sents.length - 1;
       isForward = false;
       }
       */

      if($scope.index < 0){
        /**
         * GO TO PREVIOUS PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index = 0;
        $scope.prevPage();
      }
      else if($scope.index >= sents.length){
        /**
         * GO TO NEXT PAGE
         */
        console.log("(IS TALKING) scoe.onNextPa();");
        $scope.index = 0;
        $scope.nextPage();
      }

      var targetPosition = sents[$scope.index].transform[5];
      var lightCount = 0;
      if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      var sayBackwards = "";
      while((($scope.index < sents.length && $scope.index >=0)&&(Math.abs(sents[$scope.index].transform[5] - targetPosition) < sents[$scope.index].height * 3))
      || (($scope.index < sents.length && $scope.index >=0)&&(sayBackwards.match(/\S+/g)||[]).length < 10))
      {
        console.log($(page.textLayer.textDivs[$scope.index]));
        //$(page.textLayer.textDivs[$scope.index]).css("border-width", "3");
        $(page.textLayer.textDivs[$scope.index]).css("border-top-width", "0");
        $(page.textLayer.textDivs[$scope.index]).css("background-color", "rgba(255,255,0,0.4)");

        $(page.textLayer.textDivs[$scope.index]).css("border-right-width", "0");
        $(page.textLayer.textDivs[$scope.index]).css("border-left-width", "0");

        $(page.textLayer.textDivs[$scope.index]).css("border-color", "rgba(255,0,0,1)");
        $(page.textLayer.textDivs[$scope.index]).css("border-style", "solid");
        $scope.highlightStack.push($scope.index);
        console.log(sents[$scope.index]);

        sayBackwards += sents[$scope.index].str.toLowerCase();
        $scope.index--;

      }
      $ionicLoading.hide();
    };
    /*
     This function is used to link multiple groups of text lying on the same line
     into one speech stream. This is so that the narrator speaks the entire line as a whole.
     This is needed, as some PDFs groups text of text per word or shorter.

     - isForward: a boolean telling the program whether or not to move back a line
     or simply just continue to the next line.
     */
    var linkLines = function(isForward, isPrevPage)
    {
      try {
        var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
        var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
        var sents = page.textLayer.textContent.items;
        if(!isForward)
        {
          if($scope.highlightStack)

            while($scope.highlightStack.length > 0)
            {
              var indexToClear = $scope.highlightStack.pop();
              $scope.resetStyle(page.textLayer.textDivs, indexToClear);
              $scope.index--;
            }
        }
        else
        {
          if($scope.highlightStack)
            while($scope.highlightStack.length > 0)
            {
              var indexToClear = $scope.highlightStack.pop();
              $scope.resetStyle(page.textLayer.textDivs, indexToClear);
            }
        }
        var sayAll = "";
        /*
         if(isPrevPage) {
         $scope.index = sents.length - 1;
         isForward = false;
         }
         */

        if($scope.index < 0){
          /**
           * GO TO PREVIOUS PAGE
           */
          console.log("(IS TALKING) scoe.onNextPa();");
          $scope.index = 0;
          $scope.prevPage();
        }
        else if($scope.index >= sents.length){
          /**
           * GO TO NEXT PAGE
           */
          console.log("(IS TALKING) scoe.onNextPa();");
          $scope.index = 0;
          $scope.nextPage();
        }

        var targetPosition = sents[$scope.index].transform[5];
        var lightCount = 0;
         if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        var sayBackwards = "";
        while((($scope.index < sents.length && $scope.index >=0)&&(Math.abs(sents[$scope.index].transform[5] - targetPosition) < sents[$scope.index].height * 3))
        || (($scope.index < sents.length && $scope.index >=0)&&(sayBackwards.match(/\S+/g)||[]).length < 10))
        {
          console.log($(page.textLayer.textDivs[$scope.index]));
          //$(page.textLayer.textDivs[$scope.index]).css("border-width", "3");
          $(page.textLayer.textDivs[$scope.index]).css("border-top-width", "0");
          $(page.textLayer.textDivs[$scope.index]).css("background-color", "rgba(255,255,0,0.4)");

          $(page.textLayer.textDivs[$scope.index]).css("border-right-width", "0");
          $(page.textLayer.textDivs[$scope.index]).css("border-left-width", "0");

          $(page.textLayer.textDivs[$scope.index]).css("border-color", "rgba(255,0,0,1)");
          $(page.textLayer.textDivs[$scope.index]).css("border-style", "solid");
          $scope.highlightStack.push($scope.index);
          console.log(sents[$scope.index]);

          if(isForward) {
            sayBackwards += sents[$scope.index].str.toLowerCase();
            sayAll += sents[$scope.index++].str.toLowerCase();

          }
          else{
            sayBackwards += sents[$scope.index].str.toLowerCase();
            $scope.index--;

          }

        }
        $ionicLoading.hide();
        if(!isForward)
        {
          for(var i =$scope.highlightStack.length-1; i>=0 ;i--)
            sayAll += sents[$scope.highlightStack[i]].str.toLowerCase();
        }
        var whatToSay = sayAll.replace(/[^a-zA-Z0-9\s\+\%\$\.\?!,—]/g, '');
        console.log("saying: "+whatToSay);
        if(!isPrevPage) {
          $scope.focusON = true;
        }
        else{
          $scope.focusON = false;
        }
        $scope.speakT(whatToSay, "UK English Male", $scope.voiceParameters);
      }catch (err)
      {
        console.log(err);
        //$scope.voiceErrorCallback();
      }
    };
    $scope.finishRenderX  = function() {

      console.log("TEXT LAYER:");
      console.log($scope.textLayer);
      if ($scope.textLayer.textDivs.length > 0) {
        console.log("TEXT LAYER: T");
        $scope.isTalking = true;
        $scope.talkCont(false);
      }
      else {
        console.log("TEXT LAYER: F");
        // angular.element(document.getElementById('controllerForAngular')).scope().promptX();
        $scope.speakT("I think this page is blank. I will move on to the next page.", "UK English Male", {
          onstart: $scope.voiceStartCallback,
          onend: $scope.voiceEndCallbackBlank,
          onerror: $scope.voiceErrorCallback,
          rate: $scope.languageOptions.speed
        });
        //setTimeout(function(){$scope.finishRenderX();}, 1000);
        /*$scope.popup = angular.element(document.getElementById('controllerForAngular')).scope().ionicPopup.show({
         title: "This page has no text",
         subTitle: 'Do you want to go to the next page?',
         buttons: [
         {
         text: 'Stay',
         onTap: function(e) {
         $scope.waitForPageToLoad(false);
         }
         },
         {
         text: 'Next Page',
         onTap: function(e) {
         $scope.nextPage();
         }
         }


         ]});*/
        //$scope.waitForPageToLoad(false);


      }
    };
    $scope.talkCont = function(isClickAndGo)
    {
      $scope.dontTriggerEndCallback = false;
      checkInternet();
      $scope.dontTriggerEndCallback = false;
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);
      // stop speaking current sentence
       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      //if($scope.index==0)
      //  $scope.useless();


      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(this.pageIndex !== pageIndex)
      {
        this.pageIndex = pageIndex;
      }
      try {
        if (typeof page === "undefined"||page === null) {
          console.log("page is undefined");
          //$scope.waitForPageToLoad(false);
          return;
        }
        if (typeof page.textLayer === "undefined" || page.textLayer.textDivs.length === 0 || page.textLayer === null) {
          console.log("textDivs is undefined");
          return;
        }
      }catch (err){console.log(err);
        //$scope.waitForPageToLoad(false);
        return;
      }


      console.log("playing sound");
      var button = $( "#play");
      if($scope.isTalking)
      {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
      }
      else {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );

      }

       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();

      var sents = page.textLayer.textContent.items;




      if($scope.isTalking) {



        //linkLines(false, false);
        if($scope.index < (sents.length) && $scope.index >= (0) )
        {
          console.log("below is textLayer data:");
          console.log(page.textLayer);
          if($scope.atEnd)
          {
            $scope.index = sents.length - 1;
            $scope.atEnd = false;
          }
          console.log($(page.textLayer.textDivs[$scope.index]).css("background-color"));

          console.log($scope.index);
          if(isClickAndGo)
          $scope.resume();
          else
          $scope.resumePlus();
          // console.log("saying: "+sents[$scope.index].str);
          //if(!$scope.languageOptions.isGoogle)
          //  linkLines(true, isPrevPage);
        }
        else if($scope.index < 0){
          /**
           * GO TO PREVIOUS PAGE
           */
          console.log("(IS TALKING) scoe.onNextPa();");
          $scope.index = 0;
          $scope.prevPage();
        }
        else if($scope.index >= sents.length){
          /**
           * GO TO NEXT PAGE
           */
          console.log("(IS TALKING) scoe.onNextPa();");
          $scope.index =0;
          $scope.nextPage();
        }

      }


    };
    $scope.resumePlus = function()
    {
      $scope.isTalking = true;
      linkLines5();
    };
    $scope.resume = function()
    {
      $scope.isTalking = true;
      $scope.dontTriggerEndCallback = false;
      linkLines3();
    };

    $scope.pauseIt = function()
    {
      var button = $( "#play");

      button.toggleClass( 'fa fa-pause', false );
      button.toggleClass( 'fa fa-play', true );

      $scope.isTalking = false;
      if(responsiveVoice.isPlaying()) {
         if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();

      }
      else {
         if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      }



    };

    $scope.useless = function () {
      if($scope.initialized)
        return;
       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      var tt = $('#viewer');
      //var tt = $('button');
      //

      tt.on({
        "click": function( event, ui ) {
          var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
          var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
          var sents = page.textLayer.textContent.items;
          $scope.resetStyle(page.textLayer.textDivs, $scope.index);
          console.log("ois09f3wjs0fj");
          console.log(ui);
          console.log(event);
          console.log(event.target.outerText);
          var curPos = $(event.target).parent().children().index(event.target);
          console.log(curPos);
          var i = curPos;
          console.log("SUCCESS @" + i);
          var sents = page.textLayer.textDivs;
          if(!(i>=0 && i < sents.length))
            return;

          $scope.index = i;
          $scope.isTalking = true;
          $scope.dontTriggerEndCallback = false;
          $scope.resume();
        },
        "mouseout": function() {
        }
      });
      $scope.initialized = true;

    };

    $scope.videoPlay = function()
    {
      $scope.prevIndex = $scope.index;
      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(this.pageIndex !== pageIndex)
      {
        //$scope.index = 0;
        this.pageIndex = pageIndex;
      }
      var button = $( "#play");
      if (button.hasClass( "fa fa-pause") || $scope.isTalking == true) {
        button.toggleClass( 'fa fa-pause', false );
        button.toggleClass( 'fa fa-play', true );
        $scope.pauseIt();

      } else {
        button.toggleClass( 'fa fa-play', false );
        button.toggleClass( 'fa fa-pause', true );
        if(responsiveVoice.isPlaying()) {
          $scope.resume();

        }
        else {
          $scope.resume();
        }



      }

    };
    $scope.focusPage = async function()
    {
      /*
       var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber;
       var pagesCount = window.PDFViewerApplication.pdfViewer.pagesCount;
       var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
       if(pageIndex <= pagesCount) {
       window.PDFViewerApplication.pdfViewer.scrollPageIntoView(pageIndex);
       window.PDFViewerApplication.forceRendering();
       }*/
    };

    $scope.nextPage = function()
    {
      $scope.pageRendered = false;
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);

      $scope.highlightStack.length = 0;

       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      $scope.index=0;
      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber +1;
      var pagesCount = window.PDFViewerApplication.pdfViewer.pagesCount;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(pageIndex <= pagesCount) {

        try{
          window.PDFViewerApplication.zoomIn();
          window.PDFViewerApplication.zoomOut();

          // window.PDFViewerApplication.forceRendering();
          //window.PDFViewerApplication.currentPageNumber = pageIndex ;
          $("#pageNumber").val(pageIndex);
        }catch (err)
        {
          console.log(err);
        }
        window.PDFViewerApplication.pdfViewer.scrollPageIntoView(pageIndex);
      }
      $scope.waitForPageToLoad(false);

    };
    $scope.nextPage3 = function()
    {
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);

      $scope.highlightStack.length = 0;

       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      $scope.index=0;

      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber;
      var pagesCount = window.PDFViewerApplication.pdfViewer.pagesCount;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(pageIndex <= pagesCount) {

        try{
          window.PDFViewerApplication.zoomIn();
          window.PDFViewerApplication.zoomOut();
          $scope.highlightStack.length = 0;
          $scope.index = 0;
          // window.PDFViewerApplication.forceRendering();
          //window.PDFViewerApplication.currentPageNumber = pageIndex ;
          $("#pageNumber").val(pageIndex);
        }catch (err)
        {
          console.log(err);
        }
        window.PDFViewerApplication.pdfViewer.scrollPageIntoView(pageIndex);
      }
      $scope.waitForPageToLoad(false);

    };
    $scope.prevPageRW = function()
    {
      $scope.pageRendered = false;
      $scope.isTalking = false;
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);

      $scope.highlightStack.length = 0;

       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber -2;
      var pagesCount = window.PDFViewerApplication.pdfViewer.pagesCount;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(pageIndex > 0) {
        window.PDFViewerApplication.pdfViewer.scrollPageIntoView(pageIndex);
        //window.PDFViewerApplication.forceRendering();
      }
      $scope.waitForPageToLoad(true);
    };

    $scope.prevPage = function()
    {
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);

      $scope.highlightStack.length = 0;

       if($scope.languageOptions.isGoogle)TTS         .speak('', function () {    }, function (reason) {    });else        responsiveVoice.cancel();
      $scope.index=0;
      var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber -1;
      var pagesCount = window.PDFViewerApplication.pdfViewer.pagesCount;
      var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
      if(pageIndex <= pagesCount) {

        try{
          window.PDFViewerApplication.zoomIn();
          window.PDFViewerApplication.zoomOut();

          // window.PDFViewerApplication.forceRendering();
          //window.PDFViewerApplication.currentPageNumber = pageIndex ;
          $("#pageNumber").val(pageIndex);
        }catch (err)
        {
          console.log(err);
        }
        window.PDFViewerApplication.pdfViewer.scrollPageIntoView(pageIndex);
      }
      $scope.waitForPageToLoad(true);

    };
    $scope.magicMoment = function()
    {
      $scope.videoPlay();
    };


    $scope.waitForPageToLoad = function(isPrevPage)
    {
      if($scope.flagCheck)
        clearInterval($scope.flagCheck);

      $scope.flagCheck = setInterval(function() {
        console.log("waiting for page to load...");
        var pageIndex = window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
        var page = window.PDFViewerApplication.pdfViewer._pages[pageIndex];
        if ((typeof page.textLayer !== "undefined" && page.textLayer !== null
          &&typeof page.textLayer.textContent !== "undefined"&&page.textLayer.textContent !== null)) {
          clearInterval($scope.flagCheck);
          //theCallback(); // the function to run once all flags are true
          $scope.useless();
          /*$scope.index = 0;
          $scope.highlightStack.length=0;
          $scope.index = 0;*/
          var sents = page.textLayer.textContent.items;
          if(($scope.prevIndex -1)>=0 && ($scope.prevIndex -1)<sents.length) {

            $scope.resetStyle(page.textLayer.textDivs, $scope.prevIndex - 1);
          }
          if(($scope.prevIndex +1)>=0 && ($scope.prevIndex +1)<sents.length) {
            $scope.resetStyle(page.textLayer.textDivs, $scope.prevIndex + 1);
          }
          $scope.isTalking = true;

          $scope.resume();
        }
        else {
          window.PDFViewerApplication.forceRendering();
        }
      }, 1000);
    };
    $scope.nextPhrase =  function(){
      $scope.isTalking = true;
      $scope.dontTriggerEndCallback = false;
      $scope.talkCont(false);
      return;
    };

    $scope.resetStyle= function(array, index)
    {
      $(array[index]).css("background-color", "rgba(0,0,0,0)");
      $(array[index]).css("border-width", "0");
      $(array[index]).css("border-color", "rgba(0,0,0,0)");
    };

    $scope.prevPhrase =  function(){
      $scope.isTalking = true;
      $scope.dontTriggerEndCallback = false;
      gobacAlittle();
      $scope.talkCont(false);
      return;

    };
    $("#zoomInPop").click(function(){
      window.PDFViewerApplication.zoomIn();
    });
    $("#zoomOutPop").click(function(){
      window.PDFViewerApplication.zoomOut();
    });
    window.PDFViewerApplication.open('vm-smalltables.pdf', 0);
    $scope.Analytics = async function(ScreenName)
    {



      function _waitForAnalytics(){
        if(typeof window.analytics !== 'undefined'){
          console.log("ANLYTICS RUNNING");

          // turn on debug mode
          // https://github.com/danwilson/google-analytics-plugin#javascript-usage


          // start tracker
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/

          window.analytics.startTrackerWithId('UA-102157499-2');

          // set user id
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

          window.analytics.setUserId($scope.userID );

          // track a view
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
          // Hint: Currently no support for appName, appId, appVersion, appInstallerId
          //       If you need support for it, please create an issue on github:
          //       https://github.com/driftyco/ng-cordova/issues

          window.analytics.trackView(ScreenName);

          // set custom dimensions
          // https://developers.google.com/analytics/devguides/platform/customdimsmets



          // track event
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

          window.analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

          // add transaction
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

          window.analytics.addTransaction(1234, 'Acme Clothing', 11.99, 5, 1.29, 'EUR');

          // add transaction item
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

          window.analytics.addTransactionItem(
            1234, 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', 11.99, 1, 'GBP'
          );

          // allow IDFA collection to enable demographics and interest reports
          // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

          window.analytics.setAllowIDFACollection(true);
        }
        else{

          setTimeout(function(){
            //console.log("analytics not there yet");
            _waitForAnalytics();
          },250);
        }
      };
      _waitForAnalytics();

    };
    $scope.Analytics("Started Listen PDF v2");
    $scope.useless();
  });
