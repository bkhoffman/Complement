// Hold all script until page loads
$(document).ready(function () {

    $("#recipeSearch").click(function (event) {
        event.preventDefault();
        var string = $("#inputIngredients").val().trim();
        if (string === "") {
            validateInput();
            return false;
        }
        var searchString = string.replace(" ", ",");
        edamamCall(searchString);
        $(".resultsCard").css("display","block");
        $("#inputIngredients").val("");
    });

    function edamamCall(searchString) {
        $("#results").empty();
        var queryURL = "https://api.edamam.com/search?q=" + searchString + "&app_id=8a052bc1&app_key=c17b6fd5914c8c62342c0a50b7b283e2";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var recipeArray = response.hits;
            for (var i = 0; i < recipeArray.length; i++) {
                var card = $("<div>");
                card.addClass("card recipeCard");
                card.attr("data-label", `${recipeArray[i].recipe.label}`);
                card.attr("data-url", `${recipeArray[i].recipe.url}`);
                card.attr("data-ingredients", JSON.stringify(recipeArray[i].recipe.ingredientLines));
                card.attr("data-source", `${recipeArray[i].recipe.source}`);
                card.attr("data-imageUrl", `${recipeArray[i].recipe.image}`);

                var cardHeader = $("<div>").addClass("card-header");
                cardHeader.text(recipeArray[i].recipe.label);

                var cardBody = $("<div>").addClass("card-body");
                cardBody.html(`<img src="${recipeArray[i].recipe.image}" class="img-fluid mx-auto d-block">`);

                card.append(cardHeader, cardBody);
                $("#results").append(card);
            }
        });
    }

    $(document).on("click", ".recipeCard", function () {
        $("#recipeBody").empty();
        $("#recipeTitle").empty();
        $("#recipeIngredients").empty();
        $("#beer-results").empty();

        var string = $(this).attr("data-label");
        if (string.includes(" ")) {
            var firstWord = string.substring(0, string.indexOf(" " || "-"));
        }
        else {
            var firstWord = string;
        }
        beerSelection(firstWord);


        var cardImg = `<img src="${$(this).attr('data-imageUrl')}" class="img-fluid mx-auto d-block"></img>`
        var cardLink = `Recipe Location: <a href="${$(this).attr('data-url')}" target="_blank">${$(this).attr('data-source')}</a>`
        $("#recipeTitle").html($(this).attr("data-label"));
        $("#recipeBody").append(cardImg, cardLink);
        var JSONstr = $(this).attr("data-ingredients");
        var array = JSON.parse(JSONstr);
        $.each(array, function (index, value) {
            $("#recipeIngredients").append("<li>" + value + "</li>");
        });
        $("#myModal").modal("show");
    });

    $(document).on("click", "li", function(){
        if($(this).css("text-decoration") === "line-through solid rgb(33, 37, 41)"){
            $(this).css("text-decoration", "none");
        }
        else{
            $(this).css("text-decoration", "line-through");
        }
    });


    function beerSelection(firstWord) {
        var beerQueryURL = "https://api.punkapi.com/v2/beers/?food=" + firstWord;

        $.ajax({
            url: beerQueryURL,
            method: "GET"
        })
            .then(function (response) {
                if (response.length === 0) {
                    var card = $("<div>").addClass("card modalCard");
                    var cardHeader = $("<div>").addClass("card-header text-center");
                    cardHeader.text("No Beer Pairing Found");
                    var cardBody = $("<div>").addClass("card-body text-center");
                    var img = `<img src="/images/nobeer.jpg" class="img-fluid mx-auto d-block beer-image">`;
                    cardBody.append(img);
                    card.append(cardHeader, cardBody);
                    $("#beer-results").append(card);

                }
                else {
                    for (var i = 0; i < 1; i++) {
                        var name = response[i].name;
                        var image = response[i].image_url;
                        var abv = response[i].abv;

                        var card = $("<div>").addClass("card modalCard");
                        var cardHeader = $("<div>").addClass("card-header text-center");
                        cardHeader.text(name);
                        var cardBody = $("<div>").addClass("card-body text-center");
                        var img = `<img src="${image}" class="img-fluid mx-auto d-block beer-image">`;
                        var abvString = `ABV: ${abv}`;
                        cardBody.append(img, abvString)
                        card.append(cardHeader, cardBody);
                        $("#beer-results").append(card);
                    }

                }
            })
    }

    function validateInput() {
        var text = "Please enter an ingredient";
        document.getElementById("valAlert").innerHTML = text
    }
    
    $("#inputIngredients").on("click", function(){
        var text = "";
        document.getElementById("valAlert").innerHTML = text
    })

    $(".dropdown-item").on("click", function () {
        var beerValue = $(this).text();
        console.log(this);
        console.log(beerValue);
        beerType(beerValue);
        $(".resultsCard").css("display", "block");
    });

    function beerType(beerValue) {
        $("#results").empty();
        var beerTypeQuery = "https://api.punkapi.com/v2/beers/?beer_name=" + beerValue;

        $.ajax({
            url: beerTypeQuery,
            method: "GET"
        })
            .then(function(response) {
                for (var i = 0; i < 7; i++) {
                    console.log(response);
                    var food = response[i].food_pairing[0];
                    console.log(food);
                    var card = $("<div>");
                    card
                        .addClass("card recipeCard")
                        .attr("data-label", response[i].name)
                        .attr("data-image", response[i].image_url)
                        .attr("data-abv", response[i].abv)
                        .attr("data-food", food);

                    var cardHeader = $("<div>").addClass("card-header");
                    cardHeader.text(response[i].name);

                    var cardBody = $("<div>").addClass("card-body");
                    cardBody.html(`<img src="${response[i].image_url}" class="img-fluid mx-auto d-block">`);

                    card.append(cardHeader, cardBody);
                    $("#results").append(card);
                }
            })
    }

 

});