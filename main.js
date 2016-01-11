var arr = [];
var curIndex;
var imgPre = "https://wow.zamimg.com/images/hearthstone/cards/enus/animated/";
var imgSuf = "_premium.gif";
var firstLoad = true;
var firstImgLoad = true;

var ranks = [{rank: 0, title: "Legend"},
			 {rank: 1, title: "Innkeeper"},
			 {rank: 2, title: "The Black Knight"},
			 {rank: 3, title: "Molten Giant"},
			 {rank: 4, title: "Mountain Giant"},
			 {rank: 5, title: "Sea Giant"},
			 {rank: 6, title: "Ancient of War"},
			 {rank: 7, title: "Sunwalker"},
			 {rank: 8, title: "Frostwolf Warlord"},
			 {rank: 9, title: "Silver Hand Knight"},
			 {rank: 10, title: "Ogre Magi"},
			 {rank: 11, title: "Big Game Hunter"},
			 {rank: 12, title: "Warsong Commander"},
			 {rank: 13, title: "Dread Corsair"},
			 {rank: 14, title: "Raid Leader"},
			 {rank: 15, title: "Silvermoon Guardian"},
			 {rank: 16, title: "Questing Adventurer"},
			 {rank: 17, title: "Tauren Warrior"},
			 {rank: 18, title: "Sorcerer's Apprentice"},
			 {rank: 19, title: "Novice Engineer"},
			 {rank: 20, title: "Shieldbearer"},
			 {rank: 21, title: "Southsea Deckhand"},
			 {rank: 22, title: "Murloc Raider"},
			 {rank: 23, title: "Argent Squire"},
			 {rank: 24, title: "Leper Gnome"},
			 {rank: 25, title: "Angry Chicken"}];

function preloadImages(arr) {
	var imgURL;
	$(arr).each(function() {
		imgURL = imgPre + cardData[this].id + imgSuf;
		$('<img />')[0].src= imgURL;
	});
}

function fillArr() {
	firstImgLoad = true;
	//console.log('filled');
	arr = [];
	while(arr.length < 78){
  		var randomnumber =  Math.floor(Math.random() * cardData.length)
  		var found = false;
  		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == randomnumber) {
				found = true;
				break;
			}
  		}
    	if (!found) arr[arr.length] = randomnumber;
    }
    preloadImages(arr);
    //console.log(arr);
}

var SingleChoice = React.createClass({
	handleClick: function() {
		this.props.callbackParent(this.props.value == curIndex);
	},
	render: function() {
		//console.log("singlechoice");
		var cardId = cardData[this.props.value].id
		//console.log(this.props.value);
		return (
			<img className="cardImage col-md-4" onClick={this.handleClick} src={imgPre + cardId + imgSuf} />
		);
	}
});

var Choices = React.createClass({
	onChildChanged: function(val) {
		this.props.callbackParent(val);
	},
	render: function() {
		//console.log(this.props.value);
		return (
			<div className="row">
				<SingleChoice className="col-md-4" callbackParent={this.onChildChanged} value={this.props.value[0]} />
				<SingleChoice className="col-md-4" callbackParent={this.onChildChanged} value={this.props.value[1]} />
				<SingleChoice className="col-md-4" callbackParent={this.onChildChanged} value={this.props.value[2]} />
			</div>
		)
	}
});

var PlayButton = React.createClass({
	getInitialState: function() {
		return {
			playing: false,
			text: "Play"
		}
	},
	render: function() {
		//console.log("playbutton");
		return (
			<div>
				<p onClick={this.props.onClick} className="play-button">{this.props.value}</p>
			</div>
		)
	}
});

var AnotherOne = React.createClass({
	render: function() {
		//console.log("anotherone");
		return (
			<div>
				<p onClick={this.props.onClick} className="another-one">{this.props.value}</p>
			</div>
		);
	}
});

var Score = React.createClass({
	render: function() {
		//console.log("score");
		return (
			<div>
				<p className="score">Correct: {this.props.value}</p>
			</div>
		);
	}
});

