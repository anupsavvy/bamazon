var mysql = require("mysql");
var inquirer = require("inquirer");

var config = require('./config.js');
var connection = mysql.createConnection(config);

// show all products for sale 

connection.connect();

connection.query('SELECT * from products', function (error, results, fields) {
  if (error) throw error;
  console.log("List of all products present with BAmazon : \n");
  for(var result of results){
  	console.log(result.item_id,result.product_name,result.price);
  }
  askQuestions();
});

function disconnectDB(){
	connection.end();
}

function askQuestions(){
	inquirer.prompt([{
		type: 'input',
		name: 'item_id',
		message:"Enter the id of the item you want to buy : \n"
	},
	{
		type:'input',
		name:'units',
		message:'How many units would you like to buy? \n'
	}
	]).then(function (answers) {
	    connection.query('SELECT stock_quantity,price from products where ?',{item_id:answers.item_id}, function (error, results, fields) {
	  			if (error) throw error;
	  			if (results[0].stock_quantity >= answers.units){
	  				var price = results[0].price;
	  				var quantity = results[0].stock_quantity;
	  				connection.query('update products set stock_quantity = ? where ?',
	  					[quantity-answers.units,{item_id:parseInt(answers.item_id)}],function(error, results, fields){
	  						if (error) throw error;
	  						console.log("You need to pay :",price*answers.units);
	  					});
	  				disconnectDB();
	  			}else{
	  				console.log("Sufficient units are not present. \n");
	  				disconnectDB();
	  			}
			});
	});
}

