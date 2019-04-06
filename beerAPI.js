// Hold all script until page loads
$(document).ready(function () {

  function beerSelection() {
    // var searchItem = $(this).attr("food-item");
    var beerQueryURL = "https://api.punkapi.com/v2/beers/?food=steak";
  
    $.ajax({
      url: beerQueryURL,
      method: "GET"
    })
      .then(function(response) {
        for (var i = 0; i < 6; i++) {
          console.log(response);
          var name = response[i].name;
          var image = response[i].image_url;
          var abv = response[i].abv;
  
          var beerDiv = $("<div>");
          beerDiv
            .addClass("beer-choice");
  
          var beerImg = $("<img>");
          beerImg
            .addClass("beer-image")
            .attr("src", image); 
          var title = $("<p>");
          title
            .addClass("beer-name")
            .text(name);
          var percent = $("<p>");
          percent
            .addClass("beer-abv")
            .text(abv + "%");
  
          beerDiv
            .append(beerImg)
            .append(title)
            .append(percent);
  
          $("#").append(beerDiv);
        }
      })
  }
  
  beerSelection();
  
  })