var FlavorText = React.createClass({
	getInitialState: function() {
		var index = Math.floor(Math.random() * cardData.length);
		return {
			command: "another one",
			choicesTrigger: Choices,
			text: cardData[index].flavor
		};
	},
	generateRandom: function(event) {
		//console.log('called');
		var index = Math.floor(Math.random() * cardData.length);
		curIndex = index;
		this.setState({
			command: "and another one",
			text: cardData[index].flavor
		});
	},
	generateSpecific: function(i) {
		this.setState({
			text: cardData[i].flavor
		})
		curIndex = i;
	},
	generate: function(i) {
		//console.log('called by anotherone');
		if (i == - 1) {
			this.generateRandom();
		} else {
			this.generateSpecific(i);
		}
	},
	rawMarkup: function() {
		return {
			__html: this.state.text.toString()
		};
	},
	render: function() {
		//console.log("flavortext");
		return (
			<div>
				<span key="unique-key" className="flavor-text" dangerouslySetInnerHTML={this.rawMarkup()} />
				<AnotherOne value={this.state.command} onClick={this.generateRandom} />
			</div>
		);
	}
});

var Achievement = React.createClass({
	render: function() {
		var title = ranks[this.props.value].title;
		var imageURL = "/images/" + ranks[this.props.value].rank + ".png";
		return (
			<div>
				<p className="message">You achieved the rank of <span>{title}</span>!</p>
				<img className="rank-image" src={imageURL} />
			</div>
		);
	}
});

var View = React.createClass({
	getInitialState: function() {
		fillArr();
		return {
			flavorTextIndex: -1,
			command: "Play",
			currentThree: [arr[0], arr[1], arr[2]],
			curLeast: 0,
			score: 0,
			rounds: 0,
			rank: 25
		};
	},
	newRound: function() {
		if (this.state.rounds == 26) this.quit();
		var newCurLeast;
		if (firstImgLoad) {
			newCurLeast = this.state.curLeast;
		} else {
			newCurLeast = this.state.curLeast + 3;
		}
		var rand = Math.floor(Math.random() * 3);
		var nextRound = this.state.rounds + 1;
		this.setState({
			command: "Quit",
			currentThree: [arr[newCurLeast], arr[newCurLeast + 1], arr[newCurLeast + 2]],
			curLeast: newCurLeast
		});
		this.setState({
			flavorTextIndex: this.state.currentThree[rand],
			rounds: nextRound
		});
		this.refs['firstChild'].generate(arr[newCurLeast + rand]);
		//console.log(rand);
		//console.log(arr[newCurLeast + rand]);
		firstImgLoad = false;
	},
	play: function() {
		//console.log('start');
		console.log(firstLoad);
		if (!firstLoad) fillArr();
		this.newRound();
		this.setState({
			score: 0,
			rounds: 0,
			rank: 25,
			curLeast: 0,
			command: "Quit"
		});
		firstLoad = false;
	},
	quit: function() {
		this.setState({
			command: "Play"
		});
		$('.another-one, .message, .rank-image').show();
		$('.score, .cardImage').hide();
		$('.play-button').attr('data-toggled','off');
	}, 
	handleResponse: function(val) {
		if (val) {
			var newScore = this.state.score + 1;
			var newRank = this.state.rank - 1;
			if (newRank == 0) this.quit();
			this.setState({
				score: newScore,
				rank: newRank
			});
			//console.log(this.state.rank);
			this.newRound();
		} else {
			this.quit();
		}
	},

	changeMode: function() {
		//console.log('changed');
		if (this.state.command == "Play") {
			this.play();
		} else {
			this.quit();
		}
	},
	render: function() {
		//console.log("view");
		return (
			<div>
				<FlavorText ref="firstChild" value={this.state.flavorTextIndex} />
				<Choices callbackParent={this.handleResponse} value={this.state.currentThree} />
				<Score value={this.state.score} />
				<Achievement value={this.state.rank} />
				<PlayButton data={this.state.command} onClick={this.changeMode} value={this.state.command} />
			</div>
		);
	}
});


ReactDOM.render(
	<View />,
	document.getElementById('stuff')
);