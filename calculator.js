
var food = loadData();
var suggestedItems = suggestedFoodItems();
var uniqueFoodNames = loadUniqueName(food);
var proteinRequired = 0;
var age = "", gender = "", weight = "", height = "", active = "", foodPrefer = "";
var myFoodIntake = [];
var proteinIntake = 0;
var suggestionFoodItems= [];

jQuery(".meal").click(function(){
    jQuery(this).removeClass("collapsed");
});

jQuery(".meal").click(function(){
    jQuery(this).toggleClass("active");
    jQuery(this).addClass("active");
});

jQuery("#submit-step-1").click(function(e){
    e.stopPropagation();
    e.preventDefault();

    age = jQuery("#age").val();
    gender = jQuery("#gender").val(), 
    weight = jQuery("#weight").val(),
    height = jQuery("#height").val(),
    active = jQuery("#active").val();
    foodPrefer = jQuery("#foodPrefer").val();

    if(age == "" || gender == "" || weight == "" || height == "" || active == "" || foodPrefer == ""){
        alert("All fields are mandatory");
        return ;
    }else{
        weight = converWeight(parseInt(weight));
        var proteinFactor = calculateFactor(active, gender, age);
        proteinRequired = weight * proteinFactor;
        jQuery("#protein-requirement .grams").html(parseInt(proteinRequired));
    }
    gotoStep("1-1");
});

jQuery("#submit-step-1-1").click(function(){
	jQuery(this).parents(".vc_col-sm-6").hide();
	jQuery(this).parents(".vc_col-sm-6").siblings(".vc_col-sm-6").css({"margin": "0 auto"});
	gotoStep(2);
})
function converWeight(weight) {
    return jQuery(".weightfactor").val() === "kgs" ? weight : weight/2.2;
}

function calculateFactor(active, gender, age) {

	if((gender == 'male' && age <= 18) || (gender == 'female' && age <= 15)){
		return 0.9;
	} else {
		if(age > 15 && age <= 18) {
			return 0.8;
		}
	}
	
    if(active == "sedentary"){
        return 0.8;
    } else if (active == "light") {
        return 1.2;
    } else if (active == "moderate") {
        return 1.6;
    } else if (active == "active") {
        return 1.8;
    }
	
    return 1.4;
}

function gotoStep(stepCount) {
    console.log(stepCount);
    jQuery(".step").removeClass("visible");
    jQuery(".step-"+stepCount).addClass("visible");
    if(stepCount === 3) {
        suggestFoodItems();
    }
}

jQuery(".add-item").click(function(){
    var formContainer = jQuery(this).parents(".tab-pane").find(".food-items");
    var foodItem = jQuery(".food-item").clone();
    foodItem.removeClass("food-item").show();
    formContainer.append(foodItem);
});

function populateFoodList(elem){
    if(jQuery(elem).val().length > 0){
        jQuery(elem).removeClass("is-invalid");
        items = uniqueFoodNames.filter(function(item) {
            return item.toLowerCase().includes(jQuery(elem).val().toLowerCase());
        });
        list = items.map(function(item) {
            return "<li><a href='javascript:void(0);' onclick=\'addItem(this,\""+item+"\")\'>"+item+"</a></li>";
        });
        jQuery(elem).siblings(".suggest-list").show().find("ul").html(list);
    } else {
        jQuery(elem).siblings(".suggest-list").find("ul").html("<li>No item found with that name<li>");
    }
}

function loadUniqueName(food) {
    var uniqueNames = [];
    jQuery.each(food, function(i, el){
        if(jQuery.inArray(el.name, uniqueNames) === -1) uniqueNames.push(el.name);
    });
    return uniqueNames;
}

