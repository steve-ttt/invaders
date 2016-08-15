/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
    

    var game = new Phaser.Game(480, 640, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
    var ship;
    var enemies;
    var newEnemy;
    var enemyInfo;
    var background;
    var shot;
    var enemyBullet;
    var shots;
    var shotVelocity = 300;
    var enemyBulletSpeed = 400;
    var enemyXvelocity = 1;
    var scoreText;
    var levelText;
    var stateText;
    var level = 1;
    var score = 0;
    var firingTimer = 0;
    var livingEnemies = [];
    
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 'black';
        game.load.image('ship', 'img/ship.png');
        game.load.image('enemy', 'img/enemy1.png');
        game.load.image('background','img/background.jpg');
        game.load.image('laser', 'img/laser.png');
        game.load.image('enemyBullet', 'img/laserGreen.png');
        
    }
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.tileSprite(0, 0, 480, 640, 'background');
        game.input.onTap.add(onTap, this);
        
        ship = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ship');
        ship.anchor.set(0.5,1);
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.immovable = true;
        ship.scale.setTo(0.75);
        
        shots = game.add.group();
        initEnemy();
        
        scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#0095DD' });
        levelText = game.add.text(200, 5, 'Level: 1', { font: '18px Arial', fill: '#0095DD' });
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '36px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.scale.setTo(0.3);
        //enemyBullets.body.velocity.set(0, shotVelocity * -1);
        enemyBullets.setAll('anchor.x', 1);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);
    
    }
    
    function update() {
        
        ship.x = game.input.x || game.world.width*0.5;
        game.physics.arcade.collide(shots, enemies, enemyHit);
        game.physics.arcade.collide(ship, enemyBullets , playerHit);
        if (game.time.now > firingTimer) {
            enemyFires();
        }
        
        //enemies.x = enemies.x + e
        //nemyXvelocity;
        //debugText.setText('x-pos: '+enemies.x +'group width:' +enemies.width);
        //if (enemies.x + 60 +230 >= game.world.width) {
        //    enemyXvelocity = enemyXvelocity * -1.0 ;
        //    enemies.y = enemies.y + 20;
        //} else if (enemies.x <= -200  ) {
        //    enemyXvelocity = enemyXvelocity * -1.0 ;
        //    enemies.y = enemies.y + 20;
        //}
    }
    
function initEnemy() {
        enemyInfo = {
            width: 40,
            height: 40,
            count: {
                row: 8,
                col: 3
            },
            offset: {
                top: 50,
                left: 10
            },
            padding: 5
            }
            
        enemies = game.add.group();
    for(c=0; c<enemyInfo.count.col; c++) {
        for(r=0; r<enemyInfo.count.row; r++) {
            var enemyX = (r*(enemyInfo.width+enemyInfo.padding))+enemyInfo.offset.left;
            var enemyY = (c*(enemyInfo.height+enemyInfo.padding))+enemyInfo.offset.top;
            newEnemy = game.add.sprite(enemyX, enemyY, 'enemy');
            newEnemy.scale.setTo(0.5, 0.5);
            game.physics.enable(newEnemy, Phaser.Physics.ARCADE);
            //newEnemy.body.immovable = false;
            //newEnemy.anchor.set(0.5);
            enemies.add(newEnemy);
        }
    }
    
     //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(enemies).to( { x: 100 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
    
    }
    

function onTap(pointer, doubleTap) {

        createShot();
        // background.visible =! background.visible;
    

}

function createShot() {
    shot = game.add.sprite(ship.x -5, ship.y - 80, 'laser');
    shot.scale.setTo(0.3);
    game.physics.enable(shot, Phaser.Physics.ARCADE);
    //shot.setAll('outOfBoundsKill', true);
    //shot.setAll('checkWorldBounds', true);
    shot.body.velocity.set(0, shotVelocity * -1);
    //shot.body.collideWorldBounds = true;
    shot.body.bounce.set(1);
    shot.checkWorldBounds = true;
    shot.events.onOutOfBounds.add(function(){
        shot.kill;
    }, this);
    shots.add(shot);
}

function enemyHit (shot, enemy) {
    score += 10;
    scoreText.setText('Points: '+score);
    enemy.kill();
    shot.kill();
    
    //if(score === enemyInfo.count.row*enemyInfo.count.col*10 ) {
    if(enemies.countLiving() == 0   ){ 
    //    for (i=1; i <= enemyInfo.count.row*enemyInfo.count.col; i++) {
            
    //        var reviveEnemy = enemies.getFirstExists(false);
    //        if (reviveEnemy) {
    //            reviveEnemy.revive();
            
    //        }
    //    }
    //    level += 1;
    //    enemyXvelocity = enemyXvelocity + .05;
    //    levelText.setText('Level: '+level);
        //enemies.x = 50;
        //enemies.y = 60;
                enemyBullets.callAll('kill');

        stateText.text=" CONGRATULATIONS \n You saved the day \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
        //alert('You saved the United Federation from the ailen theat, congratulations!');
        //location.reload();
    }
}

function hitWall (wall, enemies) {
    enemies.x += 1 * -1.0;
    
}

function descend() {

    enimies.y += 10;

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    enemies.forEachAlive(function(enemy){

        // put every living enemy in an array
        livingEnemies.push(enemy);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);
    console.log('shooter x: ' +shooter.body.x +'shooter y: ' +shooter.body.y)
        game.physics.arcade.moveToObject(enemyBullet,ship,enemyBulletSpeed);
        firingTimer = game.time.now + 2000;
    }

}

function playerHit() {
    
        ship.kill();
        enemyBullets.callAll('kill');

        stateText.text="All your base \n are belong to us!!! \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
}

function restart () {

    //  A new level starts
    
    //resets the life count
    //lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    enemies.removeAll();
    initEnemy();

    //revives the player
    ship.revive();
    //hides the text
    stateText.visible = false;

}