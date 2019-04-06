// Hold all script until page loads
$(document).ready(function () {

    $("#recipeSearch").click(function (event) {
        event.preventDefault();
        var string = $("#inputIngredients").val().trim();
        console.log(string);
        if (string === "") {
            validateInput();
            return false;
        }
        else {
            if (string.includes(" ")) {
                var firstWord = string.substring(0, string.indexOf(" "));
            }
            else {
                var firstWord = string;
            }
        }
        console.log(firstWord);
        var searchString = string.replace(" ", ",");
        console.log("click");
        edamamCall(searchString);
        $("#inputIngredients").val("");
        beerSelection(firstWord);
        console.log(firstWord);
    });

    function edamamCall(searchString) {
        var queryURL = "https://api.edamam.com/search?q=" + searchString + "&app_id=8a052bc1&app_key=c17b6fd5914c8c62342c0a50b7b283e2";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var recipeArray = response.hits;
            for (var i = 0; i < recipeArray.length; i++) {
                var card = $("<div>");
                card.addClass("card recipeCard");
                card.attr("data-label", `${recipeArray[i].recipe.label}`);
                card.attr("data-url", `${recipeArray[i].recipe.url}`);
                card.attr("data-ingredients", `${recipeArray[i].recipe.ingredientLines}`);
                card.attr("data-source", `${recipeArray[i].recipe.source}`);
                card.attr("data-imageUrl", `${recipeArray[i].recipe.image}`);
                // card.attr("data-toggle", "modal");
                // card.attr("data-target", "#myModal");

                var cardHeader = $("<div>").addClass("card-header");
                cardHeader.text(recipeArray[i].recipe.label);

                var cardBody = $("<div>").addClass("card-body");
                cardBody.html(`<img src="${recipeArray[i].recipe.image}" class="img-fluid mx-auto d-block">`);

                card.append(cardHeader, cardBody);
                $("#results").append(card);
            }
            //response.hits gives an array of 10 recipes
            //use a for loop to iterate throuh the 10 recipes looking at 
            //response.hits[0].recipe.image for the recipe image url
            //response.hits[0].recipe.label for the recipe name string
            //response.hits[0].recipe.ingredientLines is an array of ingredients
            //response.hits[0].recipe.url gives the url for recipes original location
            //response.hits[0].recipe.source gives the string name of the website that is the recipes source

        });
    }

    $(document).on("click", ".recipeCard", function () {
        console.log("clicked the recipeCard");
        console.log($(this).attr("data-label"));
        // $("#myModal").clear();
        var cardImg = `<img src="${$(this).attr('data-imageUrl')}" class="img-fluid mx-auto d-block"></img>`
        var cardLink = `<a href="${$(this).attr('data-url')}">${$(this).attr('data-source')}</a>`
        $("#recipeTitle").html($(this).attr("data-label"));
        $("#recipeBody").append(cardImg, cardLink);
        var str = $(this).attr("data-ingredients");
        var array = str.split(',');
        $.each(array, function (index, value) {
            $("#recipeIngredients").append("<li>" + value + "</li>");
        });
        $("#myModal").modal("show");
    });


    function beerSelection(firstWord) {
        var beerQueryURL = "https://api.punkapi.com/v2/beers/?food=" + firstWord;

        $.ajax({
            url: beerQueryURL,
            method: "GET"
        })
            .then(function (response) {
                for (var i = 0; i < 1; i++) {
                    console.log(response);
                    var name = response[i].name;
                    var image = response[i].image_url;
                    var abv = response[i].abv;

                    var card = $("<div>").addClass("card");
                    var cardHeader = $("<div>").addClass("card-header text-center");
                    cardHeader.text(name);
                    var cardBody = $("<div>").addClass("card-body text-center");
                    var img = `<img src="${image}" class="img-fluid mx-auto d-block">`;
                    var abvString = `ABV: ${abv}`;
                    cardBody.append(img, abvString)
                    card.append(cardHeader, cardBody);
                    $("#beer-results").append(card);
                    // var beerDiv = $("<div>");
                    // beerDiv
                    //     .addClass("beer-choice");

                    // var beerImg = $("<img>");
                    // beerImg
                    //     .addClass("beer-image")
                    //     .attr("src", image);
                    // var title = $("<p>");
                    // title
                    //     .addClass("beer-name")
                    //     .text(name);
                    // var percent = $("<p>");
                    // percent
                    //     .addClass("beer-abv")
                    //     .text(abv + "%");

                    // beerDiv
                    //     .append(beerImg)
                    //     .append(title)
                    //     .append(percent);

                    // $("#beer-results").append(beerDiv);
                }
            })
    }

    function validateInput() {
        var text = "Please enter an ingredient";
        document.getElementById("valAlert").innerHTML = text
    }
});