function addItem(elem, val){
    currentElement = jQuery(elem);
    currentElement.parents(".suggest-list").hide();
    currentElement.parents(".input-group").find(".suggest-food").val(val).prop({ "disabled": true });
    
    items = food.filter(function(item) {
        return item.name.toLowerCase() === val.toLowerCase();
    });
    if(items.length) {
        var portions = populatePortions(items);
        currentElement.parents(".form-row").find(".food-quantity-container").html(portions);
    }
    
    currentElement.parents(".suggest-list").empty();
}

function populatePortions(items) {
    if(items.length > 1) {
        options = items.map(function(item){
            return "<option value='"+item.portion+"'>"+item.portion+"</option>";
        });
        return "<div class='input-group '>"+
                        "<input type='number' min='0' onchange='removeQuantityErrorClass(this)' placeholder='Quantity' value='1' class='form-control portion-quantity'>"+
                        "<select class='form-control portion-type' required onchange='removePortionErrorClass(this);'>"+
                            "<option value=''>-- Select Portion Size --</option>"+ 
                                options + 
                        "</select>"+
                        "<div class='showTooltip'><i class='fa fa-info-circle'></i>"+
                        "<div class='tooltip portions-tooltip'>"+
                        "<ul>"+
                        "<li class='portion portion-small-bowl'>Small Bowl<span>150ml</span></li>"+
                        "<li class='portion portion-big-bowl'>Big Bowl<span>350ml</span></li>"+
                        "<li class='portion portion-tea-cup'>Tea Cup<span>180ml</span></li>"+
                        "<li class='portion portion-glass'>Glass<span>250ml</span></li>"+
                        "</ul></div></div>"+
                        "<button class='btn btn-danger' onclick='removeFoodItem(this);' type='button'>X</button>"+
                "</div>";
    } else {
        return "<div class='input-group'><input type='text' class='form-control' readonly></div>";
    }
}

function removeQuantityErrorClass(elem){
    if(jQuery(elem) && jQuery(elem).val > 0){
        jQuery(elem).removeClass("is-invalid");
    }
}

function removePortionErrorClass(elem) {
    if (jQuery(elem) && jQuery(elem).val() !== ""){
        jQuery(elem).removeClass("is-invalid");
    }
}
jQuery(document).ready(function(){

jQuery(".submit-meal button").click(function(){
    var items = jQuery(".form-row:visible");
    myFoodIntake = [];
    jQuery.each(items, function(index, elem){
        
        foodItem = jQuery(elem).find(".suggest-food").val();
        foodQuantity = jQuery(elem).find(".portion-quantity").val() == "" ? 0 : parseFloat(jQuery(elem).find(".portion-quantity").val());
        foodPortion = jQuery(elem).find(".portion-type").val();
        if(foodItem == "") {
            jQuery(elem).find(".suggest-food").addClass("is-invalid");
            return;
        }

        if(foodPortion == "") {
            jQuery(elem).find(".portion-type").addClass("is-invalid");
            return;
        }
        if(foodQuantity <= 0) {
            jQuery(elem).find(".portion-quantity").addClass("is-invalid");
            return;
        }
        intake = food.filter(function(i){
            return i.name.toLowerCase() === foodItem.toLowerCase() && i.portion === foodPortion;
        })[0];
        divisor = 1;
		if(intake.portion == "Gram" || intake.portion == "ml"){
			divisor = 100;
		}
        myFoodIntake.push({
            name: intake.name,
            portion: intake.portion,
            protein: intake.protein,
            carbs: intake.carbs,
            fats: intake.fats,
            fibre: intake.fibre,
            quantity: foodQuantity,
            totalProtein: foodQuantity * parseFloat(intake.protein) / divisor,
            totalCarbs: foodQuantity * parseFloat(intake.carbs) / divisor,
            totalFats: foodQuantity * parseFloat(intake.fats) / divisor,
            totalFibre: foodQuantity * parseFloat(intake.fibre) / divisor
        });
    });
    suggestFoodItems();
});
});

