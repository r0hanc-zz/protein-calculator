
var age = 0, gender = "male", weight = "", height = "", active = "", foodPrefer = "";



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

fucntion calculate() {

    var age = 20;//AGE VALUE
    var gender = "male"; // 'male' OR 'female' 
    weight = 120; // WEIGHT IN KG,
    height = 120; //HEIGHT IN ANY 
    active = "active"; //POSSIBLE VALUES ARE sedentary/light/moderate/active
    foodPrefer = "vegan" //POSSIBLE VALUES ARE vegetarian/vegan/eggitarian/nonvegetarian; 
	
	var proteinFactor = calculateFactor(active, gender, age);
	proteinRequired = weight * proteinFactor;
	return proteinRequired;
}

