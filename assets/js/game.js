var images = ['battlefield1.jpg', 'battlefield2.jpg', 'battlefield3.jpg'];
var charImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'];
var randomChars;
var myCharacter;
var enemies;
var enemy;

$(document).ready(function()
{
	$('body').css({'background-image': 'url(assets/imgs/' + images[Math.floor(Math.random() * images.length)] + ')', 'background-size': 'cover'});

	initCharacters();
});

// returns a random number between 5 and 14 then multiplies it by 1000 to get a random number between 5000 and 14000
function randomHP()
{
	return (5 + Math.floor(Math.random() * 10)) * 1000;
}

//initializes game attributes such as characters, battlefield and the battle report
function initCharacters()
{
	//initializes the messages at jumbotron at the top of the tree and empties all other messages and variables to ensure a fresh game look and instance
	var h1 = $('<h1>').text('STAR WARS RPG FIGHTING OMG');
	var h2 = $('<h2>').text('OMG CHOOSE YOUR FIGHTER');
	$('#message').empty().append(h1).append(h2);
	$('#battleField').empty();
	$('#battleReport').empty();
	enemies = [];
	$('#characterSelection').empty().show();

	//uses a downloaded javascript file to shuffle an array and set it to randomChars
	randomChars = knuthShuffle(charImages)

	//loops for 4 times to assign each character portait to the character selection div in random order with random hp
	//also assigns each characters attack points and counter attack points
	for(var i = 1; i <= 4; i++)
	{
		var hp = randomHP();
		var charDiv = $('<div>');
		charDiv.attr('id', 'char' + i);
		charDiv.addClass('col-md-3 center-block character').attr('hp', hp).attr('ap', hp/10).attr('cap', hp/10);
		charDiv.appendTo('#characterSelection');

		var charImg = $('<img>');
		charImg.attr('src', 'assets/imgs/characters/' + randomChars[i]);
		charImg.addClass('center-block');
		charImg.appendTo(charDiv);

		var charHP = $('<h2>').addClass('text-center');
		charHP.text(hp);
		charHP.appendTo(charDiv);
	}

	setUpBattleField();
}

//assigns what to do when a character is clicked
function setUpBattleField()
{
	$('.character').click(function()
	{
		//puts all characters into an array, assigns myCharacter variable to the one clicked on and then loops through the rest to
		//populate the enemies array
		var charArray = $('.character').toArray();
		myCharacter = $(this);
		for(var i = 0; i < charArray.length; i++)
		{
			if(myCharacter.is($(charArray[i])))
				continue;

			enemies.push($(charArray[i]));
		}

		//updates the jumbotron message and hides the character selection
		$('#message').empty().append('<h1>COME AT ME BRO</h1>');
		$('#characterSelection').hide();

		//appends the character chosen to the battlefield along with the attack button
		$('#battleField').append(myCharacter.addClass('col-md-offset-1').removeClass('center-block'));
		$('#battleField').append($('<div>').addClass('col-md-3').append($('<button>ATTACK YO</button>').attr('id', 'attackBtn').addClass('btn btn-lg btn-danger')));

		//calls funciton for attacking logic with the given characters
		attacking(myCharacter, loadEnemy());
	});
}

//contains logic for when the attack button is clicked
function attacking(myCharacter, enemy)
{
	$('#attackBtn').click(function()
	{
		//calculates the new hp based on current hp minus attack and counter attack power and then updates their hp attirbutes
		var myCharacterHP = myCharacter.attr('hp') - enemy.attr('cap');
		var enemyHP = enemy.attr('hp') - myCharacter.attr('ap');
		myCharacter.attr('hp', myCharacterHP);
		enemy.attr('hp', enemyHP);

		//tie case: alert that both characters died and restart the game by calling initCharacters
		if(myCharacterHP <= 0 && enemyHP <= 0)
		{
			alert('U BOTH DIED SON')
			initCharacters();
			return;
		}
		//if your character dies, alert and restart the game
		else if(myCharacterHP <= 0)
		{
			alert('OMG YOU DIED');
			initCharacters();
			return;
		}
		//if enemy dies, determine if last enemy or not and alert a message for the corresponding case
		//if no more enemies left restart game, if there are enemies, update the jumbotron message
		//and load new enemy
		else if(enemyHP <= 0)
		{
			alert('U BEAT \'EM SON!!!');
			if(enemies.length == 0)
			{
				alert('U WON SON!!!');
				initCharacters();
			}
			else if(enemies.length == 2)
				$('#message').empty().append('<h1>NOT DONE YET SON</h1>');
			else if(enemies.length == 1)
				$('#message').empty().append('<h1>ONE MORE BRO</h1>');
			
			enemy.empty();
			$('#battleReport').empty();	
			enemy = loadEnemy();
			return;
		}

		//since no one has died, update the hp in the character portait with the calculated hp above
		$(myCharacter).find('h2').text(myCharacterHP);
		$(enemy).find('h2').text(enemyHP);

		//update the battlefield report with the attack and counter attack power that was used against each character
		var report = $('<div>').addClass('text-center col-md-6 col-md-offset-3').css('background-color', 'white');
		var myCharacterMessage = $('<h1>').text('YO U GOT HIT FOR ' + enemy.attr('cap') + ' damage!');
		var enemyMessage = $('<h1>').text('U ATTAKED \'EM ' + myCharacter.attr('ap') + ' damage!')
		$('#battleReport').empty().append(report.append(myCharacterMessage).append(enemyMessage));
	});
}

//pops enemy from the emeies array and appends it to the battlefield and returns it;
function loadEnemy()
{
	var enemy = enemies.pop();
	$('#battleField').append(enemy.addClass('col-md-offset-1').removeClass('center-block'));
	return enemy;
}