function moveToNextMeal(id){
    tabId = id.slice(id.indexOf("-")+1);
    tabId = tabId == "breakfast" ? "lunch" : tabId == "lunch" ? "snacks" : tabId == "snacks" ? "dinner" : tabId == "dinner" ? 0 : "breakfast";
    if(tabId == 0) {
        gotoStep(3);
    }
    jQuery('#foodTab a[href="#'+tabId+'"]').tab('show')
}

function removeFoodItem(elem) {
    formRow = jQuery(elem).parents(".form-row");
    formRow.remove();
    /*foodItem = formRow.find(".suggest-food").val();
    foodQuantity = formRow.find(".portion-quantity").length > 0 && formRow.find(".portion-quantity").val() == "" ? 0 : parseFloat(formRow.find(".portion-quantity").val());
    foodPortion = formRow.find(".portion-quantity").length > 0 ? formRow.find(".portion-type").val() : 0;*/
}

function suggestFoodItems() {
	proteinIntakeCount = 0;
	suggestionFoodItems= [];
	jQuery.each(myFoodIntake,function(i,item){
		proteinIntakeCount += item.totalProtein
	});
	suggestedFood(proteinIntakeCount, proteinRequired, 0);
}
            
function suggestedFood(proteinIntakeCount, proteinRequired, proteinSuggested){
	if(proteinSuggested + proteinIntakeCount < proteinRequired) {
		var availableFoodItems =  suggestedItems[foodPrefer];
		var addItem = availableFoodItems[Math.floor(Math.random()*availableFoodItems.length)];
		suggestionFoodItems.push(addItem);
		var proteinSuggested = 0;
		jQuery.each(suggestionFoodItems, function(i, item){
			proteinSuggested += parseFloat(item.protein);
		});
		suggestedFood(proteinIntakeCount ,proteinRequired, proteinSuggested);
	}else{
		generateProteinReport(proteinIntakeCount ,proteinRequired);
	}
	return null;
}

function generateProteinReport(proteinIntakeCount ,proteinRequired){
	proteinRequired = parseInt(proteinRequired);
	proteinIntakeCount = parseInt(proteinIntakeCount);
	proteinDiff = proteinRequired - proteinIntakeCount;
	var resultHeading = "", resultSubText = "", resultLine= "";
	if(proteinIntakeCount < proteinRequired) {
		resultHeading = "Oops!";
		resultSubText = "Your current daily protein consumption is only <span class='current-intake'>"+proteinIntakeCount+" gms</span>. It's <span class='added-intake'>"+proteinDiff+" gms</span> less than your average daily protein requirement.";
		resultLine = "Here are some protein rich foods that can help you fill your protein gap!";
	} else {
		resultHeading = "Great News!";
		resultSubText = "Your protein consumption is <span class='current-intake'>"+proteinIntakeCount+" gms</span>. and matches up to your daily requirement of <span class='matched-intake'>"+proteinRequired+" gms</span>.";
		resultLine = "Need some more options for protein? <br> Here are some must-haves";
	}
	
	jQuery(".popup h1").html(resultHeading);
	jQuery(".popup h3").html(resultSubText);
	jQuery(".popup p").html(resultLine);
	
	tableRows = "<tbody>";
 	jQuery.each(suggestionFoodItems,function (i, item){
		multiply = 1;
		if(item.portion == "Gram" || item.portion == "ml"){
			multiply = 100;
		}
		tableRows += "<tr><td>"+item.name+"</td><td>"+ multiply + " " +item.portion+"</td><td>"+item.protein+" gms</td></tr>"
	})
	tableRows += "</tbody>";

	tableMarkup = "<table><thead><tr><td>Items</td><td>Portion</td><td>Proteins</td></tr></thead>"+tableRows+"<table>";
	jQuery(".popup .table-container").html(tableMarkup);
	jQuery(".popup, .popup-backdrop").show();
}

function closePopup(){
jQuery(".popup, .popup-backdrop").hide();
}