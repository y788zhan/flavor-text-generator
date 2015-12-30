/***
var cardData = (function() {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "http://cors.io/?u=https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json",
		'dataType': "json",
		'success': function (response) {
			json = response;
		},
		'error': function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(textStatus);
		}
	})
	  .done(function() {
	  	console.log("done");
	  })
	  .fail(function() {
	  	console.log("error");
	  });
	return json;
}) ();
***/

var flavorText = React.createClass({
	getInitialState: function() {
		var index = Math.floor(Math.random() * cardData.length);
		return {
			text: cardData[index].flavor,
			name: cardData[index].name,
			anotherOne: "another one"
		};
	},
	handleClick: function() {
	    var index = Math.floor(Math.random() * cardData.length);
	    this.setState({
	    	text: cardData[index].flavor,
	    	name: cardData[index].name,
	    	anotherOne: "and another one"
	    });
	},
	rawMarkup: function() {
		var rawMarkup = this.state.text.toString();;
		console.log(rawMarkup);
		return { __html: rawMarkup };
	},
	render: function() {
		return (
			<div>
				<span key="unique_key" className="flavor-text" dangerouslySetInnerHTML={this.rawMarkup()}/>
				<a onClick={this.handleClick} className="another-one">{this.state.anotherOne}</a>
			</div>
		);
	}
});