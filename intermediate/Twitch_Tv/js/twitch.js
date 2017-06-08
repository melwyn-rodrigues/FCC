
 $("html").addClass("hidden");
 $(document).ready(function() {
	$("html").removeClass("hidden");
/*
   
	$("#online1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																	
	$("#online").css({'border-bottom': '2px solid red'});
										
	$(".twitch_data_container").hide();
    $(".blue").parents(".twitch_data_container").show();
	});	

	$("#offline1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																	
	$("#offline").css({'border-bottom': '2px solid red'});
										
	$(".twitch_data_container").hide();
    $(".grey").parents(".twitch_data_container").show();
	});	

	$("#all-channels1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																			
	$("#all").css({'border-bottom': '2px solid red'});
										
	$(".blue").parents(".twitch_data_container").show();
    $(".grey").parents(".twitch_data_container").show();
    $(".red").parents(".twitch_data_container").show();
	});
	*/
/*										
	$("#online2").on( "click", function() {
	$("#online2").css({'border-bottom': '2px solid red'});
	$("#offline2").css({'border': 'none'});
	$("#all-channels2").css({'border': 'none'});
										
	display();
	});	
	
	$("#offline2").on( "click", function() {
	$("#offline2").css({'border-bottom': '2px solid red'});
	$("#online2").css({'border': 'none'});
	$("#all-channels2").css({'border': 'none'});
										
	display();
	});	

	$("#all-channels2").on( "click", function() {
	$("#all-channels2").css({'border-bottom': '2px solid red'});
	$("#online2").css({'border': 'none'});
	$("#offline2").css({'border': 'none'});
	display();
	});	
*/
       var twitchChannels = ["ESL_SC2",  "cretetion","OgamingSC2","freecodecamp", "storbeck", "habathcx", "riotgames", "syndicate", "RobotCaleb", "noobs2ninjas", "brunofin", "comstar404"];
 //   var twitchChannels = ["brunofin"];
 //var twitchChannels = ["cretetion", "freecodecamp"];
     var twitchData = [];  
  
     var template=$('#twitch_data_template').html();   // grabs the html template [Handlebars code]
     var compiled = Handlebars.compile(template);    // compiles the template [Handlebars code]
   
	display();     // Task#3 - this additional code solved the issue		
	function display(){						
 
		
//		var url= "https://en.wikipedia.org/w/api.php?action=opensearch&search=Calgary&format=json&callback=?";			
//		var twitterEndpoint = "https://cors-anywhere.herokuapp.com/";
	//	var url=	twitterEndpoint+"https://wind-bow.gomix.me/twitch-api/streams/ESL_SC2/?callback=?";
		for (var i = 0; i < twitchChannels.length; i++) {       
		    var channel=twitchChannels[i];
		    getChannelData(channel);     
		}
	
			
	     var compiledHtml=compiled({data:twitchData});    //passes data to the compiled template [Handlebars code]
	      console.log(twitchData);
		  
//	      console.log(compiledHtml);
	      $('#twitch_data_output').html(compiledHtml);   //Handlebars code 		
			}			//display function close 			
		
		
	function getChannelData(channel){

      var url=	"https://wind-bow.gomix.me/twitch-api/streams/"+channel+"?callback=?";

      $.ajax({
																	
		type: "GET",															
		url: url,
		cache:false,
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data) {
			
			console.log(data);		// shows status onload of all 12 channels (online & offline)
									//- main differntiator is Object {stream:null} and
									//Object{stream:object}
						

			if (data.stream!==null){    
				console.log(data);		// shows status onload of all online channels 
				twitchData.push({
				channelName: data.stream.channel.display_name,
				twitchImage:data.stream.channel.logo,
				channelMessage: data.stream.channel.status.trunc(50),
				status: "<span class='blue' style='color:blue'>Online</span>"
				      });  
			     } //if call 
		       
		        else {
				url=	"https://wind-bow.gomix.me/twitch-api/channels/"+channel+"?callback=?";
				$.ajax({
									     
				type: "GET",															
				url: url,
				cache:false,
				contentType: "application/json; charset=utf-8",
				async: false,
				dataType: "json",
				success: function (data) {
					console.log(data);		// shows status onload of all offline(8) and closed(2) channels (Total 10)
										//- main differntiator is Object {status:null or staus:"some text"} and
										//Object{status:404}
				
					if (data.status===404){		// this if else is used to identify the offline streams which
	//					                      // have a image(logo) and those that don't.
							console.log(data);		// shows status onload of all closed channels 
	
				             twitchData.push({
							channelName: channel,
							twitchImage: "images/closed.jpg",										     
							channelMessage: "",
							status: "<span class='red' style='color:red'>Account Closed</span>"
							      });   //push
					}	
					
				checkImage(data,channel);	
											
				         } //success
				}); // ajax call
			} //else                                          			 
		},     // success function
   	
      
      			
		error: function(jqXHR, textStatus, errorThrown) {    // if ajax call does not go through
			console.log(textStatus);	

		$('#twitch_data_output').html('<h2>Something went wrong!<br> <br>The AJAX call did not go through</h2><p><b>' + textStatus  + '</b> ' + errorThrown  + '</p>');        
                  }									
		
      
        	});     // ajax call
			
	}  // getChannelData function - close

	
			function checkImage(data,channel){
					if (data.logo!==null & data.status!==404){		// Task#2 this if else is used to identify the offline streams which
						                      // have a image(logo) and those that don't.
				              twitchData.push({
							channelName: data.display_name,
							twitchImage:data.logo,										     
							channelMessage: "",
							status: "<span class='grey' style='color:grey'>Offline</span>"
							      });   //push
					}
					else if(data.status!==404){                              // Task#2 (contd) - this code is added for channels which do not hava a image(logo)
						twitchData.push({
						     channelName: channel,
	//					     twitchImage: "https://static-cdn.jtvnw.net/jtv-static/404_preview-300x300.png",
						     twitchImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/twitch-symbol2.jpg",
						     channelMessage: "",
						     status: "<span class='grey' style='color:grey'>Offline</span>"
						    });   //push
			
						} //else
	
			}
	

/**
 * @summary Prototype for truncating the string.
 *
 * @param number $n Character count for truncated string.
 *
 * @return string Truncated string.
 */

String.prototype.trunc = String.prototype.trunc ||
function( n ){
	return ( this.length > n ) ? this.substr( 0, n-1 ) + '&hellip;' : this;
};



 //When all the ajax calls start 
  $(document).ajaxStart(function() {
		$(".check").show();
  });

  //When all the ajax calls are done and dusted
  $(document).ajaxStop(function() {
		$("#loading").addClass("hidden"); 
  });










	$("#online1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																	
	$("#online").css({'border-bottom': '2px solid red'});
	display();					// needed for the 1st time click				
	$(".twitch_data_container").hide();
    $(".blue").parents(".twitch_data_container").show();
	});	

	$("#offline1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																	
	$("#offline").css({'border-bottom': '2px solid red'});
	display();						// needed for the 1st time click												
	$(".twitch_data_container").hide();
    $(".grey").parents(".twitch_data_container").show();
	});	

	$("#all-channels1").on( "click", function() {
	$("#main").removeClass("hidden");
	$("#remote1").addClass("hidden");																			
	$("#all").css({'border-bottom': '2px solid red'});
	display();							// needed for the 1st time click											
	$(".blue").parents(".twitch_data_container").show();
    $(".grey").parents(".twitch_data_container").show();
    $(".red").parents(".twitch_data_container").show();
	});


//When the all button link is clicked display all the channels
  $("#all").click(function() {
    $(".blue").parents(".twitch_data_container").show();
    $(".grey").parents(".twitch_data_container").show();
    $(".red").parents(".twitch_data_container").show();
	
	$("#all").css({'border-bottom': '2px solid red'});
	$("#online").css({'border': 'none'});
	$("#offline").css({'border': 'none'});
  });

  //When the online button link is clicked display only the channels which are online
  $("#online").click(function() {
    $(".twitch_data_container").hide();
    $(".blue").parents(".twitch_data_container").show();
	
	$("#online").css({'border-bottom': '2px solid red'});
	$("#offline").css({'border': 'none'});
	$("#all").css({'border': 'none'});
  });

  //When the offline button link is clicked display only the channels which are offline
  $("#offline").click(function() {
    $(".twitch_data_container").hide();
    $(".grey").parents(".twitch_data_container").show();
	
	$("#offline").css({'border-bottom': '2px solid red'});
	$("#online").css({'border': 'none'});
	$("#all").css({'border': 'none'});
  });
							
 });      //  document.ready
			

	
