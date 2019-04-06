
$("#recipeSearch").click(function(event){
    event.preventDefault();
    var string = $("#inputIngredients").val().trim();
    var firstWord = string.substring(0, string.indexOf(" "));
    console.log(firstWord);
    var searchString = string.replace(" ", ",");
    console.log("click");
    edamamCall(searchString);
    $("#inputIngredients").val("");
});

function edamamCall(searchString) {
        var queryURL = "https://api.edamam.com/search?q="+searchString +"&app_id=8a052bc1&app_key=c17b6fd5914c8c62342c0a50b7b283e2";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var recipeArray = response.hits;
            for(var i=0; i<recipeArray.length; i++){
                var card = $("<div>");
                card.addClass("card recipeCard");
                card.attr("data-label", `${recipeArray[i].recipe.label}`);
                card.attr("data-url", `${recipeArray[i].recipe.url}`);
                card.attr("data-ingredients", `${recipeArray[i].recipe.ingredientLines}`);
                card.attr("data-source", `${recipeArray[i].recipe.source}`);
                card.attr("data-imageUrl", `${recipeArray[i].recipe.image}`);

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

    $(".recipeCard").click(function(){
        
    });