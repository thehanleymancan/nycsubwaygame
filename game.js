$(document).ready(function() {
	var printer = console.log; 
    printer("page loaded")
    var numTrains = 0; //number of trains attempted, in play
    var numSteps = 0; 
    var trainLocations = ["unknown","between 14th and 23rd","at 23rd","between 23rd 28th","at 28th","between 28th and 33rd","at 33rd","towards Grand Central"];
    var locationNow; 
    var personLocations = ["At 23rd Platform","At 23rd in train", "in train","At 28th Platform","33rd in train","33rd on platform"]; 
    var personNow; 
    var personInTrain = false; 
    var trainStatus; 
    const button = $('button#nexter'); 
    const person = $('div#person-you'); 
    const train = $('div.progressBar'); 
    var success = 0; 



	var  seconds = 0, secondsHold = 0, minutes = 0, hours = 0,
	    t;

	var timeHold = $('#timeHold'); 

	function add() {
	    seconds++;
	    secondsHold++;
	    if (seconds >= 60) {
	        seconds = 0;
	        minutes++;
	        if (minutes >= 60) {
	            minutes = 0;
	            hours++;
	        }
	    }
	    
	    var timeContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
	    timeHold.html(timeContent); 
	    timer();
	}
	function timer() {
	    t = setTimeout(add, 1000);
	}




	 function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	 }
	    

    var setLocationTrain = function(location) {
       locationNow = location;
       $('#trainLocation').html(locationNow); 
    }

    var setLocationPerson = function(location) {
      personNow = location; 
      $('#yourLocation').html(personNow); 
    }

    var setStatusTrain = function(status) {
       trainStatus = status; 
       $('#trainStatus').html(trainStatus).animate({opacity:"1"},500,function() {

       }); 
       $('#stepCount,.steps_message').html(numSteps); 

    }



var postGame = function() {
  $('#ad-for-famprr').show(); 
	$('#duringGame').hide(); 
	//calculate IRL time.. 
	//look at secondsHold .. 
	printer("calc consider secs "+secondsHold);
	var supplement_time = 0; 
	var trainAddition = 230; //seconds for each train. 
	supplement_time = numTrains * trainAddition; 
	printer("supplment is "+supplement_time); 
    printer("num steps is "+numSteps); 
	var irl_time = 6 * (secondsHold + (numSteps-10)); 
	printer("irl time is "+irl_time); 
	irl_time += supplement_time; 
	//reductions 
	var reductions = 0; 
	if(numSteps<45) {
		reductions += 100; 
	} else if (numSteps<28) {
		reductions+= 180; 
	}
	if (numTrains<2) {
		reductions +=  75; 
	}
    printer("reductions are "+reductions); 
    irl_time -= reductions; 	

	printer("irl plus supplement is "+irl_time); 
	var minutes = Math.floor(irl_time / 60);
	var seconds = irl_time - minutes * 60;
     var irl_time_print = minutes > 9 ? minutes : "0" + minutes; 
    irl_time_print += ":" + (seconds > 9 ? seconds : "0" + seconds);

    $('#irl_time').html(irl_time_print); 
    $('.trains_message').html(numTrains); 
    if(success) {
    	$('.success_message').html("YES - you've landed with the Eagle. "); 
      $('img#photo-failure').hide(); 

    } else {
    	$('.success_message').html("NO - maybe you can do sth at GCT..");
      $('img#photo-success').hide(); 
    }


	$('#postGame').show(); 
	$('#btn-replay').on("click",function() {
		location.reload(); 
	})
}




var goToFailure =  function(numOpens) {
	    clearTimeout(t);
    	setLocationPerson("In train!"); 
    	clearTimeout(t);
    	if(numOpens<1) {
    	  setStatusTrain("Train abruptly departed."); 

    	} else {
    		setStatusTrain("You did not get off :-("); 
    	}
    	setLocationTrain("Heading to Grand Central"); 
    	
    	train.animate({width:"100%"},"fast",function() {
    		setLocationPerson("Screwed"); 
    		$('#station-33').addClass("past"); 
    		button.html("Move on..").off().on("click",function() {
    			postGame(); 
    		})
    	})
    }



var goToSuccess = function() {
	success = 1; 
	clearTimeout(t);
	alert("You have gotten off at 33rd Street!! "); 
  $('div#photoHold33').show(); 
	button.hide(); 
	setLocationTrain("Who cares?"); 
	setLocationPerson("Thinking how to ascend to street level."); 
	$('#station-33').addClass("success"); 
	setTimeout(trainLeaves,1400); 


	function trainLeaves() {
		train.animate({width:"100%"},"slow",function() {
			//
			button.html("Results").show().off().on("click",function() {
				postGame(); 
             
			})

		})
	}

}


var at33 = function() {
	printer("at func 33"); 
	$('div#station-33').addClass("arrived"); 
	setLocationTrain("At 33rd Station"); 
	setStatusTrain("The doors are closed"); 
	personInTrain = true; 
	person.addClass("at33").hide(); 
	setLocationPerson("In train"); 

    button.off().on("click",getStatus).show(); 

    var at33_list = ["The doors are closed.","The doors are open","People are exiting","People are entering","You have exited","The train has departed.","The doors are half open"]
    var at33_now = at33_list[0]; 

    var numOpens = 0; 
    var pplEnter = 0; 
    var pplExit = 0; 

	function getStatus() {
       numSteps++; 
		button.hide(); 
       printer("get status..."); 
       var possibleNextStatus = []; 
       printer("current status is "+at33_now); 
       if(at33_now==at33_list[0]) {
       	//the doors are closed
       	printer("since doors closed")
       	       //closed, open, departed
       	possibleNextStatus = [at33_list[0],at33_list[1],at33_list[0],at33_list[1],at33_list[5],at33_list[6]]; 

       	//has opened yet?
       	if(numOpens<1) { //make more possible
       		possibleNextStatus.push(at33_list[1],at33_list[1],at33_list[6]); 
       	}

       	if(personInTrain) {
       		//need dilute prob leaving
       		possibleNextStatus.push(at33_list[1],at33_list[6],at33_list[0])
       	}



       } //end of Closed
       else if (at33_now==at33_list[1]) { //OPEN
         printer("since doors open"); 
           //closed, open, you depart,doors half open
         possibleNextStatus = [at33_list[0],at33_list[1],at33_list[4],at33_list[4],at33_list[6]]; 
         if(pplEnter<1) {
         	possibleNextStatus.push(at33_list[3],at33_list[3]); 

         }

         if(pplExit<1) {
         	possibleNextStatus.push(at33_list[2],at33_list[2]); 

         }


         numOpens++; 

       } else if (at33_now==at33_list[2]) { //PPL EXITING

          possibleNextStatus = [at33_list[0],at33_list[1],at33_list[6],at33_list[4]]; 
          if(pplEnter<1) {
          	possibleNextStatus.push(at33_list[3]); 
          }

       } else if (at33_now==at33_list[3]) {  // PPL ENTERING

              possibleNextStatus = [at33_list[0],at33_list[1],at33_list[6],at33_list[4]]; 
	          if(pplExit<1) {
	          	possibleNextStatus.push(at33_list[2]); 
	          }           

       } else if (at33_now==at33_list[4]) {   // you exited

       } else if (at33_now==at33_list[5]) {  //TRAIN DEPARTED
       	  //this addressed below, as it marks eitehr moot point or catastrophe
       	  printer("...train departed wha"); 


       } else if (at33_now==at33_list[6]) {  //DOORS HALF OPEN
       
          possibleNextStatus = [at33_list[0],at33_list[1],at33_list[0],at33_list[1],at33_list[6]];

       }

       at33_now = possibleNextStatus[getRandomInt(0,possibleNextStatus.length-1)];

       setStatusTrain(at33_now); 
		button.fadeIn(1800); 


       if(at33_now==at33_list[4]) {
       	 goToSuccess(); 
       }
       if(at33_now==at33_list[5]) {
       	  if(personInTrain) {
       	  	goToFailure(numOpens); 
       	  }

       }
	} //end of function getStatus 

}



 var between2833 = function() {
     $('div#station-28').addClass("past"); 
     locationNow = trainLocations[5]; 
     setLocationTrain(locationNow); 
     personNow = personLocations[2]; 
     setLocationPerson(personNow); 

     train.css("width","60%"); 
     	//train location 6 is 33, 7 is overshoot to GCT
     	//present width is 60.. target width is 88

      //decide in this initial state , only once, whether is Express
      // one in 4 chance.. 
      let express_possible = [0,1,0,1,0,0,0,0]; //2/8 chance
      let express_or_not = express_possible[getRandomInt(0,7)]; 
      if(express_or_not==1) {
         alert("This 6 train will henceforth be an Express.");
         makeExpress(); 

      } else {
         printer("gonna stay the course.. ");
         var numShorts = 0; 
         moveTowards33(); 
      }

    button.off().show().on("click",moveTowards33); 

    function makeExpress() {
        
    	setLocationPerson(""); 
    	setStatusTrain("Acting as an Express"); 
    	setLocationTrain("Heading to Grand Central"); 
    	
    	train.animate({width:"100%"},"fast",function() {
    		setLocationPerson("Screwed"); 
    		clearTimeout(t);
    		$('#station-33').addClass("past"); 
    		button.html("Move on?").off().on("click",function() {
    			postGame();  
    		})
    	})
    }


     function moveTowards33() {
         numSteps++; 
         button.hide(); 
     	//this function is the decider .
     	//sends to one of 3 based on random

     	//option 1 - go and land on 33
     	//option 2 - go and land somewhere short of 33
     	//option 3 - stay where are
     	printer("move towards 33... ");
     	printer("num shorts is "+ numShorts); 
     	var move_ahead = "stay"; 
     	if(numShorts<2) {
        printer("use long list")
     	let poss_list = ["stay","goAndLand","goShort"]; 
     	 move_ahead = poss_list[getRandomInt(0,2)]; 
     	//printer("m a is"+move_ahead)
        } else {
        	printer("use abridged list"); 
      	let poss_list = ["stay","goAndLand"]; 
     	move_ahead = poss_list[getRandomInt(0,1)];     	
        }

     	printer("move ahead is "+move_ahead); 
 
      var travel_times = [1500,2200,3000,4400,6000]; 
      var time_getto_28 = travel_times[getRandomInt(0,4)]; 
      printer("travel time shall be "+time_getto_28);     	


     	if(move_ahead=="goAndLand") {
            setStatusTrain("The train is moving.");
     		train.animate({width:"88%"},time_getto_28,function() {
               at33(); 
     		}); 

     	} else if (move_ahead=="stay") {
     		setStatusTrain("The train is stopped."); 
     		button.fadeIn(1800); 

     	} else if (move_ahead=="goShort") {
     		setStatusTrain("The train is moving."); 
     		numShorts++; 
            if(numShorts==1) {  //remember this is % of full width.. so max is 88
            	var targetPerc = "70%";
            } else if(numShorts==2) {
            	var targetPerc = "80%"; 
            }

            //run the train.. then show butt
            //note: we could make Rate/speed a variant. 
            train.animate({width:targetPerc},time_getto_28,function() {
                button.fadeIn(1800); 
                setStatusTrain("The train is stopped.");
            })

     	}


     }



   }; //end of func between2328







  var pre28 = function() {
    train.css("width","0px"); 
    $('#station-23').removeClass("past"); 
    setLocationTrain("unknown"); 
    setStatusTrain("waiting for new train"); 
    person.addClass("at28").show(); 
    setLocationPerson("On platform at 28th."); 
    $('#station-28').removeClass("arrived"); 


        var pre28_list = ["n/a","The tunnel is dark","There is a light in the tunnel","The train is coming","The train is stationery.","The train has arrived."]
        var pre28_now = pre28_list[0]; 


        
        button.show().off().on("click",function() {
        	numSteps++; 
        	printer("hey now")
        	button.hide(); 
        	$('#trainStatus').animate({opacity:"0"},800,function() {
             getStatus(); 
          }); 
      
        }); 


        function getStatus() {
            if(pre28_now==pre28_list[0]) { //unknown
            	//set possibles
                var possibleNextStatus = [pre28_list[1],pre28_list[2]]; 
                //do something that obtains a status 
               
                pre28_now =possibleNextStatus[getRandomInt(0,1)]; 
                
            
            } else if(pre28_now==pre28_list[1]) { //dark
            	                        //possible: dark, light, coming, 
                var possibleNextStatus = [pre28_list[1],pre28_list[2],pre28_list[3]]; 
               
                pre28_now =possibleNextStatus[getRandomInt(0,2)]; 
            } else if(pre28_now==pre28_list[2]) { //light
            	//possible: dark, light, coming, stationery
                var possibleNextStatus = [pre28_list[1],pre28_list[2],pre28_list[3]]; 
                pre28_now =possibleNextStatus[getRandomInt(0,2)]; 
            } else if(pre28_now==pre28_list[3]) { //train is coming
            	                        //possible: coming, stationery,arrived
                var possibleNextStatus = [pre28_list[3],pre28_list[4],pre28_list[5]]; 
                pre28_now =possibleNextStatus[getRandomInt(0,2)]; 
       
            } else if(pre28_now==pre28_list[4]) { //train is stationery
            	                        //possible: coming, stationery
                var possibleNextStatus = [pre28_list[3],pre28_list[4]]; 
                pre28_now =possibleNextStatus[getRandomInt(0,1)]; 
            } else {
            	printer("exception? 5?"); 
            }






            //set status .. 
            setStatusTrain(pre28_now); 
            //set location
            if(pre28_now==pre28_list[0] || pre28_now==pre28_list[1] || pre28_now==pre28_list[2]) {
            	setLocationTrain(trainLocations[0]); //'unknown'
            } else {
            	setLocationTrain(trainLocations["Between 28 and 28th."]); //on way to 23
            	$('div.progressBar').css("width","30%"); 
            	$('div#station-23').addClass("past"); 
            }
            
            
            //what to do next.. depending on outcome.. 
            //if train has arrived... go to function re. at 23
            if(pre28_now==pre28_list[5]) {
                
                train.animate({width:'50%'},1800,function() {
                	at28(); 
                })
               
            } else {
            	button.fadeIn(1800); 
            }
            //else show button here, 

        } //end of function 

    } //end of pre28





  var at28 = function() {
     $('div#station-28').addClass("arrived"); 
     locationNow = trainLocations[4]; 
     setLocationTrain(locationNow); 

     var at28_list = ["The doors are closed.","The doors are open","People are exiting.","People are entering","You are pushed out.","You are back inside.","The train has moved on.","The doors are half open."];

     setStatusTrain(at28_list[0]); 

     if(personInTrain) {
     	person.addClass("at28").hide();
        setLocationPerson("In train");      	
     } else {
     	person.addClass("at28").show(); 
     	setLocationPerson("On platform 28th"); 
     }

     


     //legend of list


       var at28_now = at28_list[0]; 
        button.off().show().on("click",function() {
        	numSteps++; 
        	printer("hey now 28")
        	button.hide(); 
        	$('#trainStatus').animate({opacity:"0"},800,function() {
             getStatus(); 
          }); 
        	
        }); 



      var pushedOut = 0; //
      var hasOpened = 0; //must open at least once
      var pplExit = 0; 
      var pplEnter = 0; 


     /*
      0 closed, 1 open 
      2 ppl exit   3 ppl entering
      4 pushed out   5 back in
      6 train moves on.. 
      7 doors half open

     */ 

      function getStatus() {

      	 var possibleNextStatus = []; 

         if(at28_now==at28_list[0]) {
       	   //doors are closed
       	   //closed, open,leave
       	   printer("door closed .. ")
       	   if(hasOpened<1) {
            printer("door not been opened.")
       	    possibleNextStatus = [at28_list[1],at28_list[1],at28_list[1],at28_list[0],at28_list[7] ];
       	   
       	   } else {
       	   	printer("door has been opened ..")
             //doors closed. already opened once. 
            if(personInTrain) {
            	printer("person in train")
                //person in train. most likely is move on.. secondly, open. third, closed
       	         possibleNextStatus = [at28_list[6],at28_list[6],at28_list[1],at28_list[0],at28_list[7] ];
            } else {
            	printer("person not aboard")
               //person has bounced off train... 
               //most likely open so he can get in. but mustinclude poss leaves w/o him
                possibleNextStatus = [at28_list[1],at28_list[1],at28_list[1],at28_list[0],at28_list[6]]
            }

            printer("some kind of close door Exception? ")
 
       	   } //end has opened. 

       } else if (at28_now==at28_list[1]) {
       	    printer("doors are open ")
           //the doors are open 
           //if person not in .. . let him in 
           //back in, ppl enter, close, ppl exit  
           if(!personInTrain) {
           	   possibleNextStatus = [at28_list[5],at28_list[5],at28_list[0],at28_list[3],at28_list[4]];
           } else {
           	 //person on train .. doors open. 
           	
             
           	 //have people gotten off yet? 
           	 if(pplExit<1) {
           	    possibleNextStatus = [at28_list[2],at28_list[2],at28_list[2],at28_list[0]]; 
           	 } else if (pplEnter<1) {
           	    possibleNextStatus = [at28_list[3],at28_list[3],at28_list[3],at28_list[0]]; 

           	 } else {
           	 	 if(pushedOut<1) {
           	 	  possibleNextStatus = [at28_list[0],at28_list[1],at28_list[4]]; 
           	 	} else {
                  possibleNextStatus = [at28_list[0],at28_list[1]]; 
           	 	}

           	 }
           	 possibleNextStatus.push(at28_list[7])




           }


       } else if (at28_now==at28_list[7]) { //doors half open
       	  possibleNextStatus = [at28_list[7],at28_list[0],at28_list[1]]; 

       } else if (at28_now==at28_list[2]) {
            //people are exiting. 
            if(personInTrain && pushedOut<1) {
            	//posssible he may be pushed outside.. , door shut, people enter. 
            	 possibleNextStatus = [at28_list[4],at28_list[0],at28_list[3]];
            } else {
            	//entering. closed
            	 possibleNextStatus = [at28_list[3],at28_list[1],at28_list[0]];
            }



       } else if(at28_now===at28_list[3]) {
          //people are entering
          //if he is outside
          if(!personInTrain) {
          	 possibleNextStatus = [at28_list[3],at28_list[5],at28_list[5],at28_list[1],at28_list[0]];

          } else {
          	  // close, open, ppl enter
             possibleNextStatus = [at28_list[0],at28_list[1],at28_list[3]];
          }



       } else if(at28_now==at28_list[4]){
         //you were pushed out .. 
           //people can exit, enter.. the door is open.. you get baCK inside. the door is closed
          possibleNextStatus = [at28_list[0],at28_list[1],at28_list[2],at28_list[3],at28_list[5]]; 
       }  else if (at28_now==at28_list[5]) {
          //you are back inside.. 
           possibleNextStatus = [at28_list[0],at28_list[1],at28_list[6],at28_list[6]];



       }  else {
       	  printer("exception... ")


       } //end  of else if .. .
            
            at28_now = possibleNextStatus[getRandomInt(0,possibleNextStatus.length-1)];
            // personInTrain = false;
            // at28_now = at28_list[6]; //testing .. force out.. 
            //set status .. 
            setStatusTrain(at28_now); 
            //set person location .. (in or out )

            if(at28_now==at28_list[1]) {
            	hasOpened++; 
            }

            if(at28_now==at28_list[2]) {
            	pplExit++; 
            }
            if(at28_now==at28_list[3]) {
            	pplEnter++; 
            }

            //person.. 
            if(!(personInTrain) && at28_now==at28_list[5]) {
            	personInTrain = true; 
            	person.hide(); 
            	setLocationPerson(personLocations[2]); //in train 28
            } //dont else it.. only invalidated if pushed out

            if(personInTrain && at28_now==at28_list[4]) {
            	personInTrain = false; 
            	pushedOut++; 
            	person.show(); 
            	setLocationPerson(personLocations[3]); //platform
            }
 
            
            //what to do next.. depending on outcome.. 
            //if train has arrived... go to function re. at 23
            if(at28_now==at28_list[6]) { //the train is leaving 
                
                //are you on train?
                if(!personInTrain) {

                	alert("it left without you!"); 
                	//send train out then start fresh
                	train.animate({
                		width:'100%'
                	},'fast',function() {

                		pre28(); 
                	})


                } else {
                  alert("! GOOD !! \n\n You are on a train to 33rd !")
                	setStatusTrain("! Going to 33rd !"); 
                	between2833(); 
                	
                }

            } else {
            	button.fadeIn(1800); 
            }
            //else show button here, 




      }//end of getStatus 


  }  //end of at 28 





   var between2328 = function() {
     $('div#station-23').addClass("past"); 
     locationNow = trainLocations[3]; 
     setLocationTrain(locationNow); 
     personNow = personLocations[2]; 
     setLocationPerson(personNow); 
     //moving.. progress bar .. 

     var travel_times = [1500,2200,3000,4400,6000]; 
     var time_getto_28 = travel_times[getRandomInt(0,4)]; 
     printer("travel time shall be "+time_getto_28); 

     train.animate({
     	width:'50%'
     },time_getto_28,function() {
         at28(); 
     }); 



   }; //end of func between2328


    var at23 = function(inWait) { //? is having now arrived, ? versus waiting for you. 
		numTrains++; 

		$('#trainCount').html(numTrains); 
       console.log("at 23rd street ");
       $('#station-23').addClass("arrived"); 
       $('.progressBar').css("width","13%"); 

          locationNow = trainLocations[2]; 
          setLocationTrain(locationNow); 

       if(inWait=="no") {
          
          setStatusTrain("The train has arrived."); 

       } else {

          setStatusTrain("Wow, train already here."); 

       }


  
       

       

       // list has 7 values .. 
       var at23_list = ["The doors are closed.","The doors are open","People are exiting."];
       at23_list.push("The train has moved on."); 
       at23_list.push ("You approach the doors."); 
       at23_list.push ("You are inside the train."); 
       at23_list.push ("You are pushed outside the train.");  

       var at23_now = at23_list[0]; //doors closed
        button.off().show().on("click",function() {
        	numSteps++; 
        	printer("hey now 23")
        	button.hide(); 
        	$('#trainStatus').animate({opacity:"0"},800,function() {
             getStatus(); 
          }); 
        	
        }); 



      var pushedOut = 0; 

      function getStatus() {
       var possibleNextStatus = []; 
       if(at23_now==at23_list[0]) {
       	   //doors are closed
       	   //closed, open,leave
       	   // let possibleNextStatus = []; 
       	   if(personInTrain) {

       	    possibleNextStatus = [at23_list[0],at23_list[1],at23_list[3] ];
       	   } else {
       	   	//need to make less probable that train leaves w/o people getting in...
       	   	//weighted..  and more likely doors open
       	   	 possibleNextStatus = [at23_list[0],at23_list[0],at23_list[0],at23_list[1],at23_list[0],at23_list[1],at23_list[3] ];
       	   
       	   }

       	   if(inWait=="yes") {
       	   	//train was already in station. make more probable it will leave
       	   	possibleNextStatus.push(at23_list[3],at23_list[0])
       	   }


       } else if(at23_now==at23_list[1]) {
       	   //doors are open
       	   //nextstatus depends on if you are in train or not. 
       	   if(personInTrain) { //open,close,pushed out (if haven't already)
       	   	  if(pushedOut<1) {
       	   	  	    //closed, open, pushed out
       	       possibleNextStatus = [at23_list[0],at23_list[1],at23_list[6] ]; 
       	      } else {
       	      	   //closed, open
       	       possibleNextStatus = [at23_list[0],at23_list[1] ]; 
       	      }
       	   
       	  } else {  //doors are open, you are not in train
       	   	  //closed, open, people exit, you approach, you are inside
       	       possibleNextStatus = [at23_list[0],at23_list[1],at23_list[2],at23_list[4],at23_list[5] ]; 
       	   
       	       if(inWait=="yes") {
                  possibleNextStatus.push(at23_list[0])
       	       }

       	   }


       } else if (at23_now==at23_list[2]) {
       	 //people are exiting
       	 // you approach, you inside
       	  possibleNextStatus = [at23_list[4],at23_list[5]]; 


       } else if (at23_now==at23_list[4]) {
       	  //you approach the doors
       	  //this only happens if person not in train.. 
       	  //poss : approach, inside
       	  possibleNextStatus = [at23_list[4],at23_list[4],at23_list[5],at23_list[5],at23_list[5] ]; 

           	   if(inWait=="yes") {
                  possibleNextStatus.push(at23_list[0])
       	       }   

       } else if (at23_now==at23_list[5]) {
       	  //you are inside the train
       	  //poss : pushed out. (can only happen once.) . closed, open, departs
       	  if(pushedOut<1) { //weighted
             possibleNextStatus = [at23_list[6],at23_list[0],at23_list[1],at23_list[0],at23_list[1],at23_list[3]]

       	  } else {
            possibleNextStatus = [at23_list[0],at23_list[1],at23_list[0],at23_list[1],at23_list[0],at23_list[3]]
       	  }



       } else if (at23_now==at23_list[6]) {
       	 //you are pushed out.. 
       	   // doors are closed. you approach, you are inside, train has left
       	   possibleNextStatus = [at23_list[0],at23_list[4],at23_list[5],at23_list[3]]
       } else {
           printer("exception? "); 
       //end possibles
       }


       //examine value of at23_now
       //note if personintrain
       	   at23_now =possibleNextStatus[getRandomInt(0,possibleNextStatus.length-1)];  

            //set status .. 
            setStatusTrain(at23_now); 
            //set person location .. (in or out )

            //person.. 
            if(!(personInTrain) && at23_now==at23_list[5]) {
            	personInTrain = true; 
            	person.hide(); 
            	setLocationPerson(personLocations[1]); //in train 23
            } //dont else it.. only invalidated if pushed out

            if(personInTrain && at23_now==at23_list[6]) {
            	personInTrain = false; 
            	pushedOut++; 
            	person.show(); 
            	setLocationPerson(personLocations[0]); //platform
            }
 
            
            //what to do next.. depending on outcome.. 
            //if train has arrived... go to function re. at 23
            if(at23_now==at23_list[3]) { //the train is leaving 
                
                //are you on train?
                if(!personInTrain) {

                	alert("it left without you!"); 
                	train.animate({
                		width:'100%'
                	},'fast',function() {

                		pre23(); //back to waiting ... 
                	})

                } else {

                	setStatusTrain("! Heading to 28th !"); 
                	between2328(); 
                }

            } else {
            	button.fadeIn(1800); 
            }
            //else show button here, 


      } //end of getStatus 




    } //end of at23 function 


    var pre23 = function() {

        var pre23_list = ["n/a","The tunnel is dark","There is a light in the tunnel","The train is coming","The train is stopped.","The train has arrived."]
        var pre23_now = pre23_list[0]; 

        train.css("width","0%"); 
        $('#station-23').removeClass("arrived"); 
        setLocationTrain("unknown"); 


        
        button.show().off().on("click",function() {
        	numSteps++; 
        	printer("hey now")
        	button.hide(); 
        	$('#trainStatus').animate({opacity:"0"},800,function() {
             getStatus(); 
          }); 
        }); 


        function getStatus() {
            if(pre23_now==pre23_list[0]) { //unknown
            	//set possibles
                var possibleNextStatus = [pre23_list[1],pre23_list[2]]; 
                //do something that obtains a status 
               
                pre23_now =possibleNextStatus[getRandomInt(0,1)]; 
                
            
            } else if(pre23_now==pre23_list[1]) { //dark
            	                        //possible: dark, light, coming, 
                var possibleNextStatus = [pre23_list[1],pre23_list[2],pre23_list[3]]; 
               
                pre23_now =possibleNextStatus[getRandomInt(0,2)]; 
            } else if(pre23_now==pre23_list[2]) { //light
            	//possible: dark, light, coming, stationery
                var possibleNextStatus = [pre23_list[1],pre23_list[2],pre23_list[3]]; 
                pre23_now =possibleNextStatus[getRandomInt(0,2)]; 
            } else if(pre23_now==pre23_list[3]) { //train is coming
            	                        //possible: coming, stationery,arrived
                var possibleNextStatus = [pre23_list[3],pre23_list[4],pre23_list[5]]; 
                pre23_now =possibleNextStatus[getRandomInt(0,2)]; 
       
            } else if(pre23_now==pre23_list[4]) { //train is stationery
            	                        //possible: coming, stationery
                var possibleNextStatus = [pre23_list[3],pre23_list[4]]; 
                pre23_now =possibleNextStatus[getRandomInt(0,1)]; 
            } else {
            	printer("exception? 5?"); 
            }






            //set status .. 
            setStatusTrain(pre23_now); 
            //set location
            if(pre23_now==pre23_list[0] || pre23_now==pre23_list[1] || pre23_now==pre23_list[2]) {
            	setLocationTrain(trainLocations[0]); //'unknown'
            } else {
            	setLocationTrain(trainLocations[1]); //on way to 23
            	$('div.progressBar').css("width","6%"); 
            }
            
            
            //what to do next.. depending on outcome.. 
            //if train has arrived... go to function re. at 23
            if(pre23_now==pre23_list[5]) {
                at23("no"); 
               
            } else {
            	button.fadeIn(1800); 
            }
            //else show button here, 

        } //end of function 

    } //end of pre23

    var init = function() {
      setLocationTrain(trainLocations[0]); //train location is unknown (pre23)
      setLocationPerson(personLocations[0]); 
      //remove station classes
      $('div.station').removeClass("arrived"); 
      $('div.progressBar').css("width","0%"); 


      // call to function pre23
       
       //at start, 2 possibilities.. no train, or is a train in waiting. 

       var initFate = getRandomInt(1,7); //odds are 5/7 its not there. 
       printer("init fate is "+initFate);

  
       if(initFate<6) {
         pre23();
       } else {
       	 at23("yes"); //train is at 23rd.. inwait

       }

   
        

      //testing
      //at33(); 
     



       timer();

    



    } //end of init 


    //init(); 

    //show instructions..
    $('div#preGame').fadeIn("fast",function() {
    	//the button... 
    	$('#btn-goPlay').on("click",function() {
    		$('div#preGame').fadeOut(900,function() {
    			init(); 
    			$('div#duringGame').fadeIn(900,function() {

    			})
    		})
    	})
    })




}); 